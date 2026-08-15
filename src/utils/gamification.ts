import { GamificationBadge, QuestionAttemptFeedback } from "../types";

export const DEFAULT_BADGES: GamificationBadge[] = [
  {
    id: "cil_speedster",
    title: "CIL Speedster",
    description: "Complete a mock test with rapid pacing (<35 seconds/question average) while maintaining ≥60% accuracy.",
    icon: "Zap",
    category: "speed",
    rarity: "Epic",
    unlocked: false,
  },
  {
    id: "concept_master",
    title: "Concept Master",
    description: "Achieve an exceptional score of ≥85% accuracy on any CIL MT mock test.",
    icon: "Brain",
    category: "mastery",
    rarity: "Legendary",
    unlocked: false,
  },
  {
    id: "maharatna_qualifier",
    title: "CIL Maharatna Qualifier",
    description: "Clear the official CIL MT Qualifying Cutoff (≥60% UR benchmark) in a full examination paper.",
    icon: "Award",
    category: "accuracy",
    rarity: "Common",
    unlocked: false,
  },
  {
    id: "bullseye_ace",
    title: "Bullseye (First-Try Ace)",
    description: "Solve 15 or more questions on the very first attempt without any wrong picks.",
    icon: "Target",
    category: "accuracy",
    rarity: "Rare",
    unlocked: false,
  },
  {
    id: "proctored_integrity",
    title: "Proctored Integrity Shield",
    description: "Successfully submit a timed test with zero proctoring infractions or tab switches.",
    icon: "ShieldCheck",
    category: "discipline",
    rarity: "Common",
    unlocked: false,
  },
  {
    id: "cs_wizard",
    title: "CS Architecture Wizard",
    description: "Score ≥80% on Paper II Computer Science & Information Technology modules.",
    icon: "Cpu",
    category: "mastery",
    rarity: "Rare",
    unlocked: false,
  },
  {
    id: "aptitude_champion",
    title: "Aptitude Champion",
    description: "Score ≥80% on Paper I General Aptitude, Reasoning & Numerical Ability.",
    icon: "Calculator",
    category: "mastery",
    rarity: "Rare",
    unlocked: false,
  },
  {
    id: "cbt_veteran",
    title: "CBT Veteran",
    description: "Complete 3 or more mock test sessions across different question sets.",
    icon: "Flame",
    category: "persistence",
    rarity: "Rare",
    unlocked: false,
  },
  {
    id: "hard_core_conqueror",
    title: "Hard Tier Conqueror",
    description: "Correctly crack at least 5 'Hard' difficulty questions in a single exam paper.",
    icon: "Sparkles",
    category: "mastery",
    rarity: "Epic",
    unlocked: false,
  },
  {
    id: "streak_striker",
    title: "Streak Striker",
    description: "Attain qualifying marks across 2 consecutive mock test attempts.",
    icon: "TrendingUp",
    category: "persistence",
    rarity: "Legendary",
    unlocked: false,
  },
];

const STORAGE_KEY_BADGES = "cil_unlocked_badges";
const STORAGE_KEY_SESSIONS = "cil_test_session_history";

export function getSavedBadges(): GamificationBadge[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BADGES);
    if (!raw) return DEFAULT_BADGES;
    const parsed: Record<string, { unlocked: boolean; unlockedAt: string }> = JSON.parse(raw);
    return DEFAULT_BADGES.map((b) => {
      const saved = parsed[b.id];
      if (saved && saved.unlocked) {
        return {
          ...b,
          unlocked: true,
          unlockedAt: saved.unlockedAt,
        };
      }
      return b;
    });
  } catch {
    return DEFAULT_BADGES;
  }
}

export function saveBadgeUnlock(badgeId: string): void {
  try {
    const existing = getSavedBadges();
    const map: Record<string, { unlocked: boolean; unlockedAt: string }> = {};
    existing.forEach((b) => {
      if (b.unlocked) map[b.id] = { unlocked: true, unlockedAt: b.unlockedAt || new Date().toISOString() };
    });
    map[badgeId] = { unlocked: true, unlockedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY_BADGES, JSON.stringify(map));
  } catch {}
}

