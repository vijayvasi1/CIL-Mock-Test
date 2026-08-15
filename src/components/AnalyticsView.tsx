import React, { useState, useEffect } from "react";
import {
  BarChart3,
  FileSpreadsheet,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Award,
  Trophy,
  Zap,
  Brain,
  Target,
  ShieldCheck,
  Cpu,
  Calculator,
  Flame,
  Lock,
  Check,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import { GamificationBadge, CategoryHeatmapItem } from "../types";
import { getSavedBadges, getTestSessionHistory } from "../utils/gamification";
import { computeCategoryHeatmap } from "../utils/heatmapData";
import { HeatmapView } from "./HeatmapView";
import { StudyScheduleModal } from "./StudyScheduleModal";

export const AnalyticsView: React.FC = () => {
  const [attemptHistory, setAttemptHistory] = useState<any[]>([]);
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);
  const [badges, setBadges] = useState<GamificationBadge[]>([]);
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [badgeFilter, setBadgeFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [modalWeakTopics, setModalWeakTopics] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cil_attempt_history");
      if (stored) {
        setAttemptHistory(JSON.parse(stored));
      }
      const savedWebhook = localStorage.getItem("cil_webhook_url");
      if (savedWebhook) {
        setWebhookUrl(savedWebhook);
      }
      setSessionHistory(getTestSessionHistory());
      setBadges(getSavedBadges());
    } catch {}
  }, []);

  const totalAttempts = attemptHistory.length;
  const correctCount = attemptHistory.filter((a) => a.isCorrect).length;
  const overallAccuracy =
    totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

  // Compute Category Heatmap Items
  const heatmapItems: CategoryHeatmapItem[] = computeCategoryHeatmap(attemptHistory);

  // Section Breakdown
  const sectionStats: Record<string, { total: number; correct: number }> = {};
  attemptHistory.forEach((a) => {
    const sec = a.section || "General";
    if (!sectionStats[sec]) {
      sectionStats[sec] = { total: 0, correct: 0 };
    }
    sectionStats[sec].total += 1;
    if (a.isCorrect) sectionStats[sec].correct += 1;
  });

  const handleOpenScheduleModal = (weakList?: string[]) => {
    if (weakList && weakList.length > 0) {
      setModalWeakTopics(weakList);
    } else {
      const criticalOrWarning = heatmapItems
        .filter((i) => i.statusTier === "critical" || i.statusTier === "warning")
        .map((i) => i.category);
      setModalWeakTopics(criticalOrWarning);
    }
    setIsScheduleModalOpen(true);
  };

  // Performance Trend Data calculation across Mock Test Sets
  const buildTrendData = () => {
    if (sessionHistory.length > 0) {
      return sessionHistory.map((s, idx) => ({
        session: `Test #${idx + 1} (${s.setNumber || "Set " + (idx + 1)})`,
        name: typeof s.setNumber === "string" ? s.setNumber : `Set ${s.setNumber}`,
        score: s.percentage || Math.round(((s.correct || 0) / (s.total || 1)) * 100),
        correct: s.correct || 0,
        total: s.total || 0,
        cutoffUR: 60,
        cutoffOBC: 55,
        cutoffSCST: 50,
      }));
    }

    // If no full test session yet, group question logs by Set to construct trend points
    const setGroups: Record<string, { total: number; correct: number }> = {};
    attemptHistory.forEach((a) => {
      const setKey = a.set ? `Set ${a.set}` : "Practice";
      if (!setGroups[setKey]) {
        setGroups[setKey] = { total: 0, correct: 0 };
      }
      setGroups[setKey].total += 1;
      if (a.isCorrect) setGroups[setKey].correct += 1;
    });

    const groupKeys = Object.keys(setGroups);
    if (groupKeys.length > 0) {
      return groupKeys.map((k) => {
        const item = setGroups[k];
        const pct = Math.round((item.correct / item.total) * 100);
        return {
          session: k,
          name: k,
          score: pct,
          correct: item.correct,
          total: item.total,
          cutoffUR: 60,
          cutoffOBC: 55,
          cutoffSCST: 50,
        };
      });
    }

    // Default illustration trend preview if zero attempts recorded yet
    return [
      { session: "Set 1 (Diag)", name: "Set 1", score: 48, correct: 48, total: 100, cutoffUR: 60, cutoffOBC: 55, cutoffSCST: 50 },
      { session: "Set 2 (P1)", name: "Set 2", score: 58, correct: 58, total: 100, cutoffUR: 60, cutoffOBC: 55, cutoffSCST: 50 },
      { session: "Set 3 (P2)", name: "Set 3", score: 64, correct: 64, total: 100, cutoffUR: 60, cutoffOBC: 55, cutoffSCST: 50 },
      { session: "Set 4 (Speed)", name: "Set 4", score: 72, correct: 72, total: 100, cutoffUR: 60, cutoffOBC: 55, cutoffSCST: 50 },
      { session: "Set 5 (Pro)", name: "Set 5", score: 81, correct: 81, total: 100, cutoffUR: 60, cutoffOBC: 55, cutoffSCST: 50 },
    ];
  };

  const trendData = buildTrendData();
  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  const filteredBadges = badges.filter((b) => {
    if (badgeFilter === "unlocked") return b.unlocked;
    if (badgeFilter === "locked") return !b.unlocked;
    return true;
  });

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "Zap":
        return <Zap className="w-5 h-5" />;
      case "Brain":
        return <Brain className="w-5 h-5" />;
      case "Target":
        return <Target className="w-5 h-5" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-5 h-5" />;
      case "Cpu":
        return <Cpu className="w-5 h-5" />;
      case "Calculator":
        return <Calculator className="w-5 h-5" />;
      case "Flame":
        return <Flame className="w-5 h-5" />;
      case "TrendingUp":
        return <TrendingUp className="w-5 h-5" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5" />;
      case "Award":
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "Epic":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "Rare":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      case "Common":
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/40";
    }
  };

  // Export to CSV for Google Sheets
  const handleExportCSV = () => {
    if (attemptHistory.length === 0) {
      alert("No attempt history available to export yet. Complete a few questions first!");
      return;
    }

    const headers = [
      "Timestamp",
      "Set",
      "Paper",
      "Question_Index",
      "Section",
      "Question_Text",
      "Selected_Option",
      "Correct_Option",
      "Is_Correct",
      "Attempts_Count",
      "Explanation",
    ];

    const rows = attemptHistory.map((a) => [
      `"${a.timestamp || ""}"`,
      `"${a.set || ""}"`,
      `"${a.paper || ""}"`,
      a.questionIndex || 0,
      `"${(a.section || "").replace(/"/g, '""')}"`,
      `"${(a.questionText || "").replace(/"/g, '""')}"`,
      `"${(a.selectedOptionText || "").replace(/"/g, '""')}"`,
      `"${(a.correctOptionText || "").replace(/"/g, '""')}"`,
      a.isCorrect ? "TRUE" : "FALSE",
      a.attemptsCountOnQuestion || 1,
      `"${(a.explanation || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `CIL_MT_Attempt_Analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(attemptHistory, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `CIL_MT_Attempt_Logs_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sync to Webhook / Google Sheets Apps Script
  const handleSyncWebhook = async () => {
    if (!webhookUrl.trim()) {
      alert("Please enter a valid Google Apps Script Webhook or API Endpoint URL.");
      return;
    }

    try {
      localStorage.setItem("cil_webhook_url", webhookUrl.trim());
      setIsSyncing(true);
      setSyncStatus("Connecting to Google Sheets Webhook...");

      const res = await fetch("/api/sync-google-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl: webhookUrl.trim(),
          records: attemptHistory,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSyncStatus(`✓ Successfully synced ${attemptHistory.length} records to Google Sheets!`);
      } else {
        setSyncStatus(`Error: ${data.error || "Failed to sync"}`);
      }
    } catch (err: any) {
      setSyncStatus(`Sync error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your local attempt analytics and session history?")) {
      localStorage.removeItem("cil_attempt_history");
      localStorage.removeItem("cil_test_session_history");
      setAttemptHistory([]);
      setSessionHistory([]);
      setSyncStatus(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-7">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <span>Total Questions Logged</span>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mt-2">
            {totalAttempts}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Across all Paper I & II mock sets</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <span>Overall Accuracy</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-2">
            {overallAccuracy}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {correctCount} correct out of {totalAttempts} attempts
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <span>Completed Mock Sets</span>
            <Layers className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mt-2">
            {sessionHistory.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Full CBT test sessions recorded</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <span>Achievements Unlocked</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400 mt-2">
            {unlockedBadgesCount} / {badges.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">CIL badges & competency milestones</div>
        </div>
      </div>

      {/* Visual Heatmap of Weak Categories & Topics */}
      <HeatmapView
        items={heatmapItems}
        onOpenStudyScheduleModal={handleOpenScheduleModal}
      />

      {/* Performance Trends Line Chart across Mock Test Sets */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Score Improvement Progression
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Mock Test Set Performance Trends & CIL Cutoff Benchmarks
            </h3>
            <p className="text-xs text-slate-500">
              Track your percentage score improvement over time across different examination sets against the 60% UR qualifying cutoff.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              Your Score %
            </span>
            <span className="flex items-center gap-1.5 text-amber-700">
              <span className="w-3 h-0.5 bg-amber-500 inline-block" />
              UR Cutoff (60%)
            </span>
          </div>
        </div>

        {/* Recharts LineChart Component */}
        <div className="w-full h-72 sm:h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="session"
                tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                tickLine={{ stroke: "#cbd5e1" }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickLine={{ stroke: "#cbd5e1" }}
                unit="%"
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const isQualified = data.score >= 60;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs space-y-1">
                        <div className="font-bold text-slate-100">{label}</div>
                        <div className="text-emerald-400 font-mono text-sm font-bold">
                          Score: {data.score}% ({data.correct}/{data.total} marks)
                        </div>
                        <div className="text-[11px] flex items-center gap-1">
                          <span>CIL UR Benchmark (60%):</span>
                          <span
                            className={`font-bold px-1.5 py-0.2 rounded ${
                              isQualified ? "bg-emerald-500/30 text-emerald-300" : "bg-red-500/30 text-red-300"
                            }`}
                          >
                            {isQualified ? "QUALIFIED" : "BELOW CUTOFF"}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Benchmark Reference Lines for CIL Cutoffs */}
              <ReferenceLine
                y={60}
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 4"
                label={{ value: "UR 60% Qualifying Cutoff", position: "insideTopRight", fill: "#b45309", fontSize: 11, fontWeight: "bold" }}
              />
              <ReferenceLine
                y={50}
                stroke="#94a3b8"
                strokeWidth={1}
                strokeDasharray="2 2"
                label={{ value: "SC/ST 50%", position: "insideBottomRight", fill: "#64748b", fontSize: 10 }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#scoreGradient)"
                dot={{ stroke: "#10b981", strokeWidth: 2, r: 5, fill: "#ffffff" }}
                activeDot={{ stroke: "#059669", strokeWidth: 3, r: 7, fill: "#10b981" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gamification Achievements & Badges Showcase */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 text-white shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl shrink-0 font-bold shadow-sm">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-100">
                  CIL Candidate Gamification & Achievement Badges
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {unlockedBadgesCount} / {badges.length} Unlocked
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Earn prestigious badges by demonstrating speed, high accuracy, proctored test discipline, and subject mastery.
              </p>
            </div>
          </div>

          {/* Badge Filters */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs self-start sm:self-auto">
            <button
              onClick={() => setBadgeFilter("all")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                badgeFilter === "all" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-300 hover:text-white"
              }`}
            >
              All ({badges.length})
            </button>
            <button
              onClick={() => setBadgeFilter("unlocked")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                badgeFilter === "unlocked" ? "bg-emerald-500 text-white font-bold" : "text-slate-300 hover:text-white"
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              Unlocked ({unlockedBadgesCount})
            </button>
            <button
              onClick={() => setBadgeFilter("locked")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                badgeFilter === "locked" ? "bg-slate-700 text-white font-bold" : "text-slate-300 hover:text-white"
              }`}
            >
              <Lock className="w-3 h-3" />
              Locked ({badges.length - unlockedBadgesCount})
            </button>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBadges.map((badge) => {
            const isUnlocked = badge.unlocked;

            return (
              <div
                key={badge.id}
                className={`rounded-xl p-4 border transition-all flex flex-col justify-between space-y-3 ${
                  isUnlocked
                    ? "bg-slate-800/90 border-amber-500/40 shadow-sm"
                    : "bg-slate-800/40 border-slate-800 opacity-60 hover:opacity-80"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        isUnlocked
                          ? "bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-sm"
                          : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      {isUnlocked ? getBadgeIcon(badge.icon) : <Lock className="w-4 h-4" />}
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRarityBadge(badge.rarity)}`}>
                      {badge.rarity}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                      <span>{badge.title}</span>
                      {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{badge.description}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px]">
                  {isUnlocked ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-slate-500 font-mono">Requirements pending</span>
                  )}
                  <span className="text-[10px] uppercase font-bold text-slate-500">{badge.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Google Sheets Integration & Export Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 shadow-sm text-white space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              Google Sheets / External Database Sync
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Automatically track every MCQ attempt with wrong-try counts, correct factual explanations, and timestamp logs in your Google Sheet.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4" />
              Export to Google Sheets (.CSV)
            </button>

            <button
              onClick={handleExportJSON}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg border border-slate-600 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
          </div>
        </div>

        {/* Webhook Configuration Field */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            placeholder="Paste your Google Apps Script Webhook URL (e.g. https://script.google.com/macros/s/.../exec)"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            onClick={handleSyncWebhook}
            disabled={isSyncing}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isSyncing ? "Syncing..." : "Sync to Sheet"}</span>
          </button>
        </div>

        {syncStatus && (
          <div className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 p-2.5 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncStatus}</span>
          </div>
        )}
      </div>

      {/* Section-Wise Mastery Progress */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
          <span>Section-Wise Accuracy & Mastery</span>
          <span className="text-xs font-mono text-slate-500">Live Feedback Analytics</span>
        </h3>

        {Object.keys(sectionStats).length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No section data recorded yet. Start any mock test to view live accuracy trends.
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(sectionStats).map(([sec, stats]) => {
              const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
              return (
                <div key={sec} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>{sec}</span>
                    <span className="font-mono text-slate-900">
                      {stats.correct} / {stats.total} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        pct >= 70
                          ? "bg-emerald-500"
                          : pct >= 50
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Question Attempt Logs Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Attempt Feedback & Explanation Log ({attemptHistory.length} records)
          </h3>
          {attemptHistory.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear Log
            </button>
          )}
        </div>

        {attemptHistory.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-500">
            No question logs in the database. Choose a test and start solving to populate live tracking data!
          </div>
        ) : (
          <div className="overflow-x-auto max-h-96 scrollbar-thin">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Q#</th>
                  <th className="py-2.5 px-3">Section</th>
                  <th className="py-2.5 px-3">Question</th>
                  <th className="py-2.5 px-3">Selected</th>
                  <th className="py-2.5 px-3">Correct</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Attempts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attemptHistory.slice(-50).reverse().map((a, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{a.questionIndex}</td>
                    <td className="py-2.5 px-3 text-slate-600 font-semibold">{a.section}</td>
                    <td className="py-2.5 px-3 text-slate-900 max-w-xs truncate" title={a.questionText}>
                      {a.questionText}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium">{a.selectedOptionText}</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">{a.correctOptionText}</td>
                    <td className="py-2.5 px-3">
                      {a.isCorrect ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Correct
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                          Wrong
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">{a.attemptsCountOnQuestion || 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AI Study Schedule Modal */}
      <StudyScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        weakTopics={modalWeakTopics}
      />
    </div>
  );
};
