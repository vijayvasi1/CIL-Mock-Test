import React from "react";
import { BookOpen, BarChart3, Sparkles, Award, Layers } from "lucide-react";

interface HeaderProps {
  activeTab: "quiz" | "research" | "analytics";
  setActiveTab: (tab: "quiz" | "research" | "analytics") => void;
  onOpenGenerator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenGenerator,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center font-bold text-slate-950 text-sm shadow-sm ring-2 ring-amber-400/30">
              CIL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-100">
                  CIL MT (System) Exam Console
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  2025–2026 Recruitment
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden md:block">
                Coal India Limited · Management Trainee CBT Prep & Live Research Engine
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab("quiz")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "quiz"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Mock Tests</span>
            </button>

            <button
              onClick={() => setActiveTab("research")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "research"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Research Hub</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "analytics"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics & Sync</span>
            </button>

            {/* AI Real-Time Generator Action Button */}
            <button
              onClick={onOpenGenerator}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs sm:text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm border border-emerald-400/30 transition-all ml-1 sm:ml-2"
              title="Generate fresh real-time questions using AI Search Grounding"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span className="hidden sm:inline">AI Live Generator</span>
              <span className="sm:hidden">Live AI</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
