import { Question, QuestionDifficulty } from "../types";

/**
 * Assigns or verifies the difficulty rating for any question.
 * If not explicitly provided, assigns based on question characteristics, length, or index pattern.
 */
export function ensureQuestionDifficulty(q: Partial<Question>, index: number = 0): QuestionDifficulty {
  if (q.difficulty && (q.difficulty === "Easy" || q.difficulty === "Medium" || q.difficulty === "Hard")) {
    return q.difficulty;
  }

  const text = (q.q || "") + " " + (q.exp || "");
  const lowerText = text.toLowerCase();

  // Hard indicators
  if (
    lowerText.includes("numerical") ||
    lowerText.includes("recurrence") ||
    lowerText.includes("deadlock avoidance") ||
    lowerText.includes("banker's algorithm") ||
    lowerText.includes("belady's anomaly") ||
    lowerText.includes("quick sort worst") ||
    lowerText.includes("non-prime attribute") ||
    lowerText.includes("compound interest") ||
    lowerText.includes("relative speed") ||
    lowerText.includes("b+ tree") ||
    lowerText.includes("cidr") ||
    (q.opts && q.opts.some((o) => o.length > 80))
  ) {
    return "Hard";
  }

  // Easy indicators
  if (
    lowerText.includes("headquarters") ||
    lowerText.includes("full form") ||
    lowerText.includes("port 443") ||
    lowerText.includes("which article") ||
    lowerText.includes("established in") ||
    lowerText.includes("maharatna") ||
    lowerText.includes("antonym of") ||
    lowerText.includes("universal gates") ||
    lowerText.includes("program counter") ||
    lowerText.includes("who is the mother")
  ) {
    return "Easy";
  }

  // Balanced default distribution based on index
  const pattern: QuestionDifficulty[] = ["Easy", "Medium", "Medium", "Hard", "Medium", "Easy", "Hard", "Medium"];
  return pattern[index % pattern.length];
}

/**
 * Normalizes an array of questions to ensure all difficulty tags and required fields are populated.
 */
export function normalizeQuestions(questions: Question[]): Question[] {
  return questions.map((q, idx) => ({
    ...q,
    difficulty: ensureQuestionDifficulty(q, idx),
  }));
}
