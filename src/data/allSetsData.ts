import { Question } from "../types";
import { FRESH_PAPER1_QUESTIONS } from "./researchData";

// Load the raw sets and enrich them with structured explanations
export const ALL_SETS: Record<string, Question[]> = {
  s7p1: FRESH_PAPER1_QUESTIONS,
};

// Function to register dynamically generated sets
export function registerDynamicSet(key: string, questions: Question[]) {
  ALL_SETS[key] = questions;
  try {
    localStorage.setItem(`custom_set_${key}`, JSON.stringify(questions));
  } catch {}
}

// Function to load any stored dynamic sets from localStorage
export function loadSavedDynamicSets() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("custom_set_")) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          const setKey = key.replace("custom_set_", "");
          ALL_SETS[setKey] = parsed;
        }
      }
    }
  } catch {}
}

// Helper to retrieve questions
export function getQuestionsForSet(set: number | string, paper: "p1" | "p2"): Question[] {
  const key = `s${set}${paper}`;
  return ALL_SETS[key] || [];
}
