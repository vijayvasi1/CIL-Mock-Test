import React, { useState } from "react";
import {
  Flame,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  BookOpen,
  ArrowRight,
  Filter,
  Info,
  Zap,
  Target,
  Clock,
  Layers,
} from "lucide-react";
import { CategoryHeatmapItem } from "../types";
import { CIL_SUBJECT_CATEGORIES } from "../utils/heatmapData";

interface HeatmapViewProps {
  items: CategoryHeatmapItem[];
  onOpenStudyScheduleModal: (initialWeakTopics?: string[]) => void;
  onLaunchTopicPractice?: (topicName: string, paper: "Paper I" | "Paper II") => void;
}

export const HeatmapView: React.FC<HeatmapViewProps> = ({
  items,
  onOpenStudyScheduleModal,
  onLaunchTopicPractice,
}) => {
  const [filterPaper, setFilterPaper] = useState<"all" | "Paper I" | "Paper II">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "critical" | "warning" | "moderate" | "mastered">("all");
  const [selectedTopic, setSelectedTopic] = useState<CategoryHeatmapItem | null>(null);

  const filteredItems = items.filter((item) => {
    if (filterPaper !== "all" && item.paper !== filterPaper) return false;
    if (statusFilter !== "all" && item.statusTier !== statusFilter) return false;
    return true;
  });

  // Calculate weak areas
  const criticalItems = items.filter((i) => i.statusTier === "critical" && i.totalAttempts > 0);
  const warningItems = items.filter((i) => i.statusTier === "warning" && i.totalAttempts > 0);
  const weakTopicsList = [...criticalItems, ...warningItems].map((i) => i.category);

  // Status colors & labels
  const getTierStyles = (tier: CategoryHeatmapItem["statusTier"], attempts: number) => {
    if (attempts === 0) {
      return {
        bg: "bg-slate-100 dark:bg-slate-800/60",
        border: "border-slate-300 dark:border-slate-700",
        text: "text-slate-600 dark:text-slate-400",
        badge: "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300",
        label: "Untested (0 Attempts)",
        colorScore: "text-slate-500",
      };
    }

    switch (tier) {
      case "critical":
        return {
          bg: "bg-rose-50/90 dark:bg-rose-950/40",
          border: "border-rose-300 dark:border-rose-800",
          text: "text-rose-900 dark:text-rose-200",
          badge: "bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700",
          label: "Critical Weak Spot (<45%)",
          colorScore: "text-rose-600 dark:text-rose-400",
        };
      case "warning":
        return {
          bg: "bg-amber-50/90 dark:bg-amber-950/40",
          border: "border-amber-300 dark:border-amber-800",
          text: "text-amber-900 dark:text-amber-200",
          badge: "bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700",
          label: "Needs Work (45–64%)",
          colorScore: "text-amber-600 dark:text-amber-400",
        };
      case "moderate":
        return {
          bg: "bg-sky-50/90 dark:bg-sky-950/40",
          border: "border-sky-200 dark:border-sky-800",
          text: "text-sky-900 dark:text-sky-200",
          badge: "bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-700",
          label: "Developing (65–79%)",
          colorScore: "text-sky-600 dark:text-sky-400",
        };
      case "mastered":
        return {
          bg: "bg-emerald-50/90 dark:bg-emerald-950/40",
          border: "border-emerald-300 dark:border-emerald-800",
          text: "text-emerald-900 dark:text-emerald-200",
          badge: "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700",
          label: "Mastered (≥80%)",
          colorScore: "text-emerald-600 dark:text-emerald-400",
        };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 mb-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>Candidate Error Density & Subject Heatmap</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            CIL MT Syllabus Weak Spot & Performance Heatmap
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Visual matrix mapping your conceptual error hotspots across all Paper I and Paper II modules. Identify categories with high error counts to schedule targeted revision.
          </p>
        </div>

        <button
          onClick={() => onOpenStudyScheduleModal(weakTopicsList.length > 0 ? weakTopicsList : undefined)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Generate AI Study Plan for Weak Topics</span>
        </button>
      </div>

      {/* Heatmap Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
          <Info className="w-4 h-4 text-slate-400" />
          <span>Heatmap Intensity Levels:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Critical (&lt;45%)
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Needs Work (45–64%)
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            Developing (65–79%)
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Mastered (≥80%)
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <button
            onClick={() => setFilterPaper("all")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterPaper === "all"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            All Papers ({items.length})
          </button>
          <button
            onClick={() => setFilterPaper("Paper I")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterPaper === "Paper I"
                ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Paper I (Aptitude)
          </button>
          <button
            onClick={() => setFilterPaper("Paper II")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterPaper === "Paper II"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Paper II (CS & IT)
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 dark:text-slate-400 font-semibold">Tier:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            aria-label="Filter heatmap by performance tier"
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Tiers</option>
            <option value="critical">🔴 Critical Weak Spots</option>
            <option value="warning">🟠 Needs Work</option>
            <option value="moderate">🟡 Developing</option>
            <option value="mastered">🟢 Mastered</option>
          </select>
        </div>
      </div>

      {/* Heatmap Grid Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filteredItems.map((item) => {
          const styles = getTierStyles(item.statusTier, item.totalAttempts);
          const isSelected = selectedTopic?.category === item.category;

          return (
            <div
              key={item.category}
              onClick={() => setSelectedTopic(isSelected ? null : item)}
              className={`${styles.bg} ${styles.border} border-2 rounded-xl p-4 transition-all cursor-pointer hover:shadow-md flex flex-col justify-between space-y-3 relative ${
                isSelected ? "ring-2 ring-amber-500 dark:ring-amber-400 shadow-sm" : ""
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 bg-white/80 dark:bg-slate-900/80 rounded border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300">
                    {item.paper}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${styles.badge}`}>
                    {item.totalAttempts > 0 ? `${item.accuracy}% Accuracy` : "0 Solved"}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-2.5 leading-snug">
                  {item.category}
                </h4>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                {/* Accuracy Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.totalAttempts === 0
                        ? "bg-slate-400 w-0"
                        : item.statusTier === "critical"
                        ? "bg-rose-500"
                        : item.statusTier === "warning"
                        ? "bg-amber-500"
                        : item.statusTier === "moderate"
                        ? "bg-sky-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${item.totalAttempts === 0 ? 0 : item.accuracy}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                  <span>
                    <strong>{item.correctAttempts}</strong> correct / <strong>{item.totalAttempts}</strong> total
                  </span>
                  {item.hardQuestionsFailed > 0 && (
                    <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-0.5">
                      <AlertTriangle className="w-3 h-3" />
                      {item.hardQuestionsFailed} hard missed
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Topic Detail Drawer / Card */}
      {selectedTopic && (
        <div className="bg-slate-900 text-white border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-md space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedTopic.paper}
                </span>
                <span className="text-xs text-slate-400 font-mono">Detailed Topic Diagnostic</span>
              </div>
              <h4 className="text-lg font-bold text-slate-100 mt-1">{selectedTopic.category}</h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenStudyScheduleModal([selectedTopic.category])}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Build Schedule for This Topic</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <div className="text-slate-400">Total Questions Attempted</div>
              <div className="text-lg font-bold font-mono text-slate-100 mt-1">
                {selectedTopic.totalAttempts} MCQs
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <div className="text-slate-400">Correct Answers</div>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                {selectedTopic.correctAttempts} ({selectedTopic.accuracy}%)
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <div className="text-slate-400">Hard Difficulty Questions Failed</div>
              <div className="text-lg font-bold font-mono text-rose-400 mt-1">
                {selectedTopic.hardQuestionsFailed} Missed
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700/80 text-xs text-slate-300 space-y-1.5">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              <span>Recommended CIL MT Remediation Action:</span>
            </div>
            <p className="leading-relaxed">
              {selectedTopic.statusTier === "critical"
                ? `Prioritize fundamental rules and 2025-2026 notification updates for ${selectedTopic.category}. Review detailed explanations of wrong choices to understand the underlying principles.`
                : selectedTopic.statusTier === "warning"
                ? `Solve 20 timed practice MCQs specifically focusing on ${selectedTopic.category} to boost your accuracy past the 65% benchmark.`
                : `Solid foundation established! Maintain retention with a quick 5-minute formula/concept recap once a week.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
