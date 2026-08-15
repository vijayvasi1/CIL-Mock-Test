import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { getCuratedQuestions } from "./server/questionBank.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini SDK with User-Agent header as required
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// In-memory attempt log storage (also saved to client local storage & optional webhook)
interface AttemptLog {
  id: string;
  timestamp: string;
  set: number | string;
  paper: string;
  questionIndex: number;
  questionText: string;
  section: string;
  selectedOption: number;
  correctOption: number;
  isCorrectFirstTry: boolean;
  totalAttemptsOnQuestion: number;
  timeSpentSeconds?: number;
}

const attemptLogs: AttemptLog[] = [];

// API: Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API: Log question attempt feedback
app.post("/api/log-attempt", (req, res) => {
  try {
    const log: AttemptLog = {
      id: "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      ...req.body,
    };
    attemptLogs.push(log);
    // Keep max 5000 logs in memory
    if (attemptLogs.length > 5000) {
      attemptLogs.shift();
    }
    res.json({ success: true, logId: log.id, totalLogged: attemptLogs.length });
  } catch (error) {
    console.error("Error saving log:", error);
    res.status(500).json({ error: "Failed to log attempt" });
  }
});

// API: Retrieve attempt history
app.get("/api/attempt-logs", (_req, res) => {
  res.json({ logs: attemptLogs });
});

// API: Google Sheets / Webhook forwarder
app.post("/api/sync-google-sheet", async (req, res) => {
  const { webhookUrl, records } = req.body;
  if (!webhookUrl) {
    return res.status(400).json({ error: "Webhook URL is required" });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "CIL MT System Mock Test Console",
        timestamp: new Date().toISOString(),
        records: records || attemptLogs,
      }),
    });

    const data = await response.text();
    res.json({ success: true, status: response.status, responseText: data });
  } catch (err: any) {
    console.error("Webhook sync error:", err);
    res.status(502).json({ error: "Failed to forward to webhook: " + err.message });
  }
});

