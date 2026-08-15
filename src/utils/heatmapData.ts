import { CategoryHeatmapItem } from "../types";

export interface CategoryDefinition {
  name: string;
  paper: "Paper I" | "Paper II";
  keywords: string[];
  benchmarkWeight: number; // typical marks in CIL MT
}

export const CIL_SUBJECT_CATEGORIES: CategoryDefinition[] = [
  // Paper I
  {
    name: "Coal India & PSU Energy Policies",
    paper: "Paper I",
    keywords: ["coal", "cil", "maharatna", "subsidiary", "gasification", "coking", "singrauli", "dhanbad", "e-auction", "fsa", "cbm", "wcl", "secl", "mcl", "ecl", "bccnl", "ncl", "cmpdil"],
    benchmarkWeight: 8,
  },
  {
    name: "Indian Polity & Constitution",
    paper: "Paper I",
    keywords: ["article", "amendment", "constitution", "parliament", "president", "fundamental rights", "supreme court", "governor", "lok sabha", "rajya sabha", "directive principles"],
    benchmarkWeight: 7,
  },
  {
    name: "Indian Economy & Current Affairs",
    paper: "Paper I",
    keywords: ["rbi", "budget", "gdp", "inflation", "monetary", "repo", "niti aayog", "fiscal", "schemes", "summit", "awards", "ranking"],
    benchmarkWeight: 10,
  },
  {
    name: "General Science & Technology",
    paper: "Paper I",
    keywords: ["physics", "chemistry", "biology", "isro", "satellite", "energy", "vitamin", "disease", "greenhouse", "solar", "semiconductor"],
    benchmarkWeight: 5,
  },
  {
    name: "Logical & Deductive Reasoning",
    paper: "Paper I",
    keywords: ["syllogism", "conclusion", "statement", "assumption", "coding", "decoding", "blood relation", "series", "analogy", "logic"],
    benchmarkWeight: 15,
  },
  {
    name: "Analytical & Direction Reasoning",
    paper: "Paper I",
    keywords: ["direction", "distance", "seating", "arrangement", "ranking", "order", "venn", "puzzle", "cube", "dice"],
    benchmarkWeight: 10,
  },
  {
    name: "Numerical Ability & Arithmetic",
    paper: "Paper I",
    keywords: ["time and work", "speed", "distance", "train", "profit", "loss", "percentage", "ratio", "proportion", "simple interest", "compound interest", "average", "mixture"],
    benchmarkWeight: 15,
  },
  {
    name: "Data Interpretation & Number Systems",
    paper: "Paper I",
    keywords: ["table", "bar chart", "pie chart", "di", "graph", "data interpretation", "hcf", "lcm", "simplification", "algebra"],
    benchmarkWeight: 10,
  },
  {
    name: "English Grammar & Error Spotting",
    paper: "Paper I",
    keywords: ["grammar", "error", "preposition", "tense", "active", "passive", "voice", "speech", "direct", "indirect", "subject-verb", "sentence correction"],
    benchmarkWeight: 10,
  },
  {
    name: "Vocabulary, Idioms & Comprehension",
    paper: "Paper I",
    keywords: ["synonym", "antonym", "idiom", "phrase", "cloze", "one word", "passage", "comprehension", "spelling"],
    benchmarkWeight: 10,
  },

  // Paper II
  {
    name: "Operating Systems & Concurrency",
    paper: "Paper II",
    keywords: ["os", "operating system", "process", "thread", "deadlock", "scheduling", "banker", "paging", "virtual memory", "semaphore", "mutex", "fork", "page fault", "thrashing"],
    benchmarkWeight: 15,
  },
  {
    name: "DBMS & SQL Normalization",
    paper: "Paper II",
    keywords: ["dbms", "sql", "normalization", "1nf", "2nf", "3nf", "bcnf", "acid", "transaction", "b+ tree", "indexing", "foreign key", "relational algebra", "join"],
    benchmarkWeight: 15,
  },
  {
    name: "Computer Networks & Protocols",
    paper: "Paper II",
    keywords: ["network", "tcp", "ip", "udp", "osi", "subnet", "cidr", "routing", "dijkstra", "bellman", "dns", "http", "https", "arp", "sliding window"],
    benchmarkWeight: 15,
  },
  {
    name: "Data Structures & Algorithms",
    paper: "Paper II",
    keywords: ["data structure", "tree", "bst", "avl", "graph", "dijkstra", "bfs", "dfs", "stack", "queue", "linked list", "sorting", "quicksort", "mergesort", "heap", "dynamic programming", "big-o", "complexity"],
    benchmarkWeight: 20,
  },
  {
    name: "Software Engineering & OOP",
    paper: "Paper II",
    keywords: ["software", "sdlc", "agile", "scrum", "waterfall", "testing", "black box", "white box", "cyclomatic", "oop", "inheritance", "polymorphism", "encapsulation", "design pattern", "solid"],
    benchmarkWeight: 10,
  },
  {
    name: "Web Tech, Cloud & Microservices",
    paper: "Paper II",
    keywords: ["web", "html", "css", "javascript", "rest", "api", "json", "microservice", "cloud", "iaas", "paas", "saas", "docker", "kubernetes"],
    benchmarkWeight: 10,
  },
  {
    name: "Computer Organization & Digital Logic",
    paper: "Paper II",
    keywords: ["architecture", "pipeline", "cache", "hazard", "mips", "instruction", "digital", "logic", "k-map", "multiplexer", "flip flop", "boolean", "adder"],
    benchmarkWeight: 8,
  },
  {
    name: "Information Security & Cryptography",
    paper: "Paper II",
    keywords: ["security", "crypto", "encryption", "rsa", "aes", "des", "hash", "sha", "md5", "digital signature", "firewall", "dos", "phishing", "ssl", "tls"],
    benchmarkWeight: 7,
  },
];

