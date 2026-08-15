import React, { useState } from "react";
import {
  EXAM_PATTERN_INFO,
  SYLLABUS_PAPER1,
  SYLLABUS_PAPER2,
  PAPER1_WEIGHTAGE_PREDICTION,
  PAPER2_WEIGHTAGE_PREDICTION,
  TOP_50_HIGH_PROBABILITY_CONCEPTS,
  TOP_25_CIL_PREDICTIONS,
  TOP_25_CS_PREDICTIONS,
  FRESH_PAPER1_QUESTIONS,
} from "../data/researchData";
import {
  Search,
  BookOpen,
  Award,
  CheckCircle2,
  Flame,
  Cpu,
  Layers,
  HelpCircle,
  Eye,
  EyeOff,
  Sparkles,
  Info,
} from "lucide-react";
import { Question } from "../types";

interface ResearchHubProps {
  onStartFreshPaper1: (questions: Question[]) => void;
}

export const ResearchHub: React.FC<ResearchHubProps> = ({ onStartFreshPaper1 }) => {
  const [activeSubTab, setActiveSubTab] = useState<
    | "pattern"
    | "syllabus"
    | "weightage"
    | "top50"
    | "cil25"
    | "cs25"
    | "freshPaper1"
  >("pattern");

  const [searchTerm, setSearchTerm] = useState("");
  const [conceptFilter, setConceptFilter] = useState("all");
  const [showFreshAnswers, setShowFreshAnswers] = useState(false);
  const [freshSectionFilter, setFreshSectionFilter] = useState("all");

  const filteredConcepts = TOP_50_HIGH_PROBABILITY_CONCEPTS.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      conceptFilter === "all" ||
      (conceptFilter === "cs" &&
        ["Data Structures", "Algorithms", "DBMS", "Operating Systems", "Computer Networks", "Computer Organization", "Digital Logic", "Theory of Computation", "Compiler Design", "Software Engineering"].includes(
          c.subject
        )) ||
      (conceptFilter === "ga" &&
        ["Polity & Constitution", "CIL & Coal Sector", "General Awareness / Coal Science", "Current Affairs & Coal Ministry", "Current Affairs / Clean Coal", "Current Affairs / Governance", "Polity", "CIL Operations", "Indian Geography"].includes(
          c.subject
        )) ||
      (conceptFilter === "apt" &&
        ["Numerical Ability", "Reasoning Ability", "General English"].includes(c.subject));
    return matchesSearch && matchesFilter;
  });

  const filteredFreshQuestions = FRESH_PAPER1_QUESTIONS.filter((q) => {
    if (freshSectionFilter === "all") return true;
    return q.section === freshSectionFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Research Hub Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 shadow-sm text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Verified 2025–2026 Examination Research Intelligence
            </div>
            <h2 className="text-2xl font-bold text-slate-100">
              CIL Management Trainee (System) Intelligence Hub
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Comprehensive real-time research synthesis: Official exam pattern, verified Paper 1 & 2 topic weightages, Top 50 high-probability concepts, and 50 domain-specific predictions for Coal India Limited.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onStartFreshPaper1(FRESH_PAPER1_QUESTIONS)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              Launch Fresh 100-Q Paper 1
            </button>
          </div>
        </div>

        {/* Sub-Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 border-t border-slate-700/60 mt-6 scrollbar-thin">
          {[
            { id: "pattern", label: "1. Exam Pattern" },
            { id: "syllabus", label: "2. Verified Syllabus" },
            { id: "weightage", label: "3. Topic Weightages" },
            { id: "top50", label: "4. Top 50 Concepts" },
            { id: "cil25", label: "5. Top 25 CIL Predictions" },
            { id: "cs25", label: "6. Top 25 CS Predictions" },
            { id: "freshPaper1", label: "7. Fresh 100-Q Paper 1" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeSubTab === tab.id
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Exam Pattern View */}
      {activeSubTab === "pattern" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                CIL MT (System) Official CBT Examination Blueprint
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-xs text-slate-500 font-semibold uppercase">Exam Structure</div>
                  <div className="font-bold text-slate-900 text-base mt-1">200 MCQs · 200 Marks</div>
                  <div className="text-xs text-slate-600 mt-1">Paper I (100 Qs) + Paper II (100 Qs)</div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-xs text-slate-500 font-semibold uppercase">Total Duration</div>
                  <div className="font-bold text-slate-900 text-base mt-1">180 Minutes (3 Hours)</div>
                  <div className="text-xs text-slate-600 mt-1">Conducted in a single continuous session</div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-xs text-slate-500 font-semibold uppercase">Marking Scheme</div>
                  <div className="font-bold text-emerald-700 text-base mt-1">+1 Mark per correct MCQ</div>
                  <div className="text-xs text-emerald-800 font-medium mt-1">NO Negative Marking (0 deducted)</div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-xs text-slate-500 font-semibold uppercase">Language Medium</div>
                  <div className="font-bold text-slate-900 text-base mt-1">Bilingual (English & Hindi)</div>
                  <div className="text-xs text-slate-600 mt-1">Except General English section</div>
                </div>
              </div>

              {/* Qualifying Cutoffs */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-3">Qualifying Cutoffs for CBT (Separate Sectional Requirement)</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-sm">
                    <span className="font-semibold text-slate-900">General (UR) / EWS Candidates</span>
                    <span className="font-bold text-amber-900">Min 40 marks/paper · 60% Overall</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                    <span className="font-semibold text-slate-900">OBC (Non-Creamy Layer) Candidates</span>
                    <span className="font-bold text-slate-900">Min 35 marks/paper · 55% Overall</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                    <span className="font-semibold text-slate-900">SC / ST / PwBD Candidates</span>
                    <span className="font-bold text-slate-900">Min 30 marks/paper · 50% Overall</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3 italic">
                  *Note: Candidates must qualify in Paper I and Paper II separately to be considered in the final merit list.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                Selection Stages
              </h4>
              <div className="space-y-3">
                {EXAM_PATTERN_INFO.selectionStages.map((stage, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="text-xs font-semibold text-slate-800">{stage}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-xs text-amber-950 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <Info className="w-4 h-4" />
                Key Strategic Tip
              </div>
              <p>
                Because there is <strong>no negative marking</strong>, you must attempt all 200 questions. Time management is crucial: target 45 seconds per question in Paper I to reserve ample time for calculations and Paper II computer science problems.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Verified Syllabus View */}
      {activeSubTab === "syllabus" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              Paper I: General Aptitude Syllabus (100 Marks)
            </h3>
            <p className="text-xs text-slate-500 mb-6">Common across all engineering disciplines in CIL MT recruitment.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SYLLABUS_PAPER1.map((sec, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <h4 className="font-bold text-slate-900 text-sm mb-2.5 pb-2 border-b border-slate-200 flex items-center justify-between">
                    <span>{sec.section}</span>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      25 Marks
                    </span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {sec.topics.map((t, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              Paper II: Professional Knowledge — Computer Science / System (100 Marks)
            </h3>
            <p className="text-xs text-slate-500 mb-6">Standard discipline syllabus mapped to GATE / Executive PSU level.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SYLLABUS_PAPER2.map((subj, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                    <h4 className="font-bold text-slate-900 text-sm">{subj.subject}</h4>
                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                      {subj.weightage}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{subj.topics}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Topic Weightages View */}
      {activeSubTab === "weightage" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span>Paper 1 Predicted Topic Weightage</span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">100 Marks</span>
            </h3>
            <div className="space-y-4">
              {PAPER1_WEIGHTAGE_PREDICTION.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>{item.topic}</span>
                    <span className="text-amber-700">{item.expectedQuestions}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, item.weightagePercent * 2)}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-700">High-Yield Subtopics:</span>{" "}
                    {item.highYieldAreas.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span>Paper 2 (CS/IT) Predicted Topic Weightage</span>
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded border border-indigo-200">100 Marks</span>
            </h3>
            <div className="space-y-4">
              {PAPER2_WEIGHTAGE_PREDICTION.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>{item.topic}</span>
                    <span className="text-indigo-700">{item.expectedQuestions}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${Math.min(100, item.weightagePercent * 4.5)}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-700">High-Yield Subtopics:</span>{" "}
                    {item.highYieldAreas.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Top 50 High-Probability Concepts View */}
      {activeSubTab === "top50" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search concepts, rules, algorithms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {[
                { id: "all", label: "All (50)" },
                { id: "ga", label: "Polity & CIL" },
                { id: "cs", label: "Computer Science" },
                { id: "apt", label: "Aptitude & English" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setConceptFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                    conceptFilter === filter.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredConcepts.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3 hover:border-amber-400 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-900 font-mono font-bold text-xs flex items-center justify-center">
                      {c.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{c.subject}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-800">
                    {c.probability}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm leading-snug">{c.title}</h4>
                <p className="text-xs text-slate-600">{c.summary}</p>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                  <div className="font-semibold text-slate-900">Core Rule / Formula:</div>
                  <div className="text-slate-700 font-mono text-[11px]">{c.coreRule}</div>
                </div>

                <div className="text-[11px] text-slate-500 italic">
                  <span className="font-semibold text-slate-600 not-italic">Sample Exam Style:</span>{" "}
                  "{c.typicalQuestionStyle}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Top 25 CIL-Specific Predictions View */}
      {activeSubTab === "cil25" && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 flex items-center gap-3">
            <Flame className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Top 25 Coal Sector & CIL Operational Predictions (2025–2026):</span> High-yield facts on CIL Maharatna governance, subsidiaries, coal gasification, and digital initiatives.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOP_25_CIL_PREDICTIONS.map((p) => (
              <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-amber-700">PREDICTION #{p.id}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 font-semibold rounded">
                    {p.category}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{p.title}</h4>
                <p className="text-xs text-slate-700">{p.prediction}</p>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs">
                  <span className="font-bold text-slate-900">Verified Facts:</span> {p.keyFacts}
                </div>
                <div className="text-[10px] text-slate-400">Context Source: {p.sourceContext}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Top 25 Computer Science Predictions View */}
      {activeSubTab === "cs25" && (
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-950 flex items-center gap-3">
            <Cpu className="w-6 h-6 text-indigo-600 shrink-0" />
            <div>
              <span className="font-bold">Top 25 Computer Science Predictions (Paper II):</span> Highly recurrent problem archetypes spanning Algorithms, DBMS, OS, Networking, TOC, and Digital Circuits.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOP_25_CS_PREDICTIONS.map((p) => (
              <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-indigo-700">CS PREDICTION #{p.id}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 font-semibold rounded">
                    {p.category}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{p.title}</h4>
                <p className="text-xs text-slate-700">{p.prediction}</p>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs">
                  <span className="font-bold text-slate-900">Core Mathematical/Technical Rule:</span> {p.keyFacts}
                </div>
                <div className="text-[10px] text-slate-400">Context Source: {p.sourceContext}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Fresh 100-Question Paper 1 Explorer View */}
      {activeSubTab === "freshPaper1" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Fresh 100-Question Paper 1 Question Bank</h3>
              <p className="text-xs text-slate-500">
                100 verified original questions across General Awareness (1-25), Reasoning (26-50), Numerical Ability (51-75), and English (76-100).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={freshSectionFilter}
                onChange={(e) => setFreshSectionFilter(e.target.value)}
                className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white font-medium text-slate-800"
              >
                <option value="all">All Sections (100 Qs)</option>
                <option value="General Awareness">General Awareness (25 Qs)</option>
                <option value="Reasoning">Reasoning Ability (25 Qs)</option>
                <option value="Numerical Ability">Numerical Ability (25 Qs)</option>
                <option value="General English">General English (25 Qs)</option>
              </select>

              <button
                onClick={() => setShowFreshAnswers(!showFreshAnswers)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center gap-1.5"
              >
                {showFreshAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showFreshAnswers ? "Hide Answers & Explanations" : "Show Answers & Explanations"}</span>
              </button>

              <button
                onClick={() => onStartFreshPaper1(FRESH_PAPER1_QUESTIONS)}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                Take as Mock Test
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredFreshQuestions.map((q, idx) => {
              const originalIndex = FRESH_PAPER1_QUESTIONS.indexOf(q);
              return (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-700">Q{originalIndex + 1}</span>
                      <span className="text-[10px] font-semibold text-slate-500 px-2 py-0.5 bg-slate-100 rounded">
                        {q.section}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 leading-relaxed">{q.q}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.opts.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.ans;
                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                            showFreshAnswers && isCorrect
                              ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold"
                              : "bg-slate-50 border-slate-200 text-slate-700"
                          }`}
                        >
                          <span className="font-mono font-bold text-slate-500">{["A", "B", "C", "D"][optIdx]}.</span>
                          <span>{opt}</span>
                          {showFreshAnswers && isCorrect && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-auto shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {showFreshAnswers && q.exp && (
                    <div className="p-3 bg-slate-50 border-l-4 border-emerald-500 rounded-r-lg text-xs text-slate-800 mt-2">
                      <div className="font-bold text-emerald-800 mb-0.5">Explanation & Context:</div>
                      <div>{q.exp}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
