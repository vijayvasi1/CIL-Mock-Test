export type QuestionDifficulty = "Easy" | "Medium" | "Hard";

export interface Question {
  section: string;
  q: string;
  opts: string[];
  ans: number; // 0-based index of the correct option
  exp?: string; // High-yield explanation: Why it's correct, What it is, Who/Where/When
  difficulty?: QuestionDifficulty;
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
  difficulty?: QuestionDifficulty;
  markedForReview?: boolean;
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
  terminatedDueToTabSwitch?: boolean;
  timeSpentSeconds?: number;
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

export type BadgeCategory = "speed" | "accuracy" | "mastery" | "persistence" | "discipline";
export type BadgeRarity = "Common" | "Rare" | "Epic" | "Legendary";

export interface GamificationBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface StudyResourceItem {
  id: string;
  title: string;
  category: "Official Syllabus" | "Coal Sector & PSU" | "CS & IT Core" | "Aptitude & Reasoning" | "General English" | "Past Papers";
  description: string;
  fileType: "PDF" | "Doc" | "CheatSheet" | "Portal";
  estimatedReadTime: string;
  downloadUrl?: string;
  directLink?: string;
  keyHighlights: string[];
  offlineAvailable: boolean;
  contentMarkdown?: string;
}

export interface DailyStudyPlan {
  dayNumber: number;
  dayTitle: string;
  focusPaper: "Paper I (Aptitude)" | "Paper II (CS & IT)" | "Full Mock & Revision";
  timeCommitment: string;
  keyObjectives: string[];
  revisionTopics: string[];
  practiceTarget: string;
  proTips: string;
}

export interface PersonalizedStudySchedule {
  title: string;
  durationDays: number;
  dailyHours: number;
  generatedAt: string;
  weakTopicsIdentified: string[];
  summaryDiagnosis: string;
  days: DailyStudyPlan[];
}

export interface CategoryHeatmapItem {
  category: string;
  paper: "Paper I" | "Paper II";
  totalAttempts: number;
  correctAttempts: number;
  wrongAttempts: number;
  accuracy: number;
  hardQuestionsAttempted: number;
  hardQuestionsFailed: number;
  statusTier: "critical" | "warning" | "moderate" | "mastered";
  lastTested?: string;
}