export function getTestSessionHistory(): any[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTestSessionHistory(sessionData: {
  setNumber: string | number;
  paperName: string;
  total: number;
  correct: number;
  wrong: number;
  unanswered: number;
  percentage: number;
  timeSpentSeconds?: number;
  tabSwitchTermination?: boolean;
}): any[] {
  try {
    const history = getTestSessionHistory();
    const newRecord = {
      id: `session_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...sessionData,
    };
    history.push(newRecord);
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(history));
    return history;
  } catch {
    return [];
  }
}

export interface EvaluateBadgesParams {
  summary: {
    total: number;
    correct: number;
    wrong: number;
    unanswered: number;
    questionLogs: Record<number, QuestionAttemptFeedback>;
    tabSwitchTermination?: boolean;
    timeSpentSeconds?: number;
  };
  paperName: string;
  setNumber: string | number;
}

export function evaluateBadgesAfterTest(params: EvaluateBadgesParams): {
  newlyUnlocked: GamificationBadge[];
  allBadges: GamificationBadge[];
} {
  const { summary, paperName, setNumber } = params;
  const percentage = Math.round((summary.correct / (summary.total || 1)) * 100);
  const timeSpent = summary.timeSpentSeconds || 60;
  const timePerQ = timeSpent / (summary.total || 1);

  // Save session record
  const history = saveTestSessionHistory({
    setNumber,
    paperName,
    total: summary.total,
    correct: summary.correct,
    wrong: summary.wrong,
    unanswered: summary.unanswered,
    percentage,
    timeSpentSeconds: timeSpent,
    tabSwitchTermination: summary.tabSwitchTermination,
  });

  const currentBadges = getSavedBadges();
  const alreadyUnlockedIds = new Set(currentBadges.filter((b) => b.unlocked).map((b) => b.id));
  const newlyUnlocked: GamificationBadge[] = [];

  const unlockCandidate = (id: string) => {
    if (!alreadyUnlockedIds.has(id)) {
      saveBadgeUnlock(id);
      alreadyUnlockedIds.add(id);
      const match = DEFAULT_BADGES.find((b) => b.id === id);
      if (match) {
        newlyUnlocked.push({
          ...match,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        });
      }
    }
  };

  // 1. CIL Speedster: < 35s per question and >= 60% accuracy
  if (timePerQ <= 35 && percentage >= 60 && summary.total >= 5) {
    unlockCandidate("cil_speedster");
  }

  // 2. Concept Master: >= 85% accuracy
  if (percentage >= 85) {
    unlockCandidate("concept_master");
  }

  // 3. CIL Maharatna Qualifier: >= 60%
  if (percentage >= 60 && summary.correct >= 4) {
    unlockCandidate("maharatna_qualifier");
  }

  // 4. Bullseye Ace: >= 15 first-try correct questions
  const firstTryCorrect = Object.values(summary.questionLogs || {}).filter(
    (l) => l.isCorrect && (!l.wrongPicks || l.wrongPicks.length === 0)
  ).length;
  if (firstTryCorrect >= 15 || (firstTryCorrect >= summary.total && summary.total >= 8)) {
    unlockCandidate("bullseye_ace");
  }

  // 5. Proctored Integrity: No tab switch violation
  if (!summary.tabSwitchTermination && summary.total >= 5) {
    unlockCandidate("proctored_integrity");
  }

  // 6. CS Architecture Wizard / Aptitude Champion
  const isPaper2 = paperName.toLowerCase().includes("paper ii") || paperName.toLowerCase().includes("computer");
  const isPaper1 = paperName.toLowerCase().includes("paper i") || paperName.toLowerCase().includes("aptitude");
  if (isPaper2 && percentage >= 80) {
    unlockCandidate("cs_wizard");
  }
  if (isPaper1 && percentage >= 80) {
    unlockCandidate("aptitude_champion");
  }

  // 7. Hard Tier Conqueror: >= 5 hard questions solved correctly
  const hardSolved = Object.values(summary.questionLogs || {}).filter(
    (l) => l.isCorrect && l.difficulty === "Hard"
  ).length;
  if (hardSolved >= 3) {
    unlockCandidate("hard_core_conqueror");
  }

  // 8. CBT Veteran: 3 or more sessions completed
  if (history.length >= 3) {
    unlockCandidate("cbt_veteran");
  }

  // 9. Streak Striker: last 2 sessions have >= 60%
  if (history.length >= 2) {
    const lastTwo = history.slice(-2);
    if (lastTwo.every((h) => (h.percentage || 0) >= 60)) {
      unlockCandidate("streak_striker");
    }
  }

  return {
    newlyUnlocked,
    allBadges: getSavedBadges(),
  };
}
