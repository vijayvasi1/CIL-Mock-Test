import React, { useState } from "react";
import {
  Layers,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Cpu,
  Flame,
  FileSpreadsheet,
} from "lucide-react";
import { Question } from "../types";
import { ALL_SETS, getQuestionsForSet } from "../data/allSetsData";
import { FRESH_PAPER1_QUESTIONS } from "../data/researchData";

interface SetSelectorProps {
  onStartQuiz: (
    questions: Question[],
    title: string,
    setNumber: number | string,
    paperName: string
  ) => void;
  onOpenGenerator: () => void;
  onOpenResearch: () => void;
}

export const SetSelector: React.FC<SetSelectorProps> = ({
  onStartQuiz,
  onOpenGenerator,
  onOpenResearch,
}) => {
  const [selectedTab, setSelectedTab] = useState<"standard" | "research" | "ai">("standard");

  const startSet = (setNum: number, paper: "p1" | "p2") => {
    let questions = getQuestionsForSet(setNum, paper);
    if (!questions || questions.length === 0) {
      // Default to fresh research questions if set is dynamically routed
      questions = FRESH_PAPER1_QUESTIONS;
    }
    const paperName =
      paper === "p1"
        ? "Paper I (General Aptitude - 100 Marks)"
        : "Paper II (Computer Science / System - 100 Marks)";
    onStartQuiz(questions, `CIL MT (System) CBT Mock Test — Set ${setNum}`, setNum, paperName);
  };

  const startFreshResearchSet = () => {
    onStartQuiz(
      FRESH_PAPER1_QUESTIONS,
      "CIL MT (System) 2025–2026 Research Mock Test — Paper I",
      "Set 7 (Research)",
      "Paper I (General Aptitude - 100 Marks)"
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Banner with Instant Launch */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm text-white relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>Interactive Red/Green Live Feedback · Verified 2025–2026 Standards</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight leading-tight">
            CIL Management Trainee (System) CBT Preparation Console
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Practice with full 100-question sets across Paper I (General Aptitude) and Paper II (Computer Science & System). Every option selection gives instant visual verification: wrong choices highlight in <strong>red</strong> until you pinpoint the true answer in <strong>green</strong> with full factual context, timeline, and explanation.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={startFreshResearchSet}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Launch Verified 100-Q Paper 1 Test</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenGenerator}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm border border-emerald-400/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Generate Real-Time Test (AI Search)</span>
            </button>

            <button
              onClick={onOpenResearch}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>View Exam Intelligence & Weightage</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sets Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Standard Test Series (5 Sets + Research Set)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Each set simulates official CIL CBT conditions with 100 MCQs per paper (90 minutes).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Fresh Research Set 7 Card */}
          <div className="bg-white dark:bg-slate-900 border-2 border-amber-400/80 dark:border-amber-500/60 rounded-2xl p-5 shadow-xs space-y-4 hover:shadow-md transition-all relative">
            <div className="absolute top-3 right-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                Fresh 2025–2026 Set
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow-xs">
                S7
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Set 7: 2025–2026 Research Mock</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">100 Full-Length Original MCQs</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Synthesized from latest Coal India notifications, National Coal Gasification Mission, Polity, Quantitative, Reasoning, and English standards.
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 90 Mins · 100 Qs
              </span>
              <button
                onClick={startFreshResearchSet}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 transition-all cursor-pointer"
              >
                <span>Start Paper I</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Standard Sets 1 to 5 */}
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div
              key={num}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold flex items-center justify-center text-sm">
                    S{num}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Mock Test Set {num}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Official Standard CBT Simulation</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                  200 Marks Total
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">Paper I</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">General Aptitude (100 Qs)</div>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">Paper II</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Computer Science (100 Qs)</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => startSet(num, "p1")}
                  className="flex-1 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 hover:text-amber-900 dark:hover:text-amber-300 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-lg transition-all text-center cursor-pointer"
                >
                  Paper I (Aptitude)
                </button>
                <button
                  onClick={() => startSet(num, "p2")}
                  className="flex-1 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 hover:text-indigo-900 dark:hover:text-indigo-300 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-lg transition-all text-center cursor-pointer"
                >
                  Paper II (CS / IT)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
