import React from "react";
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Home,
  FileSpreadsheet,
  Download,
  BookOpen,
} from "lucide-react";
import { QuestionAttemptFeedback } from "../types";

interface ResultSummaryProps {
  summary: {
    total: number;
    correct: number;
    wrong: number;
    unanswered: number;
    questionLogs: Record<number, QuestionAttemptFeedback>;
  };
  title: string;
  setNumber: number | string;
  paperName: string;
  onRetake: () => void;
  onBackToHome: () => void;
  onOpenAnalytics: () => void;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({
  summary,
  title,
  setNumber,
  paperName,
  onRetake,
  onBackToHome,
  onOpenAnalytics,
}) => {
  const percentage = Math.round((summary.correct / summary.total) * 100);
  const isQualifiedUR = summary.correct >= 40 && percentage >= 60;
  const isQualifiedOBC = summary.correct >= 35 && percentage >= 55;
  const isQualifiedSCST = summary.correct >= 30 && percentage >= 50;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Result Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 text-white shadow-md text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <Award className="w-3.5 h-3.5" />
          Test Submission Report
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">{title}</h2>
        <p className="text-xs sm:text-sm text-slate-300">{paperName}</p>

        {/* Score Circles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-2xl mx-auto">
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <div className="text-[11px] uppercase font-bold text-slate-400">Total Marks</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {summary.correct} / {summary.total}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">No negative marking</div>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <div className="text-[11px] uppercase font-bold text-slate-400">Percentage</div>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{percentage}%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Raw CBT Score</div>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <div className="text-[11px] uppercase font-bold text-slate-400">First-Try Correct</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{summary.correct}</div>
            <div className="text-[10px] text-emerald-300 mt-0.5">Green Verifications</div>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <div className="text-[11px] uppercase font-bold text-slate-400">Incorrect Picks</div>
            <div className="text-2xl font-bold font-mono text-red-400 mt-1">{summary.wrong}</div>
            <div className="text-[10px] text-red-300 mt-0.5">Red Corrections</div>
          </div>
        </div>

        {/* CIL Qualifying Cutoff Assessment */}
        <div className="p-4 bg-slate-800/90 border border-slate-700 rounded-xl max-w-2xl mx-auto text-xs text-left space-y-2">
          <div className="font-bold text-slate-200">CIL MT Qualifying Benchmark Status:</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span>General (UR) / EWS (60%)</span>
              <span className={`font-bold ${isQualifiedUR ? "text-emerald-400" : "text-amber-400"}`}>
                {isQualifiedUR ? "QUALIFIED" : "BELOW CUTOFF"}
              </span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span>OBC NCL (55%)</span>
              <span className={`font-bold ${isQualifiedOBC ? "text-emerald-400" : "text-amber-400"}`}>
                {isQualifiedOBC ? "QUALIFIED" : "BELOW CUTOFF"}
              </span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span>SC / ST / PwD (50%)</span>
              <span className={`font-bold ${isQualifiedSCST ? "text-emerald-400" : "text-amber-400"}`}>
                {isQualifiedSCST ? "QUALIFIED" : "BELOW CUTOFF"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onRetake}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake This Test</span>
          </button>

          <button
            onClick={onOpenAnalytics}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>View Full Analytics & Sync</span>
          </button>

          <button
            onClick={onBackToHome}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-lg border border-slate-700 flex items-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Return to Test Selector</span>
          </button>
        </div>
      </div>
    </div>
  );
};
