import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { SetSelector } from "./components/SetSelector";
import { ResearchHub } from "./components/ResearchHub";
import { AnalyticsView } from "./components/AnalyticsView";
import { StudyResources } from "./components/StudyResources";
import { QuizConsole } from "./components/QuizConsole";
import { ResultSummary } from "./components/ResultSummary";
import { LiveGeneratorModal } from "./components/LiveGeneratorModal";
import { ThemeProvider } from "./context/ThemeContext";
import { Question } from "./types";
import { FRESH_PAPER1_QUESTIONS } from "./data/researchData";
import { loadSavedDynamicSets } from "./data/allSetsData";
import { initAllQuizData } from "./data/rawQuizData";

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { SetSelector } from "./components/SetSelector";
import { ResearchHub } from "./components/ResearchHub";
import { AnalyticsView } from "./components/AnalyticsView";
import { StudyResources } from "./components/StudyResources";
import { QuizConsole } from "./components/QuizConsole";
import { ResultSummary } from "./components/ResultSummary";
import { LiveGeneratorModal } from "./components/LiveGeneratorModal";
import { LoginPage } from "./components/LoginPage";
import { ThemeProvider } from "./context/ThemeContext";
import { Question } from "./types";
import { FRESH_PAPER1_QUESTIONS } from "./data/researchData";
import { loadSavedDynamicSets } from "./data/allSetsData";
import { initAllQuizData } from "./data/rawQuizData";

const AUTH_USER_KEY = "cil_logged_in_user";

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    try {
      return localStorage.getItem(AUTH_USER_KEY);
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<"quiz" | "research" | "analytics" | "resources">("quiz");
  const [activeQuiz, setActiveQuiz] = useState<{
    questions: Question[];
    title: string;
    setNumber: number | string;
    paperName: string;
  } | null>(null);

  const [testResult, setTestResult] = useState<{
    summary: any;
    title: string;
    setNumber: number | string;
    paperName: string;
    questions: Question[];
  } | null>(null);

  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  useEffect(() => {
    initAllQuizData();
    loadSavedDynamicSets();
  }, []);

  const handleLoginSuccess = (user: string) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(AUTH_USER_KEY, user);
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveQuiz(null);
    setTestResult(null);
    try {
      localStorage.removeItem(AUTH_USER_KEY);
    } catch {
      // ignore
    }
  };

  // If user is not authenticated, render only the secure login screen
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const handleStartQuiz = (
    questions: Question[],
    title: string,
    setNumber: number | string,
    paperName: string
  ) => {
    setTestResult(null);
    setActiveQuiz({ questions, title, setNumber, paperName });
    setActiveTab("quiz");
  };

  const handleFinishTest = (summary: any) => {
    if (activeQuiz) {
      setTestResult({
        summary,
        title: activeQuiz.title,
        setNumber: activeQuiz.setNumber,
        paperName: activeQuiz.paperName,
        questions: activeQuiz.questions,
      });
      setActiveQuiz(null);
    }
  };

  const handleRetake = () => {
    if (testResult) {
      setActiveQuiz({
        questions: testResult.questions,
        title: testResult.title,
        setNumber: testResult.setNumber,
        paperName: testResult.paperName,
      });
      setTestResult(null);
    }
  };

  const handleBackToHome = () => {
    setActiveQuiz(null);
    setTestResult(null);
  };

  const handleQuestionsGenerated = (questions: Question[], paperName: string) => {
    setActiveQuiz({
      questions,
      title: "Real-Time AI Grounded Practice Paper",
      setNumber: "Live-AI",
      paperName,
    });
    setActiveTab("quiz");
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-amber-500 selection:text-slate-950">
        {/* Global Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab !== "quiz") {
              setActiveQuiz(null);
              setTestResult(null);
            }
          }}
          onOpenGenerator={() => setIsGeneratorOpen(true)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Main Content Body */}
        <main className="flex-1 pb-16">
          {/* Active Quiz Running */}
          {activeQuiz ? (
            <QuizConsole
              questions={activeQuiz.questions}
              title={activeQuiz.title}
              setNumber={activeQuiz.setNumber}
              paperName={activeQuiz.paperName}
              onFinishTest={handleFinishTest}
              onBackToHome={handleBackToHome}
            />
          ) : testResult ? (
            <ResultSummary
              summary={testResult.summary}
              title={testResult.title}
              setNumber={testResult.setNumber}
              paperName={testResult.paperName}
              questions={testResult.questions}
              onRetake={handleRetake}
              onBackToHome={handleBackToHome}
              onOpenAnalytics={() => {
                setTestResult(null);
                setActiveTab("analytics");
              }}
            />
          ) : (
            <>
              {activeTab === "quiz" && (
                <SetSelector
                  onStartQuiz={handleStartQuiz}
                  onOpenGenerator={() => setIsGeneratorOpen(true)}
                  onOpenResearch={() => setActiveTab("research")}
                />
              )}

              {activeTab === "research" && (
                <ResearchHub
                  onStartFreshPaper1={(questions) =>
                    handleStartQuiz(
                      questions,
                      "CIL MT (System) 2025–2026 Research Mock Test — Paper I",
                      "Set 7 (Research)",
                      "Paper I (General Aptitude - 100 Marks)"
                    )
                  }
                />
              )}

              {activeTab === "analytics" && <AnalyticsView />}

              {activeTab === "resources" && <StudyResources />}
            </>
          )}
        </main>

        {/* Live AI Generator Modal */}
        <LiveGeneratorModal
          isOpen={isGeneratorOpen}
          onClose={() => setIsGeneratorOpen(false)}
          onQuestionsGenerated={handleQuestionsGenerated}
        />
      </div>
    </ThemeProvider>
  );
}