export function mapQuestionToCategory(
  questionText: string,
  sectionText: string,
  paper: "Paper I" | "Paper II"
): string {
  const combined = (questionText + " " + sectionText).toLowerCase();

  const candidates = CIL_SUBJECT_CATEGORIES.filter((c) => c.paper === paper);

  let bestMatch = candidates[0].name;
  let maxMatches = 0;

  for (const cat of candidates) {
    let score = 0;
    for (const kw of cat.keywords) {
      if (combined.includes(kw)) {
        score += 1;
      }
    }
    if (score > maxMatches) {
      maxMatches = score;
      bestMatch = cat.name;
    }
  }

  // Fallback if no specific keyword matched
  if (maxMatches === 0) {
    if (paper === "Paper I") {
      if (combined.includes("math") || combined.includes("number") || combined.includes("find")) {
        return "Numerical Ability & Arithmetic";
      }
      if (combined.includes("word") || combined.includes("sentence") || combined.includes("meaning")) {
        return "English Grammar & Error Spotting";
      }
      return "General Science & Technology";
    } else {
      if (combined.includes("code") || combined.includes("array") || combined.includes("sort")) {
        return "Data Structures & Algorithms";
      }
      return "Operating Systems & Concurrency";
    }
  }

  return bestMatch;
}

export function computeCategoryHeatmap(attemptHistory: any[]): CategoryHeatmapItem[] {
  // Initialize accumulator map for all defined categories
  const catMap = new Map<string, CategoryHeatmapItem>();

  CIL_SUBJECT_CATEGORIES.forEach((cat) => {
    catMap.set(cat.name, {
      category: cat.name,
      paper: cat.paper,
      totalAttempts: 0,
      correctAttempts: 0,
      wrongAttempts: 0,
      accuracy: 0,
      hardQuestionsAttempted: 0,
      hardQuestionsFailed: 0,
      statusTier: "moderate",
    });
  });

  // Populate from attempt logs
  attemptHistory.forEach((attempt) => {
    const isP2 =
      (attempt.paper && attempt.paper.includes("II")) ||
      (attempt.paper && attempt.paper.toLowerCase().includes("paper 2")) ||
      (attempt.paper && attempt.paper.toLowerCase().includes("cs"));
    const paper: "Paper I" | "Paper II" = isP2 ? "Paper II" : "Paper I";

    const matchedCat = mapQuestionToCategory(
      attempt.questionText || "",
      attempt.section || "",
      paper
    );

    const item = catMap.get(matchedCat) || {
      category: matchedCat,
      paper,
      totalAttempts: 0,
      correctAttempts: 0,
      wrongAttempts: 0,
      accuracy: 0,
      hardQuestionsAttempted: 0,
      hardQuestionsFailed: 0,
      statusTier: "moderate",
    };

    item.totalAttempts += 1;
    if (attempt.isCorrect) {
      item.correctAttempts += 1;
    } else {
      item.wrongAttempts += 1;
    }

    const isHard =
      attempt.difficulty === "Hard" ||
      (attempt.attemptsCountOnQuestion && attempt.attemptsCountOnQuestion > 2);
    if (isHard) {
      item.hardQuestionsAttempted += 1;
      if (!attempt.isCorrect) {
        item.hardQuestionsFailed += 1;
      }
    }

    if (attempt.timestamp) {
      item.lastTested = attempt.timestamp;
    }

    catMap.set(matchedCat, item);
  });

  // Calculate percentages and status tiers
  const results: CategoryHeatmapItem[] = [];

  catMap.forEach((item) => {
    if (item.totalAttempts > 0) {
      item.accuracy = Math.round((item.correctAttempts / item.totalAttempts) * 100);

      // Status tier calculation
      if (item.accuracy < 45 || (item.hardQuestionsFailed >= 3 && item.accuracy < 60)) {
        item.statusTier = "critical";
      } else if (item.accuracy < 65) {
        item.statusTier = "warning";
      } else if (item.accuracy < 80) {
        item.statusTier = "moderate";
      } else {
        item.statusTier = "mastered";
      }
    } else {
      // Default baseline for unattempted topics
      item.accuracy = 0;
      item.statusTier = "moderate";
    }
    results.push(item);
  });

  return results;
}
