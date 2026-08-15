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
- A concise, high-yield explanation "exp" explicitly stating:
  1) Why the answer is right
  2) What it is / definition
  3) Who / Where / When relevant facts (e.g. year founded, act/amendment, location, creator/inventor, or mathematical rule).`;

    const userPrompt = `Generate ${numQuestions} high-probability questions for CIL MT System ${targetPaper === "p1" ? "Paper 1" : "Paper 2"}${section ? ` - Section "${section}"` : ""}.
${customPrompt ? `User focus: ${customPrompt}` : "Focus on latest 2025-2026 examination trends, accurate standard concepts, and Coal India Limited / Computer Science fundamentals."}
Return a structured JSON list of questions with explanation fields.`;

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
