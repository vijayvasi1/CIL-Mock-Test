import type { Question } from "../types";
import { ALL_SETS } from "./allSetsData";
import { IMPORTED_QUESTION_SETS } from "./importedQuestionSets";
import { FRESH_PAPER1_QUESTIONS } from "./researchData";

export const INITIAL_RAW_DATA: Record<string, Question[]> = {
  ...IMPORTED_QUESTION_SETS,
  s7p1: FRESH_PAPER1_QUESTIONS,
};

// Initialize all sets
export function initAllQuizData() {
  Object.assign(ALL_SETS, IMPORTED_QUESTION_SETS);
  ALL_SETS["s7p1"] = FRESH_PAPER1_QUESTIONS;
}
