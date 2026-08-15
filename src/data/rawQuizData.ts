import { Question } from "../types";
import { ALL_SETS } from "./allSetsData";
import { FRESH_PAPER1_QUESTIONS } from "./researchData";

export const INITIAL_RAW_DATA: Record<string, Question[]> = {
  s7p1: FRESH_PAPER1_QUESTIONS,
};

// Initialize all sets
export function initAllQuizData() {
  ALL_SETS["s7p1"] = FRESH_PAPER1_QUESTIONS;
}
