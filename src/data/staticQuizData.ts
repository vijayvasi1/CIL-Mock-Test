import { Question } from "../types";
import { ALL_SETS } from "./allSetsData";

// Extract base RAW sets with rich explanations added
export const QUIZ_SETS_RECORD: Record<string, Question[]> = ALL_SETS;

// Getter function that retrieves sets
export function getQuizSet(key: string): Question[] {
  return ALL_SETS[key] || [];
}

