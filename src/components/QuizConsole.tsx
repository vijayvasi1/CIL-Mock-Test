import React, { useState, useEffect, useRef } from "react";
import { Question, QuestionAttemptFeedback } from "../types";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  BookOpen,
  Award,
  HelpCircle,
  BarChart2,
  Check,
} from "lucide-react";

interface QuizConsoleProps {
  questions: Question[];
  title: string;
  setNumber: number | string;
  paperName: string;
  onFinishTest: (summary: {
    total: number;
    correct: number;
    wrong: number;
    unanswered: number;
    questionLogs: Record<number, QuestionAttemptFeedback>;
  }) => void;
  onBackToHome: () => void;
}

const LETTERS = ["A", "B", "C", "D"];
const TIME_LIMIT_SECONDS = 90 * 60; // 90 minutes per paper

export const QuizConsole: React.FC<QuizConsoleProps> = ({
  questions,
  title,
  setNumber,
  paperName,
  onFinishTest,
  onBackToHome,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(TIME_LIMIT_SECONDS);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Tracking state per question:
  // selectedCorrect: set of question indices where correct answer was finally found
  // wrongPicksByQuestion: record of questionIndex -> array of wrong option indices chosen
  // finalAnswers: record of questionIndex -> first option picked (for traditional test scoring)
  // questionLogs: record of questionIndex -> QuestionAttemptFeedback
  const [solvedQuestions, setSolvedQuestions] = useState<Set<number>>(new Set());
  const [wrongPicksMap, setWrongPicksMap] = useState<Record<number, number[]>>({});
  const [firstPickedMap, setFirstPickedMap] = useState<Record<number, number>>({});
  const [questionLogs, setQuestionLogs] = useState<Record<number, QuestionAttemptFeedback>>({});
  const [activeSectionFilter, setActiveSectionFilter] = useState<string>("all");

  const startTimeRef = useRef<number>(Date.now());
  const questionStartTimeRef = useRef<number>(Date.now());

  // Extract unique sections
  const sections = Array.from(new Set(questions.map((q) => q.section)));

  // Timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM:SS
  const formatTime = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const pad = (n: number) => (n < 10 ? "0" : "") + n;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  // Handle option click with immediate wrong (red) / right (green) highlighting
  const handleOptionClick = (optionIndex: number) => {
    const currentQ = questions[currentIndex];
    const isCorrect = optionIndex === currentQ.ans;
    const existingWrong = wrongPicksMap[currentIndex] || [];

    // If already solved correctly, allow exploring but keep it green
    if (solvedQuestions.has(currentIndex) && isCorrect) return;

    // Record first pick for official scoring if not set yet
    if (firstPickedMap[currentIndex] === undefined) {
      setFirstPickedMap((prev) => ({ ...prev, [currentIndex]: optionIndex }));
    }

    let updatedWrong = [...existingWrong];
    let isNowSolved = solvedQuestions.has(currentIndex);

    if (isCorrect) {
      // Correct answer chosen!
      isNowSolved = true;
      setSolvedQuestions((prev) => new Set(prev).add(currentIndex));
    } else {
      // Wrong option selected -> add to wrong picks if not already there
      if (!updatedWrong.includes(optionIndex)) {
        updatedWrong.push(optionIndex);
        setWrongPicksMap((prev) => ({ ...prev, [currentIndex]: updatedWrong }));
      }
    }

    // Build the attempt feedback record
    const timeSpent = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));
    const feedback: QuestionAttemptFeedback = {
      questionIndex: currentIndex + 1,
      questionText: currentQ.q,
      section: currentQ.section,
      selectedOptionIndex: optionIndex,
      selectedOptionText: currentQ.opts[optionIndex],
      correctOptionIndex: currentQ.ans,
      correctOptionText: currentQ.opts[currentQ.ans],
      isCorrect,
      attemptsCountOnQuestion: updatedWrong.length + (isCorrect ? 1 : 0),
      wrongPicks: updatedWrong,
      timestamp: new Date().toISOString(),
      explanation: currentQ.exp,
    };

    const newLogs = { ...questionLogs, [currentIndex]: feedback };
    setQuestionLogs(newLogs);

    // Save to local storage database for progress tracking
    try {
      const stored = localStorage.getItem("cil_attempt_history") || "[]";
      const parsed = JSON.parse(stored);
      parsed.push({
        set: setNumber,
        paper: paperName,
        ...feedback,
      });
      // Keep recent 2000 records
      if (parsed.length > 2000) parsed.shift();
      localStorage.setItem("cil_attempt_history", JSON.stringify(parsed));
    } catch {}

    // Send attempt log to server in background
    fetch("/api/log-attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        set: setNumber,
        paper: paperName,
        ...feedback,
      }),
    }).catch(() => {});
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      questionStartTimeRef.current = Date.now();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      questionStartTimeRef.current = Date.now();
    }
  };

  const handleSubmit = (auto = false) => {
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    questions.forEach((q, i) => {
      const firstPick = firstPickedMap[i];
      if (firstPick === undefined) {
        unansweredCount++;
      } else if (firstPick === q.ans) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    if (!auto) {
      const remaining = questions.length - Object.keys(firstPickedMap).length;
      if (
        remaining > 0 &&
        !window.confirm(
          `You have ${remaining} unanswered question(s). Are you sure you want to submit the test?`
        )
      ) {
        return;
      }
    }

    onFinishTest({
      total: questions.length,
      correct: correctCount,
      wrong: wrongCount,
      unanswered: unansweredCount,
      questionLogs,
    });
  };

  // Current question data
  const currentQ = questions[currentIndex] || {
    section: "General",
    q: "Loading question...",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "",
  };

  const isCurrentSolved = solvedQuestions.has(currentIndex);
  const currentWrongPicks = wrongPicksMap[currentIndex] || [];
  const currentTotalAttempts = currentWrongPicks.length + (isCurrentSolved ? 1 : 0);

  // Filtered indices for palette
  const filteredIndices = questions
    .map((q, idx) => ({ q, idx }))
    .filter(({ q }) => activeSectionFilter === "all" || q.section === activeSectionFilter)
    .map(({ idx }) => idx);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Test Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow-sm">
            {setNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-100">{title}</h2>
              <span className="text-xs px-2 py-0.5 rounded font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {paperName}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Instant Red/Green Verification Mode · Explanation Card · Database Tracking Enabled
            </p>
          </div>
        </div>

        {/* Timer & Status */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono font-bold text-sm sm:text-base ${
              secondsRemaining <= 300
                ? "bg-red-500/20 border-red-500 text-red-300 animate-pulse"
                : secondsRemaining <= 900
                ? "bg-amber-500/20 border-amber-500 text-amber-300"
                : "bg-slate-800 border-slate-700 text-slate-100"
            }`}
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          <button
            onClick={() => handleSubmit(false)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-all"
          >
            Submit Paper
          </button>

          <button
            onClick={onBackToHome}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-lg border border-slate-700"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Question & Interactive Options (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-sm space-y-6">
            {/* Question Meta Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-xs font-bold font-mono rounded">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded">
                  {currentQ.section}
                </span>
              </div>

              {/* Solved / Tries Indicator */}
              <div className="flex items-center gap-1.5 text-xs">
                {isCurrentSolved ? (
                  <span className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Solved Correctly {currentTotalAttempts > 1 ? `(${currentTotalAttempts} tries)` : ""}
                  </span>
                ) : currentWrongPicks.length > 0 ? (
                  <span className="flex items-center gap-1 font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    <XCircle className="w-3.5 h-3.5 text-red-600" />
                    {currentWrongPicks.length} Incorrect Attempt(s) — Keep trying!
                  </span>
                ) : (
                  <span className="text-slate-400">Select an option</span>
                )}
              </div>
            </div>

            {/* Question Text */}
            <div className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
              {currentQ.q}
            </div>

            {/* Interactive Options: Wrong in RED, True in GREEN */}
            <div className="space-y-3 pt-2">
              {currentQ.opts.map((optText, optIdx) => {
                const isSelectedWrong = currentWrongPicks.includes(optIdx);
                const isCorrectOption = optIdx === currentQ.ans;
                const isSolvedAndCorrect = isCurrentSolved && isCorrectOption;

                let optionStyle =
                  "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300";
                let badgeStyle = "bg-white border-slate-300 text-slate-600";

                if (isSolvedAndCorrect) {
                  // CORRECT ANSWER IS HIGHLIGHTED IN GREEN
                  optionStyle =
                    "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400/40 shadow-sm";
                  badgeStyle = "bg-emerald-600 border-emerald-600 text-white";
                } else if (isSelectedWrong) {
                  // WRONG ANSWER IS HIGHLIGHTED IN RED
                  optionStyle =
                    "bg-red-50 border-red-500 text-red-950 font-semibold ring-2 ring-red-400/40 opacity-90";
                  badgeStyle = "bg-red-600 border-red-600 text-white";
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleOptionClick(optIdx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${optionStyle}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full border font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${badgeStyle}`}
                    >
                      {LETTERS[optIdx]}
                    </div>
                    <div className="text-sm sm:text-base leading-snug pt-0.5 flex-1">{optText}</div>

                    {/* Status Icons */}
                    {isSolvedAndCorrect && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 shrink-0 bg-white/80 px-2 py-0.5 rounded-full border border-emerald-300">
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        Correct
                      </span>
                    )}

                    {isSelectedWrong && (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-700 shrink-0 bg-white/80 px-2 py-0.5 rounded-full border border-red-300">
                        <XCircle className="w-3.5 h-3.5 text-red-600" />
                        Incorrect
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Context Card (Revealed upon selection) */}
            {(isCurrentSolved || currentWrongPicks.length > 0) && (
              <div
                className={`p-4 sm:p-5 rounded-xl border transition-all ${
                  isCurrentSolved
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                    : "bg-red-50/70 border-red-200 text-red-950"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                    {isCurrentSolved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-900">Explanation & Factual Breakdown</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-red-900">Wrong Option Selected</span>
                      </>
                    )}
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-white/90 rounded border border-slate-200 text-slate-700">
                    Logged to database for analytics
                  </span>
                </div>

                <div className="text-xs sm:text-sm leading-relaxed text-slate-800 space-y-2">
                  {isCurrentSolved ? (
                    <div>
                      <div className="font-semibold text-emerald-900 mb-1">
                        ✓ Correct Answer: Option {LETTERS[currentQ.ans]} ("{currentQ.opts[currentQ.ans]}")
                      </div>
                      <p className="text-slate-700 font-normal">
                        {currentQ.exp ||
                          `This corresponds to the verified solution based on established standards in ${currentQ.section}.`}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-red-800">
                        The chosen option is incorrect. Try selecting another choice above to discover the right answer and view its factual context.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Bottom Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="text-xs font-semibold text-slate-500 hidden sm:block">
                Question {currentIndex + 1} of {questions.length}
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Section Filters, Palette & Live Summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Section Filter Pills */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Filter Section</h4>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveSectionFilter("all")}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  activeSectionFilter === "all"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All ({questions.length})
              </button>
              {sections.map((sec, idx) => {
                const count = questions.filter((q) => q.section === sec).length;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveSectionFilter(sec)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                      activeSectionFilter === sec
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {sec} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Palette Grid */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Question Palette</h4>
              <span className="text-xs font-bold text-emerald-700 font-mono">
                {solvedQuestions.size} / {questions.length} Solved
              </span>
            </div>

            <div className="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
              {filteredIndices.map((idx) => {
                const isCurrent = idx === currentIndex;
                const isSolved = solvedQuestions.has(idx);
                const hasWrong = (wrongPicksMap[idx] || []).length > 0 && !isSolved;

                let cellStyle = "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-400";
                if (isSolved) {
                  cellStyle = "bg-emerald-600 border-emerald-600 text-white font-bold";
                } else if (hasWrong) {
                  cellStyle = "bg-red-500 border-red-500 text-white font-bold";
                }

                if (isCurrent) {
                  cellStyle += " ring-2 ring-amber-500 ring-offset-1";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      questionStartTimeRef.current = Date.now();
                    }}
                    className={`aspect-square text-xs rounded border flex items-center justify-center font-mono transition-all ${cellStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Palette Legend */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-600 shrink-0" />
                <span>Solved Correct</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-500 shrink-0" />
                <span>Wrong Attempt</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300 shrink-0" />
                <span>Unattempted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-400 border border-amber-600 shrink-0" />
                <span>Current Question</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