// API: Live Question Generator with Gemini Search Grounding & Resilient Fallback
app.post("/api/generate-questions", async (req, res) => {
  const { paper = "p1", section = "General Awareness", count = 25, customPrompt, search = true } = req.body;

  const targetPaper: "p1" | "p2" = paper === "p2" ? "p2" : "p1";
  const numQuestions = Math.min(Math.max(Number(count) || 25, 5), 100);

  const ai = getGeminiClient();

  // If no Gemini client is configured, return high-yield curated questions directly
  if (!ai) {
    const curated = getCuratedQuestions(targetPaper, section, numQuestions);
    return res.json({
      success: true,
      section,
      paper: targetPaper,
      count: curated.length,
      questions: curated,
      fallback: true,
      warning: "Using curated high-probability CIL MT mock questions (Gemini API key not configured).",
      groundingChunks: [],
    });
  }

  try {
    const systemPrompt = `You are a premier senior subject-matter specialist formulating high-standard multiple choice questions for the Coal India Limited (CIL) Management Trainee (MT) System CBT Examination.
Paper 1 sections: General Awareness (History, Polity, Geography, Economy, Science, Coal Sector & PSUs, Current Affairs), Reasoning Ability, Numerical Ability, and General English.
Paper 2 sections: Computer Science & IT (Data Structures, Algorithms, DBMS, OS, Computer Networks, Theory of Computation, Compiler Design, Digital Logic, Computer Organization, Software Engineering).

Generate ${numQuestions} distinct, rigorously verified MCQs for ${targetPaper === "p1" ? "Paper I (General Aptitude)" : "Paper II (Computer Science & IT)"}.
${customPrompt ? `Specific focus request: "${customPrompt}".` : ""}
Ensure each question has:
- Exactly 4 non-empty options.
- Exactly 1 unambiguously correct option index (0 to 3).
- A difficulty tag: "Easy", "Medium", or "Hard".
- A concise, high-yield explanation "exp" explicitly stating:
  1) Why the answer is right
  2) What it is / definition
  3) Who / Where / When relevant facts (e.g. year founded, act/amendment, location, creator/inventor, or mathematical rule).`;

    const userPrompt = `Generate ${numQuestions} high-probability questions for CIL MT System ${targetPaper === "p1" ? "Paper 1" : "Paper 2"}${section ? ` - Section "${section}"` : ""}.
${customPrompt ? `User focus: ${customPrompt}` : "Focus on latest 2025-2026 examination trends, accurate standard concepts, and Coal India Limited / Computer Science fundamentals."}
Return a structured JSON list of questions with difficulty and explanation fields.`;

    const config: any = {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            section: { type: Type.STRING },
            q: { type: Type.STRING },
            opts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            ans: { type: Type.INTEGER },
            difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
            exp: { type: Type.STRING },
          },
          required: ["section", "q", "opts", "ans", "exp"],
        },
      },
    };

    if (search && targetPaper === "p1") {
      delete config.responseMimeType;
      delete config.responseSchema;
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: userPrompt,
      config,
    });

    const responseText = response.text || "";
    let parsedQuestions: any[] = [];

    try {
      parsedQuestions = JSON.parse(responseText);
    } catch {
      // Attempt to extract JSON from markdown code fences or text
      const clean = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
      const start = clean.indexOf("[");
      const end = clean.lastIndexOf("]");
      if (start !== -1 && end !== -1) {
        parsedQuestions = JSON.parse(clean.slice(start, end + 1));
      }
    }

    if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
      return res.json({
        success: true,
        section,
        paper: targetPaper,
        count: parsedQuestions.length,
        questions: parsedQuestions,
        fallback: false,
        groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
      });
    }

    // If parsing failed or empty array returned, fallback to curated pool
    console.warn("AI generation produced empty or unparseable output; falling back to curated bank.");
    const fallbackQuestions = getCuratedQuestions(targetPaper, section, numQuestions);
    return res.json({
      success: true,
      section,
      paper: targetPaper,
      count: fallbackQuestions.length,
      questions: fallbackQuestions,
      fallback: true,
      warning: "Loaded verified high-probability CIL MT System mock test.",
      groundingChunks: [],
    });
  } catch (error: any) {
    console.error("Gemini generation error (handled gracefully with fallback):", error?.message || error);
    
    // Provide seamless fallback to high-yield verified questions on 429 or any quota error
    const fallbackQuestions = getCuratedQuestions(targetPaper, section, numQuestions);
    const isRateLimit = error?.message?.includes("429") || error?.message?.includes("quota") || error?.message?.includes("RESOURCE_EXHAUSTED");
    
    return res.json({
      success: true,
      section,
      paper: targetPaper,
      count: fallbackQuestions.length,
      questions: fallbackQuestions,
      fallback: true,
      warning: isRateLimit
        ? "AI generation quota limit reached (429). Loaded verified high-probability CIL MT System mock test."
        : "Live AI generation unavailable. Loaded verified high-probability CIL MT System mock test.",
      groundingChunks: [],
    });
  }
});

