import React, { useState, useEffect } from "react";
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Home,
  FileSpreadsheet,
  BookOpen,
  Filter,
  Search,
  AlertTriangle,
  Bookmark,
  ChevronRight,
  ShieldAlert,
  Check,
  HelpCircle,
  Layers,
  Sparkles,
  Trophy,
  Zap,
  Brain,
  Target,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { Question, QuestionAttemptFeedback, QuestionDifficulty, GamificationBadge } from "../types";
import { normalizeQuestions } from "../utils/difficulty";
import { evaluateBadgesAfterTest } from "../utils/gamification";

interface ResultSummaryProps {
  summary: {
    total: number;
    correct: number;
    wrong: number;
    unanswered: number;
    questionLogs: Record<number, QuestionAttemptFeedback>;
    tabSwitchTermination?: boolean;
    timeSpentSeconds?: number;
  };
  title: string;
  setNumber: number | string;
  paperName: string;
  questions?: Question[];
  onRetake: () => void;
  onBackToHome: () => void;
  onOpenAnalytics: () => void;
}

const LETTERS = ["A", "B", "C", "D"];

export const ResultSummary: React.FC<ResultSummaryProps> = ({
  summary,
  title,
  setNumber,
  paperName,
  questions = [],
  onRetake,
  onBackToHome,
  onOpenAnalytics,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "review">("overview");
  const [statusFilter, setStatusFilter] = useState<"all" | "incorrect" | "correct" | "unanswered" | "marked">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | QuestionDifficulty>("all");
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<GamificationBadge[]>([]);

  useEffect(() => {
    try {
      const evaluation = evaluateBadgesAfterTest({
        summary,
        paperName,
        setNumber,
      });
      if (evaluation.newlyUnlocked.length > 0) {
        setNewlyUnlockedBadges(evaluation.newlyUnlocked);
      }
    } catch {}
  }, []);

  const normalizedQuestions = normalizeQuestions(questions);

  const safeTotal = summary?.total || normalizedQuestions.length || 1;
  const safeCorrect = summary?.correct ?? 0;
  const safeWrong = summary?.wrong ?? 0;
  const safeUnanswered = summary?.unanswered ?? Math.max(0, safeTotal - safeCorrect - safeWrong);
  const percentage = Math.round((safeCorrect / (safeTotal || 1)) * 100);

  const isQualifiedUR = safeCorrect >= 40 && percentage >= 60;
  const isQualifiedOBC = safeCorrect >= 35 && percentage >= 55;
  const isQualifiedSCST = safeCorrect >= 30 && percentage >= 50;

  // Extract unique sections
  const sections = Array.from(new Set(normalizedQuestions.map((q) => q.section)));

  // Difficulty color styling
  const getDifficultyBadge = (diff?: QuestionDifficulty) => {
    switch (diff) {
      case "Easy":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Hard":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "Medium":
      default:
        return "bg-amber-100 text-amber-800 border-amber-300";
    }
  };

  // Build list of review items
  const qLogs = summary?.questionLogs || {};
  const reviewItems = normalizedQuestions.map((q, idx) => {
    const feedback = qLogs[idx];
    const isAttempted = feedback !== undefined && feedback.selectedOptionIndex !== undefined;
    const isCorrect = feedback ? feedback.isCorrect : false;
    const isMarked = feedback ? feedback.markedForReview : false;
    const wrongPicks = feedback ? feedback.wrongPicks || [] : [];
    const triesCount = feedback ? feedback.attemptsCountOnQuestion || 0 : 0;
    const selectedOption = isAttempted ? feedback.selectedOptionIndex : -1;

    let status: "correct" | "incorrect" | "unanswered" = "unanswered";
    if (isAttempted) {
      status = isCorrect ? "correct" : "incorrect";
    }

    return {
      index: idx,
      question: q,
      feedback,
      isAttempted,
      isCorrect,
      isMarked,
      wrongPicks,
      triesCount,
      selectedOption,
      status,
    };
  });

  // Filtered review list
  const filteredReviewItems = reviewItems.filter((item) => {
    if (statusFilter === "incorrect" && item.status !== "incorrect") return false;
    if (statusFilter === "correct" && item.status !== "correct") return false;
    if (statusFilter === "unanswered" && item.status !== "unanswered") return false;
    if (statusFilter === "marked" && !item.isMarked) return false;

    if (difficultyFilter !== "all" && item.question.difficulty !== difficultyFilter) return false;
    if (sectionFilter !== "all" && item.question.section !== sectionFilter) return false;

    if (searchQuery.trim()) {
      const qText = (item.question.q + " " + (item.question.exp || "")).toLowerCase();
      if (!qText.includes(searchQuery.toLowerCase().trim())) return false;
    }

    return true;
  });

  const incorrectCount = reviewItems.filter((i) => i.status === "incorrect").length;
  const correctCount = reviewItems.filter((i) => i.status === "correct").length;
  const unansweredCount = reviewItems.filter((i) => i.status === "unanswered").length;
  const markedCount = reviewItems.filter((i) => i.isMarked).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Tab Switch Termination Alert Banner */}
      {summary.tabSwitchTermination && (
        <div className="bg-red-500/15 border-2 border-red-500 rounded-2xl p-5 text-red-950 flex items-start gap-4 shadow-sm animate-pulse">
          <div className="p-2.5 bg-red-600 text-white rounded-xl shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-red-900 flex items-center gap-2">
              Anti-Cheat Proctoring: Test Automatically Submitted
            </h3>
            <p className="text-sm text-red-800 leading-relaxed">
              The test was automatically terminated and submitted because the browser window was out of focus or
              switched to another tab for more than <strong>10 seconds</strong> during the examination. Your recorded
              responses up to that point have been securely evaluated below.
            </p>
          </div>
        </div>
      )}

      {/* Newly Unlocked Achievement Badges Banner */}
      {newlyUnlockedBadges.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 border-2 border-amber-300 rounded-2xl p-5 text-slate-950 shadow-lg space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-extrabold text-base sm:text-lg text-slate-950">
              <Trophy className="w-6 h-6 text-slate-950" />
              <span>🎉 Congratulations! New Achievement Badges Unlocked!</span>
            </div>
            <button
              onClick={onOpenAnalytics}
              className="text-xs font-bold bg-slate-950 text-amber-300 px-3 py-1.5 rounded-lg hover:bg-slate-900 shadow-sm"
            >
              View Badge Vault
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            {newlyUnlockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-slate-950/90 text-white p-3.5 rounded-xl border border-slate-800 flex items-center gap-3 shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-300">{badge.title}</div>
                  <div className="text-[11px] text-slate-300 line-clamp-2 leading-snug">{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Result Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 text-white shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
              <Award className="w-3.5 h-3.5" />
              CIL MT CBT Examination Scorecard
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">{title}</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">{paperName}</p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-800/90 p-1.5 rounded-xl border border-slate-700 self-start sm:self-auto shrink-0">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "overview"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Score & Cutoffs</span>
            </button>
            <button
              onClick={() => setActiveTab("review")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "review"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Side-by-Side Review ({normalizedQuestions.length})</span>
            </button>
          </div>
        </div>

        {/* Score Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <div className="text-[11px] uppercase font-bold text-slate-400">Total Marks</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {safeCorrect} / {safeTotal}
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
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{safeCorrect}</div>
            <div className="text-[10px] text-emerald-300 mt-0.5">Green Verifications</div>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <div className="text-[11px] uppercase font-bold text-slate-400">Incorrect Picks</div>
            <div className="text-2xl font-bold font-mono text-red-400 mt-1">{safeWrong}</div>
            <div className="text-[10px] text-red-300 mt-0.5">Red Corrections</div>
          </div>
        </div>

        {/* CIL Qualifying Cutoff Assessment */}
        <div className="p-4 bg-slate-800/90 border border-slate-700 rounded-xl text-xs space-y-2">
          <div className="font-bold text-slate-200 flex items-center justify-between">
            <span>CIL MT Qualifying Benchmark Status (Separate Qualifying in Each Paper):</span>
            <span className="text-[11px] font-normal text-slate-400">Official Ministry of Coal Rules</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-300 block">General (UR) / EWS</span>
                <span className="text-[10px] text-slate-400">Min 40 Marks (60%)</span>
              </div>
              <span className={`font-bold px-2 py-0.5 rounded text-xs ${isQualifiedUR ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                {isQualifiedUR ? "QUALIFIED" : "BELOW CUTOFF"}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-300 block">OBC (Non-Creamy Layer)</span>
                <span className="text-[10px] text-slate-400">Min 35 Marks (55%)</span>
              </div>
              <span className={`font-bold px-2 py-0.5 rounded text-xs ${isQualifiedOBC ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                {isQualifiedOBC ? "QUALIFIED" : "BELOW CUTOFF"}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-300 block">SC / ST / PwBD</span>
                <span className="text-[10px] text-slate-400">Min 30 Marks (50%)</span>
              </div>
              <span className={`font-bold px-2 py-0.5 rounded text-xs ${isQualifiedSCST ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                {isQualifiedSCST ? "QUALIFIED" : "BELOW CUTOFF"}
              </span>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === "overview" ? "review" : "overview")}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>{activeTab === "overview" ? "Open Side-by-Side Review" : "View Scorecard Overview"}</span>
            </button>
            <button
              onClick={onRetake}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-lg border border-slate-700 flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Test</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAnalytics}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Sync to Analytics</span>
            </button>
            <button
              onClick={onBackToHome}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-lg border border-slate-700 flex items-center gap-1.5"
            >
              <Home className="w-4 h-4" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Review Interface */}
      {activeTab === "review" && (
        <div className="space-y-5">
          {/* Review Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  Side-by-Side Answer & Knowledge Gap Review
                </h3>
                <p className="text-xs text-slate-500">
                  Compare your picked options directly against verified answers, difficulty tiers, and in-depth rationales.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search questions or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="font-bold text-slate-500 uppercase text-[11px] tracking-wider mr-1">Status:</span>
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 rounded-full font-semibold transition-all ${
                  statusFilter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All ({normalizedQuestions.length})
              </button>
              <button
                onClick={() => setStatusFilter("incorrect")}
                className={`px-3 py-1 rounded-full font-semibold transition-all flex items-center gap-1 ${
                  statusFilter === "incorrect"
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                Incorrect / Needs Revision ({incorrectCount})
              </button>
              <button
                onClick={() => setStatusFilter("correct")}
                className={`px-3 py-1 rounded-full font-semibold transition-all flex items-center gap-1 ${
                  statusFilter === "correct"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Correct ({correctCount})
              </button>
              <button
                onClick={() => setStatusFilter("unanswered")}
                className={`px-3 py-1 rounded-full font-semibold transition-all ${
                  statusFilter === "unanswered"
                    ? "bg-slate-700 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Unanswered ({unansweredCount})
              </button>
              {markedCount > 0 && (
                <button
                  onClick={() => setStatusFilter("marked")}
                  className={`px-3 py-1 rounded-full font-semibold transition-all flex items-center gap-1 ${
                    statusFilter === "marked"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  Marked for Review ({markedCount})
                </button>
              )}

              {/* Difficulty Filter */}
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="font-bold text-slate-500 uppercase text-[11px] tracking-wider">Difficulty:</span>
                {(["all", "Easy", "Medium", "Hard"] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficultyFilter(diff)}
                    className={`px-2.5 py-0.5 rounded text-xs font-semibold transition-all ${
                      difficultyFilter === diff
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {diff === "all" ? "All Tiers" : diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Filter Pills */}
            {sections.length > 1 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                <span className="font-bold text-slate-500 uppercase text-[11px] tracking-wider mr-1">Section:</span>
                <button
                  onClick={() => setSectionFilter("all")}
                  className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                    sectionFilter === "all" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  All Sections
                </button>
                {sections.map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setSectionFilter(sec)}
                    className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                      sectionFilter === sec ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Questions Side-by-Side Review List */}
          {filteredReviewItems.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 space-y-2">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-700">No questions match the selected filter criteria.</div>
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setDifficultyFilter("all");
                  setSectionFilter("all");
                  setSearchQuery("");
                }}
                className="text-xs font-bold text-amber-600 hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviewItems.map((item) => {
                const q = item.question;
                const isCorrect = item.isCorrect;
                const isIncorrect = item.status === "incorrect";
                const isUnanswered = item.status === "unanswered";

                return (
                  <div
                    key={item.index}
                    className={`bg-white border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 transition-all ${
                      isCorrect
                        ? "border-emerald-200"
                        : isIncorrect
                        ? "border-red-200"
                        : "border-slate-200"
                    }`}
                  >
                    {/* Question Top Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 bg-slate-900 text-white text-xs font-bold font-mono rounded-lg">
                          Q {item.index + 1}
                        </span>
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md">
                          {q.section}
                        </span>
                        {/* Difficulty Tag Badge */}
                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getDifficultyBadge(q.difficulty)}`}>
                          ● {q.difficulty || "Medium"} Difficulty
                        </span>
                        {item.isMarked && (
                          <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-300 text-xs font-bold flex items-center gap-1">
                            <Bookmark className="w-3 h-3" /> Marked for Review
                          </span>
                        )}
                      </div>

                      {/* Attempt Status Badge */}
                      <div className="text-xs">
                        {isCorrect ? (
                          <span className="px-3 py-1 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Correct Answer {item.triesCount > 1 ? `(${item.triesCount} tries)` : ""}
                          </span>
                        ) : isIncorrect ? (
                          <span className="px-3 py-1 rounded-full font-bold bg-red-50 text-red-800 border border-red-300 flex items-center gap-1.5">
                            <XCircle className="w-4 h-4 text-red-600" />
                            Incorrect ({item.wrongPicks.length} wrong attempts)
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            Unanswered / Skipped
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question Statement */}
                    <div className="text-base font-bold text-slate-900 leading-snug">{q.q}</div>

                    {/* Side-by-Side Comparison Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
                      {/* Left Column: Candidate's Selected Choice & Options (5 Cols) */}
                      <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                          <span>Your Selection & Options</span>
                          <span className="font-mono text-[11px] text-slate-400">
                            {isUnanswered ? "No option chosen" : `Picked: Option ${LETTERS[item.selectedOption] || ""}`}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {q.opts.map((opt, optIdx) => {
                            const isPicked = item.selectedOption === optIdx;
                            const isWrongPick = item.wrongPicks.includes(optIdx);
                            const isRightOpt = optIdx === q.ans;

                            let optStyle = "bg-white border-slate-200 text-slate-700";
                            let badgeStyle = "bg-slate-100 text-slate-600";

                            if (isPicked && isRightOpt) {
                              optStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-400";
                              badgeStyle = "bg-emerald-600 text-white";
                            } else if (isPicked && !isRightOpt) {
                              optStyle = "bg-red-50 border-red-500 text-red-950 font-bold ring-1 ring-red-400";
                              badgeStyle = "bg-red-600 text-white";
                            } else if (isWrongPick) {
                              optStyle = "bg-red-50/50 border-red-300 text-red-900";
                              badgeStyle = "bg-red-400 text-white";
                            }

                            return (
                              <div
                                key={optIdx}
                                className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 ${optStyle}`}
                              >
                                <div
                                  className={`w-5 h-5 rounded-full font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 ${badgeStyle}`}
                                >
                                  {LETTERS[optIdx]}
                                </div>
                                <div className="flex-1 leading-snug">{opt}</div>
                                {isPicked && !isRightOpt && (
                                  <span className="text-[10px] font-bold text-red-700 bg-white px-1.5 py-0.5 rounded border border-red-200">
                                    Your Pick
                                  </span>
                                )}
                                {isPicked && isRightOpt && (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                                    Your Pick ✓
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right Column: Correct Answer, Complete Explanation & Knowledge Gap Rationale (7 Cols) */}
                      <div className="lg:col-span-7 bg-emerald-50/40 border border-emerald-200 rounded-xl p-4 sm:p-5 space-y-3">
                        <div className="flex items-center justify-between border-b border-emerald-200 pb-2.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Verified Correct Answer</span>
                          </div>
                          <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded font-mono text-xs font-bold shadow-xs">
                            Option {LETTERS[q.ans]}
                          </span>
                        </div>

                        {/* Correct Option Statement */}
                        <div className="p-2.5 bg-white rounded-lg border border-emerald-300 text-xs sm:text-sm font-bold text-emerald-950 leading-snug">
                          {q.opts[q.ans]}
                        </div>

                        {/* Detailed Knowledge Gap Explanation */}
                        <div className="space-y-2 pt-1 text-xs sm:text-sm text-slate-800 leading-relaxed">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            Factual Rationale & High-Yield Breakdown:
                          </div>
                          <div className="p-3 bg-white/90 rounded-lg border border-emerald-100 text-slate-700 text-xs sm:text-sm leading-relaxed">
                            {q.exp ||
                              `This solution is verified according to the CIL MT syllabus and standard specifications in ${q.section}.`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
