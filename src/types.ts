export interface Question {
  section: string;
  q: string;
  opts: string[];
  ans: number; // 0-based index of the correct option
  exp?: string; // High-yield explanation: Why it's correct, What it is, Who/Where/When
}

export type PaperKey = "p1" | "p2";
export type TestMode = "single" | "full";

export interface SetScoreRecord {
  score: number;
  total: number;
  date: string;
  attempts: number;
}

export interface QuestionAttemptFeedback {
  questionIndex: number;
  questionText: string;
  section: string;
  selectedOptionIndex: number;
  selectedOptionText: string;
  correctOptionIndex: number;
  correctOptionText: string;
  isCorrect: boolean;
  attemptsCountOnQuestion: number;
  wrongPicks: number[];
  timestamp: string;
  explanation?: string;
}

export interface TestSessionLog {
  id: string;
  setId: number | string;
  paper: PaperKey;
  mode: TestMode;
  startTime: string;
  endTime?: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  percentage: number;
  sectionScores: Record<string, { correct: number; total: number }>;
  questionLogs: Record<number, QuestionAttemptFeedback>;
}

export interface TopicWeightage {
  topic: string;
  expectedQuestions: string;
  weightagePercent: number;
  difficulty: "Easy-Moderate" | "Moderate" | "Moderate-Hard" | "Hard";
  highYieldAreas: string[];
}

export interface HighProbabilityConcept {
  id: number;
  title: string;
  subject: string;
  probability: "Very High" | "High";
  summary: string;
  coreRule: string;
  typicalQuestionStyle: string;
}

export interface SpecificPrediction {
  id: number;
  category: "CIL & Coal Sector" | "Computer Science & System";
  title: string;
  prediction: string;
  keyFacts: string;
  sourceContext: string;
}
