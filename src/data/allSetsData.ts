import { Question } from "../types";
import { FRESH_PAPER1_QUESTIONS } from "./researchData";
import {
  SET1_PAPER1_QUESTIONS,
  SET2_PAPER1_QUESTIONS,
  SET3_PAPER1_QUESTIONS,
  SET4_PAPER1_QUESTIONS,
  SET5_PAPER1_QUESTIONS,
  SET6_PAPER1_QUESTIONS,
} from "./mockSetsPaper1";
import {
  SET1_PAPER2_QUESTIONS,
  SET2_PAPER2_QUESTIONS,
  SET3_PAPER2_QUESTIONS,
  SET4_PAPER2_QUESTIONS,
  SET5_PAPER2_QUESTIONS,
  SET6_PAPER2_QUESTIONS,
  SET7_PAPER2_QUESTIONS,
} from "./mockSetsPaper2";
import { CIL_SUBSIDIARIES_SPECIAL_SET } from "./cilSubsidiariesSpecialSet";

// Load all verified sets across Paper I, Paper II, Research Mock, and CIL Subsidiaries Special Set
export const ALL_SETS: Record<string, Question[]> = {
  // Paper 1 Sets
  s1p1: SET1_PAPER1_QUESTIONS,
  s2p1: SET2_PAPER1_QUESTIONS,
  s3p1: SET3_PAPER1_QUESTIONS,
  s4p1: SET4_PAPER1_QUESTIONS,
  s5p1: SET5_PAPER1_QUESTIONS,
  s6p1: SET6_PAPER1_QUESTIONS,
  s7p1: FRESH_PAPER1_QUESTIONS,

  // Paper 2 Sets (Computer Science / System)
  s1p2: SET1_PAPER2_QUESTIONS,
  s2p2: SET2_PAPER2_QUESTIONS,
  s3p2: SET3_PAPER2_QUESTIONS,
  s4p2: SET4_PAPER2_QUESTIONS,
  s5p2: SET5_PAPER2_QUESTIONS,
  s6p2: SET6_PAPER2_QUESTIONS,
  s7p2: SET7_PAPER2_QUESTIONS,

  // Special Topic Tests
  cil_subsidiaries: CIL_SUBSIDIARIES_SPECIAL_SET,
  subsidiaries: CIL_SUBSIDIARIES_SPECIAL_SET,
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
export function getQuestionsForSet(set: number | string, paper?: "p1" | "p2"): Question[] {
  if (typeof set === "string" && (set === "cil_subsidiaries" || set === "subsidiaries")) {
    return ALL_SETS[set] || CIL_SUBSIDIARIES_SPECIAL_SET;
  }
  const key = paper ? `s${set}${paper}` : `${set}`;
  return ALL_SETS[key] || (paper === "p2" ? SET1_PAPER2_QUESTIONS : FRESH_PAPER1_QUESTIONS);
}

