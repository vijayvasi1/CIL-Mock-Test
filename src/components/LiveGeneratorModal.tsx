import React, { useState } from "react";
import { Sparkles, Globe, X, CheckCircle2, AlertCircle, Loader2, BookOpen } from "lucide-react";
import { Question } from "../types";

interface LiveGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionsGenerated: (questions: Question[], paperName: string) => void;
}

export const LiveGeneratorModal: React.FC<LiveGeneratorModalProps> = ({
  isOpen,
  onClose,
  onQuestionsGenerated,
}) => {
  const [paperType, setPaperType] = useState<"p1" | "p2">("p1");
  const [count, setCount] = useState<number>(25);
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string>("");

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setProgressMessage("Searching real-time 2025–2026 CIL notifications & exam patterns via Google Search grounding...");

    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paper: paperType,
          count: count,
          customPrompt: customPrompt.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate questions");
      }

      const data = await response.json();
      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error("No questions returned from generator");
      }

      if (data.fallback && data.warning) {
        setProgressMessage(`✓ ${data.warning} (${data.questions.length} Questions Loaded)`);
      } else {
        setProgressMessage(`✓ Successfully generated ${data.questions.length} real-time verified questions!`);
      }

      setTimeout(() => {
        onQuestionsGenerated(
          data.questions,
          paperType === "p1"
            ? (data.fallback ? "CIL MT Verified Mock Paper I (General Aptitude)" : "AI Real-Time Paper I (General Aptitude)")
            : (data.fallback ? "CIL MT Verified Mock Paper II (Computer Science)" : "AI Real-Time Paper II (Computer Science)")
        );
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || "An error occurred during generation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Real-Time AI Question Generator
              </h3>
              <p className="text-xs text-slate-500">
                Powered by Gemini 2.5 with live Google Search Grounding
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Paper Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Target Paper
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaperType("p1")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                paperType === "p1"
                  ? "bg-amber-50/80 border-amber-400 ring-2 ring-amber-300"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div className="font-bold text-sm text-slate-900">Paper I: General Aptitude</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Current Affairs, CIL, Reasoning, English, Quant
              </div>
            </button>

            <button
              onClick={() => setPaperType("p2")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                paperType === "p2"
                  ? "bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-300"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div className="font-bold text-sm text-slate-900">Paper II: Computer Science</div>
              <div className="text-xs text-slate-500 mt-0.5">
                DBMS, OS, Algorithms, Networks, TOC, Architecture
              </div>
            </button>
          </div>
        </div>

        {/* Number of Questions */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Question Count
          </label>
          <div className="flex gap-2">
            {[10, 25, 50, 100].map((num) => (
              <button
                key={num}
                onClick={() => setCount(num)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                  count === num
                    ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {num} Qs
              </button>
            ))}
          </div>
        </div>

        {/* Custom Focus Prompt (Optional) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Custom Real-Time Search Focus (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g., Focus on 2025 Coal Gasification policies, CIL subsidiaries, and DBMS SQL triggers"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Status / Error feedback */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {progressMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{progressMessage}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching & Synthesizing...</span>
              </>
            ) : (
              <>
                <Globe className="w-4 h-4" />
                <span>Generate Test with Live Grounding</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
