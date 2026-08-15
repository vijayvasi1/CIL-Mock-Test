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
} from "lucide-react";
import { QuestionAttemptFeedback } from "../types";

export const AnalyticsView: React.FC = () => {
  const [attemptHistory, setAttemptHistory] = useState<any[]>([]);
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

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
    } catch {}
  }, []);

  const totalAttempts = attemptHistory.length;
  const correctCount = attemptHistory.filter((a) => a.isCorrect).length;
  const overallAccuracy =
    totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

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
    if (window.confirm("Are you sure you want to clear your local attempt analytics database?")) {
      localStorage.removeItem("cil_attempt_history");
      setAttemptHistory([]);
      setSyncStatus(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Total Questions Attempted</span>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 mt-2">
            {totalAttempts}
          </div>
          <div className="text-xs text-slate-500 mt-1">Logged with who/what/where facts</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Overall Accuracy</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 mt-2">
            {overallAccuracy}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {correctCount} correct out of {totalAttempts} questions
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Sections Covered</span>
            <Layers className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 mt-2">
            {Object.keys(sectionStats).length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Paper I & Paper II categories</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Database Sync Status</span>
            <UploadCloud className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-sm font-bold text-slate-900 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Local DB Ready</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Ready to export to Google Sheets</div>
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
    </div>
  );
};
