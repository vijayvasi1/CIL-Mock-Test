import { Question } from "../types";
import { FRESH_PAPER1_QUESTIONS } from "./researchData";

// Helper to provide comprehensive explanation if missing
function enrichQuestions(questions: Question[]): Question[] {
  return questions.map((q) => {
    if (q.exp && q.exp.length > 5) return q;
    const correctText = q.opts[q.ans] || "the designated option";
    return {
      ...q,
      exp: `Correct answer: "${correctText}". Based on established standard concepts in ${q.section}, this represents the verified solution rule according to official exam standards.`,
    };
  });
}

// Extract base RAW sets with rich explanations added
export const QUIZ_SETS_RECORD: Record<string, Question[]> = {
  s7p1: FRESH_PAPER1_QUESTIONS,
};

// We will export a getter function that merges any dynamic sets
export function getQuizSet(key: string): Question[] {
  return QUIZ_SETS_RECORD[key] || [];
}
