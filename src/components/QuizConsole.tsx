import React, { useState, useEffect, useRef, useCallback } from "react";
import { Question, QuestionAttemptFeedback, QuestionDifficulty } from "../types";
import { normalizeQuestions } from "../utils/difficulty";
import { saveTestSessionHistory } from "../utils/gamification";
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
  Bookmark,
  BookmarkCheck,
  ShieldAlert,
  ShieldCheck,
  Menu,
  X,
  Layers,
  Send,
  EyeOff,
  Flame,
  Keyboard,
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
    tabSwitchTermination?: boolean;
    timeSpentSeconds?: number;
  }) => void;
  onBackToHome: () => void;
}

const LETTERS = ["A", "B", "C", "D"];
const TAB_SWITCH_MAX_SECONDS = 10; // Strict 10-second tab switch limit

export const QuizConsole: React.FC<QuizConsoleProps> = ({
  questions: rawQuestions,
  title,
  setNumber,
  paperName,
  onFinishTest,
  onBackToHome,
}) => {
  // Ensure questions have difficulty tags and normalized structure
  const questions = normalizeQuestions(rawQuestions);

  // Time Calculation: Standard CIL CBT format (~54 sec/question, e.g. 90 mins for 100 Qs)
  const initialTimeSeconds = Math.max(600, questions.length * 54);
  //const initialTimeSeconds = 1 * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialTimeSeconds);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [sidebarFilter, setSidebarFilter] = useState<"all" | "marked" | "unanswered" | "answered" | "Easy" | "Medium" | "Hard">("all");

  // Tracking state per question:
  const [solvedQuestions, setSolvedQuestions] = useState<Set<number>>(new Set());
  const [wrongPicksMap, setWrongPicksMap] = useState<Record<number, number[]>>({});
  const [firstPickedMap, setFirstPickedMap] = useState<Record<number, number>>({});
  const [markedForReviewSet, setMarkedForReviewSet] = useState<Set<number>>(new Set());
  const [questionLogs, setQuestionLogs] = useState<Record<number, QuestionAttemptFeedback>>({});
  const [activeSectionFilter, setActiveSectionFilter] = useState<string>("all");
  const [showManualSubmitModal, setShowManualSubmitModal] = useState<boolean>(false);

  // Synchronized Mutable Refs to guarantee latest state across all timer and callback closures
  const solvedQuestionsRef = useRef<Set<number>>(new Set());
  const wrongPicksMapRef = useRef<Record<number, number[]>>({});
  const firstPickedMapRef = useRef<Record<number, number>>({});
  const markedForReviewSetRef = useRef<Set<number>>(new Set());
  const questionLogsRef = useRef<Record<number, QuestionAttemptFeedback>>({});

  // Anti-Cheating / Tab Switch Proctoring State
  const [isTabAway, setIsTabAway] = useState<boolean>(false);
  const [tabAwayCountDown, setTabAwayCountDown] = useState<number>(TAB_SWITCH_MAX_SECONDS);
  const [tabWarningNotice, setTabWarningNotice] = useState<string | null>(null);
  const [tabSwitchViolationOccurred, setTabSwitchViolationOccurred] = useState<boolean>(false);

  const startTimeRef = useRef<number>(Date.now());
  const questionStartTimeRef = useRef<number>(Date.now());
  const awayTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const tabAwayStartRef = useRef<number | null>(null);

  // Forward ref for handleSubmit to ensure interval/timeout timers always invoke the latest handler
  const handleSubmitRef = useRef<(auto?: boolean, isTabSwitchViolation?: boolean) => void>(() => {});

  // Extract unique sections
  const sections = Array.from(new Set(questions.map((q) => q.section)));

  // Difficulty badge styling helper
  const getDifficultyStyle = (diff?: QuestionDifficulty) => {
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

  // Format time as HH:MM:SS
  const formatTime = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const pad = (n: number) => (n < 10 ? "0" : "") + n;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  // Time remaining progress calculation
  const timeProgressPercent = Math.max(0, Math.min(100, (secondsRemaining / initialTimeSeconds) * 100));

  const handleRequestManualSubmit = () => {
    setIsSidebarOpen(false);
    setShowManualSubmitModal(true);
  };

  const handleSubmit = useCallback(
    (auto = false, isTabSwitchViolation = false) => {
      setShowManualSubmitModal(false);

      let correctCount = 0;
      let wrongCount = 0;
      let unansweredCount = 0;

      const currentFirstPicked = { ...firstPickedMapRef.current };
      const currentSolved = solvedQuestionsRef.current;
      const currentWrongMap = wrongPicksMapRef.current;
      const currentLogs = { ...questionLogsRef.current };
      const currentMarked = markedForReviewSetRef.current;

      questions.forEach((q, i) => {
        let firstPick = currentFirstPicked[i];

        // Fallbacks to guarantee no valid attempt is ever dropped:
        if (firstPick === undefined && currentLogs[i]?.selectedOptionIndex !== undefined) {
          firstPick = currentLogs[i].selectedOptionIndex;
        } else if (firstPick === undefined && currentSolved.has(i)) {
          firstPick = q.ans;
        } else if (firstPick === undefined && currentWrongMap[i] && currentWrongMap[i].length > 0) {
          firstPick = currentWrongMap[i][0];
        }

        if (firstPick === undefined) {
          unansweredCount++;
          if (!currentLogs[i]) {
            currentLogs[i] = {
              questionIndex: i + 1,
              questionText: q.q,
              section: q.section,
              selectedOptionIndex: undefined as any,
              selectedOptionText: undefined as any,
              correctOptionIndex: q.ans,
              correctOptionText: q.opts[q.ans],
              isCorrect: false,
              attemptsCountOnQuestion: 0,
              wrongPicks: [],
              timestamp: new Date().toISOString(),
              explanation: q.exp,
              difficulty: q.difficulty,
              markedForReview: currentMarked.has(i),
            };
          }
        } else if (firstPick === q.ans) {
          correctCount++;
        } else {
          wrongCount++;
        }
      });

      const timeSpent = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
      const percentage = Math.round((correctCount / (questions.length || 1)) * 100);

      // Persist full test session for analytics and trends
      try {
        saveTestSessionHistory({
          setNumber,
          paperName,
          total: questions.length,
          correct: correctCount,
          wrong: wrongCount,
          unanswered: unansweredCount,
          percentage,
          timeSpentSeconds: timeSpent,
          tabSwitchTermination: isTabSwitchViolation,
        });

        // Ensure attempt history has all answered logs
        const stored = localStorage.getItem("cil_attempt_history") || "[]";
        const parsed = JSON.parse(stored);
        Object.values(currentLogs as Record<number, QuestionAttemptFeedback>).forEach((log) => {
          if (log && log.selectedOptionIndex !== undefined) {
            parsed.push({
              set: setNumber,
              paper: paperName,
              ...log,
            });
          }
        });
        if (parsed.length > 2500) parsed.splice(0, parsed.length - 2500);
        localStorage.setItem("cil_attempt_history", JSON.stringify(parsed));
      } catch {}

      onFinishTest({
        total: questions.length,
        correct: correctCount,
        wrong: wrongCount,
        unanswered: unansweredCount,
        questionLogs: currentLogs,
        tabSwitchTermination: isTabSwitchViolation,
        timeSpentSeconds: timeSpent,
      });
    },
    [questions, onFinishTest, setNumber, paperName]
  );

  // Keep handleSubmitRef up-to-date
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  // Timer interval for CBT countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          handleSubmitRef.current(true, false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Anti-Cheating Proctoring: 10-Second Tab Switch Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        onTabLeft();
      } else {
        onTabReturned();
      }
    };

    const handleWindowBlur = () => {
      onTabLeft();
    };

    const handleWindowFocus = () => {
      onTabReturned();
    };

    const onTabLeft = () => {
      if (tabSwitchViolationOccurred) return;
      tabAwayStartRef.current = Date.now();
      setIsTabAway(true);
      setTabAwayCountDown(TAB_SWITCH_MAX_SECONDS);

      if (awayTimerIntervalRef.current) {
        clearInterval(awayTimerIntervalRef.current);
      }

      awayTimerIntervalRef.current = setInterval(() => {
        if (!tabAwayStartRef.current) return;
        const elapsed = (Date.now() - tabAwayStartRef.current) / 1000;
        const remaining = Math.max(0, TAB_SWITCH_MAX_SECONDS - elapsed);
        setTabAwayCountDown(Math.ceil(remaining));

        if (elapsed >= TAB_SWITCH_MAX_SECONDS) {
          if (awayTimerIntervalRef.current) {
            clearInterval(awayTimerIntervalRef.current);
          }
          setTabSwitchViolationOccurred(true);
          setIsTabAway(false);
          // Terminate and auto-submit test due to proctoring violation!
          handleSubmitRef.current(true, true);
        }
      }, 150);
    };

    const onTabReturned = () => {
      if (tabSwitchViolationOccurred) return;
      if (tabAwayStartRef.current) {
        const awaySeconds = Math.round((Date.now() - tabAwayStartRef.current) / 1000);
        if (awaySeconds >= TAB_SWITCH_MAX_SECONDS) {
          setTabSwitchViolationOccurred(true);
          handleSubmitRef.current(true, true);
        } else if (awaySeconds > 0) {
          setTabWarningNotice(
            `⚠️ Proctoring Warning: Tab switch detected (Away for ${awaySeconds}s). You have ${TAB_SWITCH_MAX_SECONDS - awaySeconds}s remaining before automatic test submission/closure!`
          );
          setTimeout(() => setTabWarningNotice(null), 7000);
        }
      }

      if (awayTimerIntervalRef.current) {
        clearInterval(awayTimerIntervalRef.current);
        awayTimerIntervalRef.current = null;
      }
      tabAwayStartRef.current = null;
      setIsTabAway(false);
      setTabAwayCountDown(TAB_SWITCH_MAX_SECONDS);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      if (awayTimerIntervalRef.current) {
        clearInterval(awayTimerIntervalRef.current);
      }
    };
  }, [tabSwitchViolationOccurred]);

  // Toggle Marked for Review
  const toggleMarkForReview = (index: number) => {
    const isCurrentlyMarked = markedForReviewSetRef.current.has(index);
    if (isCurrentlyMarked) {
      markedForReviewSetRef.current.delete(index);
    } else {
      markedForReviewSetRef.current.add(index);
    }
    const newSet = new Set(markedForReviewSetRef.current);
    setMarkedForReviewSet(newSet);

    if (questionLogsRef.current[index]) {
      questionLogsRef.current[index] = {
        ...questionLogsRef.current[index],
        markedForReview: !isCurrentlyMarked,
      };
      setQuestionLogs((prev) => ({
        ...prev,
        [index]: questionLogsRef.current[index],
      }));
    }
  };

  // Handle option click with instant verification
  const handleOptionClick = (optionIndex: number) => {
    const currentQ = questions[currentIndex];
    const isCorrect = optionIndex === currentQ.ans;
    const existingWrong = wrongPicksMapRef.current[currentIndex] || [];

    if (solvedQuestionsRef.current.has(currentIndex) && isCorrect) return;

    if (firstPickedMapRef.current[currentIndex] === undefined) {
      firstPickedMapRef.current[currentIndex] = optionIndex;
      setFirstPickedMap((prev) => ({ ...prev, [currentIndex]: optionIndex }));
    }

    let updatedWrong = [...existingWrong];
    let isNowSolved = solvedQuestionsRef.current.has(currentIndex);

    if (isCorrect) {
      isNowSolved = true;
      solvedQuestionsRef.current.add(currentIndex);
      setSolvedQuestions(new Set(solvedQuestionsRef.current));
    } else {
      if (!updatedWrong.includes(optionIndex)) {
        updatedWrong.push(optionIndex);
        wrongPicksMapRef.current[currentIndex] = updatedWrong;
        setWrongPicksMap((prev) => ({ ...prev, [currentIndex]: updatedWrong }));
      }
    }

    const isMarked = markedForReviewSetRef.current.has(currentIndex);

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
      difficulty: currentQ.difficulty,
      markedForReview: isMarked,
    };

    questionLogsRef.current[currentIndex] = feedback;
    setQuestionLogs((prev) => ({ ...prev, [currentIndex]: feedback }));

    // Save attempt record to local storage
    try {
      const stored = localStorage.getItem("cil_attempt_history") || "[]";
      const parsed = JSON.parse(stored);
      parsed.push({
        set: setNumber,
        paper: paperName,
        ...feedback,
      });
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

  // Global Keyboard Navigation (Arrow keys, 1-4/A-D for options, M for mark, S for submit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering shortcuts if the user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      // Submit test: Key 'S' or 's' (Opens manual submission confirmation modal)
      if ((e.key === "s" || e.key === "S") && !e.altKey && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        handleRequestManualSubmit();
        return;
      }

      // Next question: ArrowRight, KeyN, or PageDown
      if (e.key === "ArrowRight" || e.key === "n" || e.key === "N" || e.key === "PageDown") {
        e.preventDefault();
        handleNext();
        return;
      }

      // Previous question: ArrowLeft, KeyP, or PageUp
      if (e.key === "ArrowLeft" || e.key === "p" || e.key === "P" || e.key === "PageUp") {
        e.preventDefault();
        handlePrev();
        return;
      }

      // Toggle Mark for Review: Key 'M', 'm', 'F', 'f'
      if (e.key === "m" || e.key === "M" || e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleMarkForReview(currentIndex);
        return;
      }

      // Select Options 1 (A), 2 (B), 3 (C), 4 (D)
      if (e.key === "1" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        handleOptionClick(0);
        return;
      }
      if (e.key === "2" || e.key === "b" || e.key === "B") {
        e.preventDefault();
        handleOptionClick(1);
        return;
      }
      if (e.key === "3" || e.key === "c" || e.key === "C") {
        e.preventDefault();
        handleOptionClick(2);
        return;
      }
      if (e.key === "4" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        handleOptionClick(3);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, questions, firstPickedMap, solvedQuestions, wrongPicksMap, markedForReviewSet]);


  // Current question data
  const currentQ = questions[currentIndex] || {
    section: "General",
    q: "Loading question...",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "",
    difficulty: "Medium" as QuestionDifficulty,
  };

  const isCurrentSolved = solvedQuestions.has(currentIndex);
  const currentWrongPicks = wrongPicksMap[currentIndex] || [];
  const currentTotalAttempts = currentWrongPicks.length + (isCurrentSolved ? 1 : 0);
  const isCurrentMarked = markedForReviewSet.has(currentIndex);

  // Status counts for sidebar
  const answeredCount = Object.keys(firstPickedMap).length;
  const markedCount = markedForReviewSet.size;
  const unansweredCount = questions.length - answeredCount;

  // Filtered indices for palette in sidebar & right column
  const filteredIndices = questions
    .map((q, idx) => ({ q, idx }))
    .filter(({ q, idx }) => {
      if (sidebarFilter === "marked" && !markedForReviewSet.has(idx)) return false;
      if (sidebarFilter === "unanswered" && firstPickedMap[idx] !== undefined) return false;
      if (sidebarFilter === "answered" && firstPickedMap[idx] === undefined) return false;
      if (
        (sidebarFilter === "Easy" || sidebarFilter === "Medium" || sidebarFilter === "Hard") &&
        q.difficulty !== sidebarFilter
      ) {
        return false;
      }
      if (activeSectionFilter !== "all" && q.section !== activeSectionFilter) return false;
      return true;
    })
    .map(({ idx }) => idx);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-5 relative">
      {/* Tab Switch Out-of-Focus Proctoring Overlay */}
      {isTabAway && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-red-950 border-2 border-red-500 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center text-white shadow-2xl space-y-4 animate-bounce">
            <div className="w-16 h-16 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center mx-auto text-red-400">
              <ShieldAlert className="w-10 h-10 animate-pulse" />
            </div>
            <h3 className="text-xl font-extrabold text-red-100">TAB SWITCH DETECTED!</h3>
            <p className="text-sm text-red-200 leading-relaxed">
              You switched away from the active CBT exam tab. Return immediately!
            </p>
            <div className="bg-red-900/80 rounded-xl p-4 border border-red-700">
              <div className="text-xs uppercase font-bold text-red-300">Automatic Test Submission in</div>
              <div className="text-4xl font-extrabold font-mono text-white mt-1">
                {tabAwayCountDown}s
              </div>
            </div>
            <p className="text-xs text-red-300">
              Strict Anti-Cheat Proctoring: If away for more than 10 seconds, the exam automatically terminates.
            </p>
          </div>
        </div>
      )}

      {/* Proctoring Warning Toast Banner */}
      {tabWarningNotice && (
        <div className="bg-amber-500/20 border-2 border-amber-500 rounded-xl p-3.5 text-amber-950 flex items-center justify-between gap-3 shadow-md animate-fade-in">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{tabWarningNotice}</span>
          </div>
          <button
            onClick={() => setTabWarningNotice(null)}
            className="p-1 text-amber-800 hover:text-amber-950 font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Test Header Bar with Timed Mock Test Status & Anti-Cheat Badge */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md text-white space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center text-sm shadow-sm shrink-0">
              {setNumber}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-100">{title}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {paperName}
                </span>
                {/* Anti-Cheating Badge */}
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Proctored CBT (Max 10s Tab Switch)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>Timed Mock Test CBT</span>
                <span>•</span>
                <span>Instant Verification</span>
                <span>•</span>
                <span>Difficulty Tagged</span>
              </p>
            </div>
          </div>

          {/* Controls: Timer, Floating Sidebar Toggle, Submit, Exit */}
          <div className="flex items-center gap-2.5 self-end md:self-auto flex-wrap">
            {/* Floating Navigation Sidebar Launcher Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-all shadow-sm"
              title="Open Floating Question Navigator"
            >
              <Menu className="w-4 h-4 text-amber-400" />
              <span>Navigator ({answeredCount}/{questions.length})</span>
            </button>

            {/* Countdown Timer Display */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono font-bold text-sm sm:text-base transition-all ${
                secondsRemaining <= 300
                  ? "bg-red-500/25 border-red-500 text-red-300 animate-pulse"
                  : secondsRemaining <= 900
                  ? "bg-amber-500/20 border-amber-500 text-amber-300"
                  : "bg-slate-800 border-slate-700 text-slate-100"
              }`}
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleRequestManualSubmit}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Test</span>
            </button>

            {/* Exit Button */}
            <button
              onClick={onBackToHome}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-lg border border-slate-700"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Visual Progress Bar Indicating Time Remaining */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-slate-300 font-semibold">
              <Clock className="w-3 h-3 text-amber-400" />
              Time Remaining Progress
            </span>
            <span>{Math.round(timeProgressPercent)}% left ({Math.round(secondsRemaining / 60)} mins)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                secondsRemaining <= 300
                  ? "bg-gradient-to-r from-red-600 to-red-400 animate-pulse shadow-sm"
                  : secondsRemaining <= 900
                  ? "bg-gradient-to-r from-amber-600 to-amber-400"
                  : "bg-gradient-to-r from-emerald-600 to-emerald-400"
              }`}
              style={{ width: `${timeProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Question, Interactive Options, Explanation (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
            {/* Question Meta Header with Difficulty Tag & Mark for Review */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-bold font-mono rounded-lg border border-amber-200 dark:border-amber-800">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700">
                  {currentQ.section}
                </span>

                {/* Difficulty Tag Badge */}
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${getDifficultyStyle(currentQ.difficulty)}`}>
                  ● {currentQ.difficulty || "Medium"} Difficulty
                </span>
              </div>

              {/* Mark for Review Button & Solved Status */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleMarkForReview(currentIndex)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                    isCurrentMarked
                      ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100"
                  }`}
                  title="Bookmark / Flag question for later review"
                >
                  {isCurrentMarked ? (
                    <>
                      <BookmarkCheck className="w-3.5 h-3.5" />
                      <span>Marked for Review</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                      <span>Mark for Review</span>
                    </>
                  )}
                </button>

                {/* Solved Indicator */}
                {isCurrentSolved ? (
                  <span className="flex items-center gap-1 font-bold text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Solved
                  </span>
                ) : currentWrongPicks.length > 0 ? (
                  <span className="flex items-center gap-1 font-semibold text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800">
                    <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    {currentWrongPicks.length} Try
                  </span>
                ) : null}
              </div>
            </div>

            {/* Question Text */}
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
              {currentQ.q}
            </div>

            {/* Interactive Options: Wrong in RED, Correct in GREEN */}
            <div className="space-y-3 pt-1">
              {currentQ.opts.map((optText, optIdx) => {
                const isSelectedWrong = currentWrongPicks.includes(optIdx);
                const isCorrectOption = optIdx === currentQ.ans;
                const isSolvedAndCorrect = isCurrentSolved && isCorrectOption;

                let optionStyle =
                  "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300";
                let badgeStyle = "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300";

                if (isSolvedAndCorrect) {
                  optionStyle =
                    "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold ring-2 ring-emerald-400/40 shadow-xs";
                  badgeStyle = "bg-emerald-600 border-emerald-600 text-white";
                } else if (isSelectedWrong) {
                  optionStyle =
                    "bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-950 dark:text-rose-100 font-semibold ring-2 ring-rose-400/40 opacity-90";
                  badgeStyle = "bg-rose-600 border-rose-600 text-white";
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
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 shrink-0 bg-white/80 dark:bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        Correct
                      </span>
                    )}

                    {isSelectedWrong && (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-300 shrink-0 bg-white/80 dark:bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-rose-300 dark:border-rose-700">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
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
                    ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-100"
                    : "bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80 text-rose-950 dark:text-rose-100"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                    {isCurrentSolved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-900 dark:text-emerald-200">Explanation & Factual Breakdown</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        <span className="text-rose-900 dark:text-rose-200">Wrong Option Selected</span>
                      </>
                    )}
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-white/90 dark:bg-slate-900/90 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    Difficulty: {currentQ.difficulty || "Medium"}
                  </span>
                </div>

                <div className="text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 space-y-2">
                  {isCurrentSolved ? (
                    <div>
                      <div className="font-semibold text-emerald-900 dark:text-emerald-300 mb-1">
                        ✓ Correct Answer: Option {LETTERS[currentQ.ans]} ("{currentQ.opts[currentQ.ans]}")
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 font-normal">
                        {currentQ.exp ||
                          `This corresponds to the verified solution based on established standards in ${currentQ.section}.`}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-rose-800 dark:text-rose-300">
                        The chosen option is incorrect. Try selecting another choice above to discover the right answer and view its factual context.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Bottom Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 gap-3">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous <span className="hidden sm:inline text-[10px] font-mono text-slate-400">([←] / [P])</span></span>
              </button>

              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:block">
                Question {currentIndex + 1} of {questions.length}
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Next <span className="hidden sm:inline text-[10px] font-mono opacity-75">([→] / [N])</span></span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Global Keyboard Navigation Legend */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <Keyboard className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Keyboard Shortcuts:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-[10px] font-mono font-bold shadow-xs">1-4</kbd> / <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-[10px] font-mono font-bold shadow-xs">A-D</kbd> Option
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-[10px] font-mono font-bold shadow-xs">←</kbd> <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-[10px] font-mono font-bold shadow-xs">→</kbd> Prev/Next
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-[10px] font-mono font-bold shadow-xs">M</kbd> Review
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-[10px] font-mono font-bold shadow-xs">S</kbd> Submit
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Section Filters, Quick Palette Grid (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Section Filter Pills */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Filter Section</h4>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveSectionFilter("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeSectionFilter === "all"
                    ? "bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
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
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeSectionFilter === sec
                        ? "bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {sec} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Question Palette */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Question Palette</h4>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {answeredCount} / {questions.length} Answered
              </span>
            </div>

            {/* Quick Completion Metrics */}
            <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] font-bold">
              <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-800">
                {solvedQuestions.size} Solved
              </div>
              <div className="p-1.5 bg-purple-50 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 rounded-lg border border-purple-200 dark:border-purple-800">
                {markedCount} Marked
              </div>
              <div className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700">
                {unansweredCount} Left
              </div>
            </div>

            <div className="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
              {filteredIndices.map((idx) => {
                const isCurrent = idx === currentIndex;
                const isSolved = solvedQuestions.has(idx);
                const hasWrong = (wrongPicksMap[idx] || []).length > 0 && !isSolved;
                const isMarked = markedForReviewSet.has(idx);
                const qDiff = questions[idx]?.difficulty;

                let cellStyle = "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400";
                if (isSolved) {
                  cellStyle = "bg-emerald-600 border-emerald-600 text-white font-bold";
                } else if (hasWrong) {
                  cellStyle = "bg-rose-500 border-rose-500 text-white font-bold";
                } else if (isMarked) {
                  cellStyle = "bg-purple-600 border-purple-600 text-white font-bold";
                }

                if (isCurrent) {
                  cellStyle += " ring-2 ring-amber-500 ring-offset-1 dark:ring-offset-slate-900";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      questionStartTimeRef.current = Date.now();
                    }}
                    className={`aspect-square text-xs rounded-lg border flex flex-col items-center justify-center font-mono transition-all relative cursor-pointer ${cellStyle}`}
                  >
                    <span>{idx + 1}</span>
                    {/* Difficulty dot */}
                    <span
                      className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${
                        qDiff === "Easy"
                          ? "bg-emerald-300"
                          : qDiff === "Hard"
                          ? "bg-purple-300"
                          : "bg-amber-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Palette Legend */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-600 shrink-0" />
                <span>Solved Correct</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-600 shrink-0" />
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-500 shrink-0" />
                <span>Attempted / Wrong</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 shrink-0" />
                <span>Unattempted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Navigation Sidebar (Drawer / Overlay) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between animate-slide-left p-5 space-y-4 overflow-y-auto border-l border-slate-200 dark:border-slate-800">
            <div className="space-y-4">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Menu className="w-5 h-5 text-amber-500" />
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">Question Navigator</h3>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Summary Status Badges */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                  <div className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300">Answered</div>
                  <div className="text-xl font-mono font-extrabold text-emerald-900 dark:text-emerald-200 mt-0.5">
                    {answeredCount}
                  </div>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 rounded-xl">
                  <div className="text-[10px] uppercase font-bold text-purple-800 dark:text-purple-300">Marked</div>
                  <div className="text-xl font-mono font-extrabold text-purple-900 dark:text-purple-200 mt-0.5">
                    {markedCount}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <div className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300">Unanswered</div>
                  <div className="text-xl font-mono font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                    {unansweredCount}
                  </div>
                </div>
              </div>

              {/* Sidebar Quick Filter Tabs */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quick Filter</div>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {(["all", "marked", "unanswered", "answered", "Easy", "Medium", "Hard"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSidebarFilter(filter)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                        sidebarFilter === filter
                          ? "bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {filter === "all" ? "All" : filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Navigation Grid */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <span>Questions ({filteredIndices.length})</span>
                  <span className="text-[11px] font-normal text-slate-400">Click to jump</span>
                </div>
                <div className="grid grid-cols-6 gap-2 max-h-96 overflow-y-auto p-1 scrollbar-thin">
                  {filteredIndices.map((idx) => {
                    const isCurrent = idx === currentIndex;
                    const isSolved = solvedQuestions.has(idx);
                    const hasWrong = (wrongPicksMap[idx] || []).length > 0 && !isSolved;
                    const isMarked = markedForReviewSet.has(idx);
                    const qDiff = questions[idx]?.difficulty;

                    let cellStyle = "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400";
                    if (isSolved) {
                      cellStyle = "bg-emerald-600 border-emerald-600 text-white font-bold";
                    } else if (hasWrong) {
                      cellStyle = "bg-rose-500 border-rose-500 text-white font-bold";
                    } else if (isMarked) {
                      cellStyle = "bg-purple-600 border-purple-600 text-white font-bold";
                    }

                    if (isCurrent) {
                      cellStyle += " ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-slate-900";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentIndex(idx);
                          questionStartTimeRef.current = Date.now();
                          setIsSidebarOpen(false);
                        }}
                        className={`aspect-square text-xs rounded-xl border flex flex-col items-center justify-center font-mono font-bold transition-all relative cursor-pointer ${cellStyle}`}
                      >
                        <span>{idx + 1}</span>
                        {/* Difficulty indicator dot */}
                        <span
                          className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${
                            qDiff === "Easy"
                              ? "bg-emerald-300"
                              : qDiff === "Hard"
                              ? "bg-purple-300"
                              : "bg-amber-300"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                onClick={handleRequestManualSubmit}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Entire Test ({answeredCount}/{questions.length})</span>
              </button>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Navigator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Submit Confirmation Modal (Scenario 2: Candidate submits before time expires) */}
      {showManualSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowManualSubmitModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-2xl shrink-0">
                <HelpCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTime(secondsRemaining)} Remaining</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  Submit Examination?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Do you want to finalize and submit your test now, or would you prefer to wait and review your answers?
                </p>
              </div>
            </div>

            {/* Test Status Quick Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80">
              <div className="text-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Total</div>
                <div className="text-lg font-mono font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                  {questions.length}
                </div>
              </div>
              <div className="text-center p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <div className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">Answered</div>
                <div className="text-lg font-mono font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {answeredCount}
                </div>
              </div>
              <div className="text-center p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                <div className="text-xs text-rose-700 dark:text-rose-300 font-semibold">Unanswered</div>
                <div className="text-lg font-mono font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">
                  {questions.length - answeredCount}
                </div>
              </div>
              <div className="text-center p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                <div className="text-xs text-purple-700 dark:text-purple-300 font-semibold">Marked</div>
                <div className="text-lg font-mono font-extrabold text-purple-600 dark:text-purple-400 mt-0.5">
                  {markedForReviewSet.size}
                </div>
              </div>
            </div>

            {/* Guidance Banner */}
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs space-y-1 text-amber-900 dark:text-amber-200">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>CIL MT Examination Notice</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                There is <strong>no negative marking</strong> in this CBT examination. If you have unanswered questions, you can return to answer them before submitting. Once submitted, you cannot change your answers.
              </p>
            </div>

            {/* Action Buttons: Review vs Submit Now */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => setShowManualSubmitModal(false)}
                className="w-full sm:flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Wait & Review Questions</span>
              </button>

              <button
                onClick={() => handleSubmit(true, false)}
                className="w-full sm:flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Yes, Submit Test Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
