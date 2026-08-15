import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Download,
  Printer,
  RotateCcw,
  BookOpen,
  Target,
  ArrowRight,
  Flame,
  Check,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { PersonalizedStudySchedule, DailyStudyPlan } from "../types";

interface StudyScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  weakTopics?: string[];
  hardQuestionsFailed?: string[];
}

export const StudyScheduleModal: React.FC<StudyScheduleModalProps> = ({
  isOpen,
  onClose,
  weakTopics = [],
  hardQuestionsFailed = [],
}) => {
  const [daysCount, setDaysCount] = useState<number>(7);
  const [dailyHours, setDailyHours] = useState<number>(4);
  const [schedule, setSchedule] = useState<PersonalizedStudySchedule | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>({});
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);

  // Load saved schedule on mount if exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cil_saved_study_schedule");
      if (saved) {
        setSchedule(JSON.parse(saved));
      }
      const savedCompleted = localStorage.getItem("cil_completed_study_days");
      if (savedCompleted) {
        setCompletedDays(JSON.parse(savedCompleted));
      }
    } catch {}
  }, []);

  if (!isOpen) return null;

  const handleGenerateSchedule = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/generate-study-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weakTopics: weakTopics.length > 0 ? weakTopics : [
            "Operating Systems & Deadlocks",
            "DBMS Normalization & SQL",
            "Coal India Policies & Production",
            "Numerical Ability & Arithmetic",
            "Computer Networks Subnetting",
          ],
          hardQuestionsFailed,
          daysCount,
          dailyHours,
        }),
      });

      const data = await res.json();
      if (data.success && data.schedule) {
        setSchedule(data.schedule);
        setIsAiGenerated(Boolean(data.aiGenerated));
        setExpandedDay(1);
        try {
          localStorage.setItem("cil_saved_study_schedule", JSON.stringify(data.schedule));
        } catch {}
      }
    } catch (err) {
      console.error("Failed to generate schedule:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDayCompletion = (dayNum: number) => {
    const updated = { ...completedDays, [dayNum]: !completedDays[dayNum] };
    setCompletedDays(updated);
    try {
      localStorage.setItem("cil_completed_study_days", JSON.stringify(updated));
    } catch {}
  };

  const handleExportMarkdown = () => {
    if (!schedule) return;

    let md = `# ${schedule.title}\n`;
    md += `**Target Window:** ${schedule.durationDays} Days | **Daily Time:** ${schedule.dailyHours} Hours\n`;
    md += `**Generated Date:** ${new Date(schedule.generatedAt).toLocaleDateString()}\n\n`;
    md += `### Diagnostic Summary\n${schedule.summaryDiagnosis}\n\n`;
    md += `### High-Priority Weak & Hard Topics\n`;
    schedule.weakTopicsIdentified.forEach((t) => {
      md += `- 🎯 ${t}\n`;
    });
    md += `\n---\n\n`;

    schedule.days.forEach((d) => {
      const isDone = completedDays[d.dayNumber] ? "[x]" : "[ ]";
      md += `## Day ${d.dayNumber}: ${d.dayTitle}\n`;
      md += `- **Paper Focus:** ${d.focusPaper}\n`;
      md += `- **Time Target:** ${d.timeCommitment}\n`;
      md += `- **Status:** ${isDone}\n\n`;
      md += `#### Key Objectives:\n`;
      d.keyObjectives.forEach((o) => (md += `- ${o}\n`));
      md += `\n#### Revision Topics & Formulas:\n`;
      d.revisionTopics.forEach((r) => (md += `- ${r}\n`));
      md += `\n- **Practice Target:** ${d.practiceTarget}\n`;
      md += `- **CIL MT Pro-Tip:** ${d.proTips}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CIL_MT_Personalized_Study_Schedule_${schedule.durationDays}Days.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const completedCount = schedule
    ? schedule.days.filter((d) => completedDays[d.dayNumber]).length
    : 0;
  const progressPercent = schedule
    ? Math.round((completedCount / (schedule.days.length || 1)) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-100">
                  AI Personalized CIL MT Study Schedule
                </h3>
                {isAiGenerated && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Gemini 3.7 Optimized
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Tailored day-by-day revision timetable based on your 'Hard' question error hotspots.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Diagnostic Context Pill */}
          {weakTopics.length > 0 && (
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>
                  <strong>Identified Weak Topics to Target:</strong> {weakTopics.slice(0, 4).join(", ")}
                  {weakTopics.length > 4 ? ` (+${weakTopics.length - 4} more)` : ""}
                </span>
              </div>
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 shrink-0">
                Auto-Integrated
              </span>
            </div>
          )}

          {/* Generator Controls */}
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="font-bold text-xs uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-amber-500" />
              <span>Configure Your Study Window & Hours</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Duration Days */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Study Duration:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[7, 14, 21, 30].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDaysCount(d)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        daysCount === d
                          ? "bg-amber-500 text-slate-950 shadow-xs"
                          : "bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {d} Days
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Hours */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Daily Study Hours:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[2, 4, 6, 8].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setDailyHours(h)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        dailyHours === h
                          ? "bg-amber-500 text-slate-950 shadow-xs"
                          : "bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {h} hrs/day
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-end">
                <button
                  onClick={handleGenerateSchedule}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isLoading ? "Generating with AI..." : "Generate Custom Schedule"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Generated Schedule Display */}
          {schedule ? (
            <div className="space-y-4 animate-fade-in">
              {/* Summary Bar & Progress */}
              <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-base text-slate-100">{schedule.title}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">{schedule.summaryDiagnosis}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleExportMarkdown}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 text-slate-200"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export (.md)</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                      <span>Schedule Progress</span>
                      <span>
                        {completedCount} / {schedule.days.length} Days Finished ({progressPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Day-by-Day Accordion Plan */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                  Daily Revision & MCQ Action Plan:
                </div>

                {schedule.days.map((day) => {
                  const isDone = Boolean(completedDays[day.dayNumber]);
                  const isExpanded = expandedDay === day.dayNumber;

                  return (
                    <div
                      key={day.dayNumber}
                      className={`border rounded-xl transition-all overflow-hidden ${
                        isDone
                          ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      {/* Day Header */}
                      <div
                        onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                        className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDayCompletion(day.dayNumber);
                            }}
                            className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all ${
                              isDone
                                ? "bg-emerald-500 border-emerald-600 text-white font-bold"
                                : "border-slate-300 dark:border-slate-600 hover:border-slate-500 bg-white dark:bg-slate-800"
                            }`}
                          >
                            {isDone && <Check className="w-4 h-4" />}
                          </button>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded border border-slate-200 dark:border-slate-700">
                                Day {day.dayNumber}
                              </span>
                              <span className="text-[11px] font-semibold px-2 py-0.5 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded border border-amber-200 dark:border-amber-800">
                                {day.focusPaper}
                              </span>
                            </div>
                            <h5
                              className={`text-sm font-bold mt-1 ${
                                isDone
                                  ? "line-through text-slate-400 dark:text-slate-500"
                                  : "text-slate-900 dark:text-slate-100"
                              }`}
                            >
                              {day.dayTitle}
                            </h5>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <span className="hidden sm:inline-flex items-center gap-1 font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            {day.timeCommitment}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>

                      {/* Day Body */}
                      {isExpanded && (
                        <div className="p-4 pt-0 sm:p-5 sm:pt-0 space-y-3 text-xs border-t border-slate-100 dark:border-slate-800/80 mt-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                              <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                <Target className="w-3.5 h-3.5 text-amber-600" />
                                <span>Key Objectives</span>
                              </div>
                              <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside">
                                {day.keyObjectives.map((obj, i) => (
                                  <li key={i}>{obj}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                              <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                                <span>High-Yield Revision Focus</span>
                              </div>
                              <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside">
                                {day.revisionTopics.map((rev, i) => (
                                  <li key={i}>{rev}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200/80 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900 dark:text-amber-200">
                            <div>
                              <strong>Practice Target:</strong> {day.practiceTarget}
                            </div>
                          </div>

                          <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                            💡 <strong>CIL Exam Strategy:</strong> {day.proTips}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No active study schedule generated yet.
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select your available days and daily study hours above, then click <strong>Generate Custom Schedule</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {schedule && `Auto-saved to local browser storage`}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
