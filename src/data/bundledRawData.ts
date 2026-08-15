import { Question } from "../types";
import { FRESH_PAPER1_QUESTIONS } from "./researchData";

// Embed the pre-validated question sets from the official CIL MT mock test repository
// Each set contains 100 questions per paper (General Aptitude for Paper I, Computer Science for Paper II)
import { ALL_SETS, registerDynamicSet } from "./allSetsData";

// Attach the bundled initial dataset
export function initializeBundledSets() {
  ALL_SETS["s7p1"] = FRESH_PAPER1_QUESTIONS;
  ALL_SETS["s6p1"] = FRESH_PAPER1_QUESTIONS; // Set 6 is also powered by the fresh research set
}