// API: AI-Powered Personalized Study Schedule Generator
app.post("/api/generate-study-schedule", async (req, res) => {
  const {
    weakTopics = [],
    hardQuestionsFailed = [],
    daysCount = 7,
    dailyHours = 4,
    userCategory = "General / Computer Science",
  } = req.body;

  const validDays = Math.min(Math.max(Number(daysCount) || 7, 3), 30);
  const validHours = Math.min(Math.max(Number(dailyHours) || 4, 1), 12);

  const fallbackSchedule = (topics: string[], hardList: string[]) => {
    const identified = topics.length > 0 ? topics : ["Operating Systems & Deadlocks", "DBMS Normalization & B+ Trees", "Coal India Coal Production & PSU Policies", "Quantitative Arithmetic & Time-Work", "Computer Networks Subnetting"];
    
    const days = [];
    const paperCycle = ["Paper II (CS & IT)", "Paper I (Aptitude)", "Paper II (CS & IT)", "Paper I (Aptitude)", "Full Mock & Revision"] as const;

    for (let i = 1; i <= validDays; i++) {
      const isLastDay = i === validDays;
      const isSecondToLast = i === validDays - 1;
      const paper = isLastDay ? "Full Mock & Revision" : paperCycle[(i - 1) % paperCycle.length];
      const topicIndex = (i - 1) % identified.length;
      const primeTopic = identified[topicIndex] || "Core Fundamentals Review";
      const secondaryTopic = identified[(topicIndex + 1) % identified.length] || "Formula Drills";

      days.push({
        dayNumber: i,
        dayTitle: isLastDay
          ? "Final Speed Drills & High-Yield Formula Recap"
          : isSecondToLast
          ? "Full-Length 200 Marks Simulation & Weak Spot Patching"
          : `Intensive Target Drill: ${primeTopic}`,
        focusPaper: paper,
        timeCommitment: `${validHours} Hours (${Math.round(validHours * 0.6)}h Core Review + ${Math.round(validHours * 0.4)}h Mock MCQ)`,
        keyObjectives: [
          `Master high-probability CIL MT test patterns for ${primeTopic}`,
          `Eliminate recurring errors in ${secondaryTopic}`,
          `Practice minimum ${validHours * 15} timed MCQ questions`,
        ],
        revisionTopics: [
          primeTopic,
          secondaryTopic,
          i % 2 === 0 ? "CIL History, Coal Production Targets & Carbon Neutrality" : "Data Structures & Algorithm Complexities",
        ],
        practiceTarget: `Complete 1 targeted 50-MCQ session + review all missed questions in ${primeTopic}`,
        proTips: i % 2 === 1
          ? "Time yourself strictly at 54 seconds per question to build natural speed for the 200 Qs / 180 Min format."
          : "Never leave negative marking fear unchecked: remember CIL MT has NO negative marking, but accuracy ensures a top merit rank.",
      });
    }

    return {
      title: `Personalized ${validDays}-Day CIL MT (System) Remediation Schedule`,
      durationDays: validDays,
      dailyHours: validHours,
      generatedAt: new Date().toISOString(),
      weakTopicsIdentified: identified,
      summaryDiagnosis: `Based on your recent mock test diagnostics, your high-priority remediation areas are focused on ${identified.slice(0, 3).join(", ")}. Dedicating ${validHours} hours daily using this paced plan will systematically patch conceptual gaps.`,
      days,
    };
  };

  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      success: true,
      schedule: fallbackSchedule(weakTopics, hardQuestionsFailed),
      aiGenerated: false,
    });
  }

  try {
    const prompt = `You are the lead academic strategist for Coal India Limited (CIL) Management Trainee (System) CBT Examination.
The user has completed mock tests and struggles with these specific 'Hard' or weak topics:
Weak Topics & Error Hotspots: ${weakTopics.length > 0 ? weakTopics.join(", ") : "Operating Systems, SQL Normalization, Reasoning Syllogisms, Coal Sector Data"}
Hard Questions Missed: ${hardQuestionsFailed.slice(0, 5).join(" | ")}
Available Study Window: ${validDays} Days, ${validHours} Hours per day.

Generate a comprehensive, scientifically organized day-by-day study schedule to turn their weak areas into strengths before the CIL MT exam.
Follow the exact JSON schema provided.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            durationDays: { type: Type.INTEGER },
            dailyHours: { type: Type.INTEGER },
            generatedAt: { type: Type.STRING },
            weakTopicsIdentified: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            summaryDiagnosis: { type: Type.STRING },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  dayTitle: { type: Type.STRING },
                  focusPaper: {
                    type: Type.STRING,
                    enum: [
                      "Paper I (Aptitude)",
                      "Paper II (CS & IT)",
                      "Full Mock & Revision",
                    ],
                  },
                  timeCommitment: { type: Type.STRING },
                  keyObjectives: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  revisionTopics: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  practiceTarget: { type: Type.STRING },
                  proTips: { type: Type.STRING },
                },
                required: [
                  "dayNumber",
                  "dayTitle",
                  "focusPaper",
                  "timeCommitment",
                  "keyObjectives",
                  "revisionTopics",
                  "practiceTarget",
                  "proTips",
                ],
              },
            },
          },
          required: [
            "title",
            "durationDays",
            "dailyHours",
            "weakTopicsIdentified",
            "summaryDiagnosis",
            "days",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    if (parsed.days && Array.isArray(parsed.days) && parsed.days.length > 0) {
      return res.json({
        success: true,
        schedule: parsed,
        aiGenerated: true,
      });
    }

    return res.json({
      success: true,
      schedule: fallbackSchedule(weakTopics, hardQuestionsFailed),
      aiGenerated: false,
    });
  } catch (err: any) {
    console.error("Error generating AI study schedule:", err);
    return res.json({
      success: true,
      schedule: fallbackSchedule(weakTopics, hardQuestionsFailed),
      aiGenerated: false,
      warning: "Schedule generated with built-in CIL MT heuristic engine.",
    });
  }
});

// Vite middleware / static serving
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CIL MT System Console Server running on port ${PORT}`);
  });
}

setupVite();
