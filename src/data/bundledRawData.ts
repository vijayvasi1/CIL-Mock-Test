import { IMPORTED_QUESTION_SETS } from "./importedQuestionSets";
import { FRESH_PAPER1_QUESTIONS } from "./researchData";

// Embed the pre-validated question sets from the official CIL MT mock test repository
// Each set contains 100 questions per paper (General Aptitude for Paper I, Computer Science for Paper II)
import { ALL_SETS } from "./allSetsData";

// Attach the bundled initial dataset
export function initializeBundledSets() {
  Object.assign(ALL_SETS, IMPORTED_QUESTION_SETS);
  ALL_SETS["s7p1"] = FRESH_PAPER1_QUESTIONS;
}
