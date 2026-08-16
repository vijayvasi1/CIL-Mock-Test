import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Clock,
  ArrowRight,
  Flame,
  Sparkles,
  HelpCircle,
  BookOpen,
  ChevronRight,
  Trophy,
} from "lucide-react";
import { COAL_FACT_CHECK_QUESTIONS, FactCheckQuestion } from "../data/coalKnowledgeData";

interface CoalFactCheckQuizProps {
  onStartFullTest?: () => void;
}

export const CoalFactCheckQuiz: React.FC<CoalFactCheckQuizProps> = ({ onStartFullTest }) => {
  const [questions] = useState<FactCheckQuestion[]>(() => {
    // Shuffle slightly for freshness
    return [...COAL_FACT_CHECK_QUESTIONS].sort(() => Math.random() - 0.5);
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [attemptHistory, setAttemptHistory] = useState<{
    question: string;
    selected: string;
    correct: string;
    isCorrect: boolean;
    explanation: string;
  }[]>([]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;

    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      setStreak(0);
    }

    setAttemptHistory((prev) => [
      ...prev,
      {
        question: currentQ.question,
        selected: currentQ.options[idx],
        correct: currentQ.options[currentQ.correctIndex],
        isCorrect,
        explanation: currentQ.explanation,
      },
    ]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setIsCompleted(false);
    setAttemptHistory([]);
  };

  const accuracy = Math.round((score / (questions.length || 1)) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md overflow-hidden space-y-0">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-950 text-amber-400 rounded-xl shadow-xs">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-950/80">
              Quick-Fire Drill Mode
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
              Coal Fact Check: Headquarters, Coalfields & Dates
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950/15 backdrop-blur-xs rounded-xl font-mono text-xs font-black">
            <Flame className="w-4 h-4 text-orange-950" />
            <span>Streak: {streak}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-slate-950/15 rounded-xl font-mono text-xs font-black">
            <span>Score: {score}/{questions.length}</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Quiz Area */}
      {!isCompleted ? (
        <div className="p-5 sm:p-8 space-y-6">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-amber-800 dark:text-amber-400 font-mono">
                {currentQ.topic}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
              {currentQ.question}
            </h4>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQ.options.map((opt, idx) => {
                let btnStyle =
                  "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700";

                if (isAnswered) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle =
                      "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border-emerald-500 ring-2 ring-emerald-400";
                  } else if (idx === selectedOption) {
                    btnStyle =
                      "bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 border-rose-500 ring-2 ring-rose-400";
                  } else {
                    btnStyle =
                      "bg-slate-50 dark:bg-slate-800/40 text-slate-400 border-slate-200 dark:border-slate-800 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-3.5 rounded-xl border-2 text-left font-bold text-xs sm:text-sm flex items-start justify-between gap-3 transition-all cursor-pointer ${btnStyle}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </div>

                    {isAnswered && idx === currentQ.correctIndex && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Callout when answered */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 rounded-xl border-2 space-y-1.5 ${
                    selectedOption === currentQ.correctIndex
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400/80 text-emerald-950 dark:text-emerald-200"
                      : "bg-amber-50 dark:bg-amber-950/40 border-amber-400/80 text-amber-950 dark:text-amber-200"
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider">
                    {selectedOption === currentQ.correctIndex ? (
                      <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Correct Answer! (+1 Mark)
                      </span>
                    ) : (
                      <span className="text-rose-700 dark:text-rose-400 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Incorrect
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {currentQ.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {isAnswered ? "Click next to continue the drill" : "Select an option to evaluate"}
            </div>

            {isAnswered && (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>{currentIndex < questions.length - 1 ? "Next Fact Question" : "Complete Drill"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Completed Summary Screen */
        <div className="p-6 sm:p-10 space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-black mx-auto flex items-center justify-center shadow-lg">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Coal Fact Check Completed!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              You tested your mastery of CIL subsidiary headquarters, incorporation years, and coalfield basins.
            </p>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-xl font-black text-slate-900 dark:text-slate-100">{score}/{questions.length}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Score</div>
            </div>
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <div className="text-xl font-black text-emerald-800 dark:text-emerald-300">{accuracy}%</div>
              <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Accuracy</div>
            </div>
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="text-xl font-black text-amber-800 dark:text-amber-300">{bestStreak}</div>
              <div className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase">Best Streak</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quick-Fire Drill</span>
            </button>

            {onStartFullTest && (
              <button
                onClick={onStartFullTest}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Launch Full 100-Q CBT Test</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
