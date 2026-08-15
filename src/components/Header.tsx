import React from "react";
import { BookOpen, BarChart3, Sparkles, Layers, GraduationCap, Sun, Moon, LogOut, UserCheck } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface HeaderProps {
  activeTab: "quiz" | "research" | "analytics" | "resources";
  setActiveTab: (tab: "quiz" | "research" | "analytics" | "resources") => void;
  onOpenGenerator: () => void;
  currentUser?: string | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenGenerator,
  currentUser,
  onLogout,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-xs sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center font-black text-slate-950 text-xs sm:text-sm shadow-xs ring-1 ring-amber-300/40">
              CIL
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-100 truncate">
                  CIL MT (System)
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                  2025–2026 CBT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden lg:block truncate">
                Management Trainee Exam Simulation & Analytics Console
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none">
            <button
              onClick={() => setActiveTab("quiz")}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "quiz"
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Mock Tests</span>
            </button>

            <button
              onClick={() => setActiveTab("resources")}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "resources"
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Study Resources</span>
              <span className="sm:hidden">Resources</span>
            </button>

            <button
              onClick={() => setActiveTab("research")}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "research"
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Research Hub</span>
              <span className="sm:hidden">Research</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "analytics"
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Analytics & Heatmap</span>
              <span className="sm:hidden">Analytics</span>
            </button>
          </nav>

          {/* Right Action Icons: AI Generator & Theme Toggle & User Auth */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* AI Real-Time Generator Action Button */}
            <button
              onClick={onOpenGenerator}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs border border-emerald-400/30 transition-all cursor-pointer whitespace-nowrap"
              title="Generate fresh real-time questions using AI Search Grounding"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden md:inline">Live AI Gen</span>
            </button>

            {/* Global Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer flex items-center justify-center"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-300" />
              )}
            </button>

            {/* Current Logged In User Badge & Logout */}
            {currentUser && onLogout && (
              <div className="flex items-center gap-1.5 pl-1 sm:pl-2 border-l border-slate-800">
                <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-amber-300 font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono">{currentUser}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition-all text-xs font-bold cursor-pointer"
                  title="Sign Out of CBT Examination Portal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

