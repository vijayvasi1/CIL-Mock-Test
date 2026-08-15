export interface BankQuestion {
  section: string;
  q: string;
  opts: string[];
  ans: number;
  exp: string;
}

export const PAPER1_BANK: BankQuestion[] = [
  // General Awareness - Coal Sector & CIL
  {
    section: "General Awareness",
    q: "Under which Ministry does Coal India Limited (CIL) operate as a Maharatna Central Public Sector Enterprise (CPSE)?",
    opts: ["Ministry of Mines", "Ministry of Coal", "Ministry of Power", "Ministry of Heavy Industries"],
    ans: 1,
    exp: "Why: CIL is the single largest coal producer in the world and functions under the administrative control of the Ministry of Coal, Government of India. What: It was established in November 1975 and conferred Maharatna status in April 2011. Where: Headquartered in Kolkata, West Bengal."
  },
  {
    section: "General Awareness",
    q: "Which subsidiary of Coal India Limited (CIL) is dedicated exclusively to mine planning, exploration, and technical consultancy?",
    opts: ["Eastern Coalfields Limited (ECL)", "Central Mine Planning & Design Institute (CMPDI)", "South Eastern Coalfields Limited (SECL)", "Northern Coalfields Limited (NCL)"],
    ans: 1,
    exp: "Why: CMPDI (Central Mine Planning & Design Institute) is the premier planning and engineering consultancy subsidiary of CIL. What: It handles geotechnical investigations, environmental management, GIS mapping, and mine planning. Where: Headquartered in Ranchi, Jharkhand."
  },
  {
    section: "General Awareness",
    q: "What is the primary objective of CIL's First Mile Connectivity (FMC) projects under the Coal Logistics Plan?",
    opts: [
      "Replacing road transport of coal with automated mechanized conveyor belts and rapid loading silos to reduce dust and emissions",
      "Expanding cross-border coal exports to Southeast Asia",
      "Increasing manual opencast shovel loading operations",
      "Setting up residential coal worker colonies"
    ],
    ans: 0,
    exp: "Why: FMC (First Mile Connectivity) eliminates road transportation of coal from pitheads to railway sidings. What: Coal is transported seamlessly via covered conveyor belts and loaded into railway wagons via Rapid Loading Systems (RLS), slashing diesel emissions, traffic congestion, and ambient particulate pollution."
  },
  {
    section: "General Awareness",
    q: "Which variety of coal possesses the highest carbon content (85–95%) and calorific value, but is available in limited reserves in India (chiefly Jammu & Kashmir)?",
    opts: ["Peat", "Lignite", "Bituminous", "Anthracite"],
    ans: 3,
    exp: "Why: Anthracite is the highest metamorphic grade of coal with >85% fixed carbon and low volatile matter. What: India's domestic reserves consist predominantly of non-coking Bituminous coal (Gondwana formation, ~98%), while Tertiary coal (Lignite) is majorly in Tamil Nadu (Neyveli)."
  },
  {
    section: "General Awareness",
    q: "Which portal was launched by the Ministry of Coal to promote transparency in commercial coal block auctions and regulatory clearances?",
    opts: ["Single Window Clearance System (SWCS) / Parivesh", "Koyla Darpan", "Koyla Shakti", "All of the above"],
    ans: 3,
    exp: "Why: Ministry of Coal launched the Unified Single Window Clearance portal along with digital monitoring dashboards like Koyla Darpan and CLAMP to streamline mining lease approvals, forest clearances, and production tracking."
  },
  // General Awareness - Indian Polity & Constitution
  {
    section: "General Awareness",
    q: "Which Article of the Constitution of India provides the Right to Constitutional Remedies, referred to by Dr. B.R. Ambedkar as the 'Heart and Soul' of the Constitution?",
    opts: ["Article 19", "Article 21", "Article 32", "Article 44"],
    ans: 2,
    exp: "Why: Article 32 empowers citizens to directly petition the Supreme Court of India through prerogative writs (Habeas Corpus, Mandamus, Prohibition, Quo-Warranto, Certiorari) for enforcement of Fundamental Rights."
  },
  {
    section: "General Awareness",
    q: "The concept of 'Directive Principles of State Policy' (DPSP) in Part IV of the Indian Constitution was borrowed from which country's constitution?",
    opts: ["Ireland (Irish Constitution)", "United States", "USSR (Soviet Union)", "Australia"],
    ans: 0,
    exp: "Why: DPSPs (Articles 36 to 51) were adopted from the 1937 Constitution of Ireland. What: DPSPs are non-justiciable guidelines aimed at establishing a socio-economic welfare state in India."
  },
  {
    section: "General Awareness",
    q: "Which Constitutional Amendment Act lowered the voting age for Lok Sabha and State Legislative Assembly elections from 21 to 18 years?",
    opts: ["42nd Amendment Act (1976)", "44th Amendment Act (1978)", "61st Amendment Act (1988)", "73rd Amendment Act (1992)"],
    ans: 2,
    exp: "Why: The 61st Constitutional Amendment Act, 1988 amended Article 326 of the Constitution, formally reducing the minimum voting age from 21 years to 18 years (effective from March 28, 1989)."
  },
  // General Awareness - Economy & Science
  {
    section: "General Awareness",
    q: "What is the statutory objective of the Monetary Policy Committee (MPC) constituted under Section 45ZB of the Reserve Bank of India (RBI) Act?",
    opts: [
      "Fixing corporate income tax rates",
      "Maintaining consumer price index (CPI) inflation target of 4% with a tolerance band of +/- 2%",
      "Regulating foreign direct investment caps",
      "Managing stock exchange listings on NSE/BSE"
    ],
    ans: 1,
    exp: "Why: The 6-member MPC sets the policy Repo Rate to anchor CPI headline inflation at 4% (within the statutory 2%–6% tolerance corridor) while supporting economic growth."
  },
  {
    section: "General Awareness",
    q: "Which greenhouse gas is emitted during coal mining operations (Coalbed Methane) with a Global Warming Potential (GWP) ~28–36 times greater than CO2 over 100 years?",
    opts: ["Sulfur Dioxide (SO2)", "Methane (CH4)", "Nitrous Oxide (N2O)", "Ozone (O3)"],
    ans: 1,
    exp: "Why: Methane (CH4) is trapped inside coal seams during coalification. When coal is extracted, Coal Mine Methane (CMM) is released. CIL actively develops CBM/CMM extraction projects to mitigate atmospheric warming."
  },
  // Reasoning Ability
  {
    section: "Reasoning Ability",
    q: "Find the missing number in the sequence: 4, 18, 48, 100, 180, ?",
    opts: ["294", "256", "312", "275"],
    ans: 0,
    exp: "Why: The pattern is n^3 - n^2 (or n^2 * (n-1)) for n = 2, 3, 4, 5, 6, 7. For n=2: 8 - 4 = 4; n=3: 27 - 9 = 18; n=4: 64 - 16 = 48; n=5: 125 - 25 = 100; n=6: 216 - 36 = 180; n=7: 343 - 49 = 294."
  },
  {
    section: "Reasoning Ability",
    q: "In a certain code language, 'SYSTEM' is coded as 'SYSMET' and 'COAL' is coded as 'COLAA'. How is 'MINING' coded in that language?",
    opts: ["MINIGN", "MIGNIN", "GNINIM", "MINNGI"],
    ans: 0,
    exp: "Why: In 'SYSTEM' (6 letters), the first 3 letters 'SYS' remain unchanged, and the last 3 letters 'TEM' are reversed to 'MET'. Similarly, for 'MINING' (6 letters), the first 3 letters 'MIN' remain unchanged, and 'ING' is reversed to 'GNI' giving 'MINGNI' or swapped last pair 'MINIGN'."
  },
  {
    section: "Reasoning Ability",
    q: "Pointing to a photograph of a man, Sunita said, 'His mother is the only daughter of my mother.' How is Sunita related to the man in the photograph?",
    opts: ["Sister", "Mother", "Aunt", "Daughter"],
    ans: 1,
    exp: "Why: 'Only daughter of my mother' = Sunita herself (since Sunita is female). Therefore, 'His mother is Sunita'. Thus, Sunita is the mother of the man in the photograph."
  },
  {
    section: "Reasoning Ability",
    q: "A surveyor walks 20 meters North from a mine pit, turns right and walks 30 meters, turns right again and walks 20 meters, and finally turns left and walks 15 meters. How far and in which direction is he from the starting pit?",
    opts: ["45 meters East", "35 meters East", "50 meters North-East", "15 meters West"],
    ans: 0,
    exp: "Why: North 20m (+y=20), Right/East 30m (+x=30), Right/South 20m (y=0, x=30), Left/East 15m (x=30+15=45m). Final position is (45, 0), which is exactly 45 meters due East."
  },
  {
    section: "Reasoning Ability",
    q: "Statements: All Miners are Technicians. Some Technicians are Engineers. Conclusions: I. Some Miners are Engineers. II. Some Technicians are Miners.",
    opts: ["Only Conclusion I follows", "Only Conclusion II follows", "Both I and II follow", "Neither I nor II follows"],
    ans: 1,
    exp: "Why: Since 'All Miners are Technicians' (A-type proposition), its valid conversion is 'Some Technicians are Miners' (I-type). Hence Conclusion II strictly follows. There is no direct affirmative link between Miners and Engineers, so I is merely a possibility, not a definite conclusion."
  },
  // Numerical Ability
  {
    section: "Numerical Ability",
    q: "A coal washing plant increases its hourly throughput by 20% and then due to automated optimization increases it further by 25%. What is the net percentage increase in total throughput?",
    opts: ["45%", "50%", "52%", "48%"],
    ans: 1,
    exp: "Why: Using the successive percentage formula: A + B + (A * B) / 100 = 20 + 25 + (20 * 25) / 100 = 45 + 5 = 50% net increase."
  },
  {
    section: "Numerical Ability",
    q: "A freight train 400 meters long traveling at a speed of 72 km/h crosses a coal loading terminal platform in 35 seconds. What is the length of the platform?",
    opts: ["300 meters", "350 meters", "250 meters", "450 meters"],
    ans: 0,
    exp: "Why: Speed = 72 * (5/18) = 20 m/s. Total distance covered in 35s = Speed * Time = 20 * 35 = 700 meters. Total Distance = Train Length (400m) + Platform Length (P) => P = 700 - 400 = 300 meters."
  },
  {
    section: "Numerical Ability",
    q: "Pipe A can fill an industrial cooling reservoir in 12 hours, while Pipe B can fill it in 18 hours. If both pipes are opened simultaneously, how much time will they take to fill the reservoir completely?",
    opts: ["7.2 hours (7 hours 12 minutes)", "6.5 hours", "8.0 hours", "5.4 hours"],
    ans: 0,
    exp: "Why: Combined rate = (1/12) + (1/18) = (3 + 2)/36 = 5/36 per hour. Time required = 36 / 5 = 7.2 hours = 7 hours and 12 minutes."
  },
  {
    section: "Numerical Ability",
    q: "The difference between Compound Interest and Simple Interest on a principal sum of ₹15,000 for 2 years at an annual interest rate of 10% is:",
    opts: ["₹120", "₹150", "₹180", "₹200"],
    ans: 1,
    exp: "Why: For 2 years, Difference = P * (R / 100)^2 = 15,000 * (10 / 100)^2 = 15,000 * (1/100) = ₹150."
  },
  // General English
  {
    section: "General English",
    q: "Select the sentence with correct Subject-Verb Agreement:",
    opts: [
      "The quality of the extracted coal samples are checked every morning.",
      "The quality of the extracted coal samples is checked every morning.",
      "The quality of the extracted coal samples were checked every morning.",
      "The quality of the extracted coal samples have been checked every morning."
    ],
    ans: 1,
    exp: "Why: The true grammatical head noun is the singular subject 'The quality'. The prepositional phrase 'of the extracted coal samples' does not affect the verb number. Therefore, the singular verb 'is' is grammatically correct."
  },
  {
    section: "General English",
    q: "Choose the correct indirect speech: The safety officer said, 'Wear your helmets before entering the underground mine.'",
    opts: [
      "The safety officer asked to wear helmets before entering the underground mine.",
      "The safety officer ordered the workers to wear their helmets before entering the underground mine.",
      "The safety officer said that they should wear their helmets before entering.",
      "The safety officer commanded that helmets are worn."
    ],
    ans: 1,
    exp: "Why: Imperative sentences with an official instruction/order are converted using the reporting verb 'ordered/instructed' followed by the object and 'to + base verb' ('to wear their helmets')."
  },
  {
    section: "General English",
    q: "Choose the exact antonym of the word 'CANDID':",
    opts: ["Honest", "Deceitful", "Outspoken", "Forthright"],
    ans: 1,
    exp: "Why: 'Candid' means truthful, frank, straightforward. Its direct antonym is 'Deceitful' (or evasive, secretive, disingenuous)."
  },
  {
    section: "General English",
    q: "Select the one-word substitution: 'An official agreement between countries or organizations that ends an argument or dispute.'",
    opts: ["Treaty", "Protocol", "Pact", "Accord"],
    ans: 0,
    exp: "Why: A 'Treaty' is a formally ratified agreement between states. An 'Accord' or 'Pact' is also a formal agreement, but 'Treaty' is the standard international legal term."
  }
];

export const PAPER2_BANK: BankQuestion[] = [
  // DBMS
  {
    section: "Database Management Systems (DBMS)",
    q: "Which Normal Form strictly prohibits Transitive Functional Dependencies (where non-prime attribute determines another non-prime attribute)?",
    opts: ["First Normal Form (1NF)", "Second Normal Form (2NF)", "Third Normal Form (3NF)", "Boyce-Codd Normal Form (BCNF)"],
    ans: 2,
    exp: "Why: 3NF requires that the relation is in 2NF and every non-prime attribute is non-transitively dependent on the primary key (i.e. For X -> A, either X is a superkey or A is a prime attribute)."
  },
  {
    section: "Database Management Systems (DBMS)",
    q: "In database transaction management, which ACID property ensures that all operations in a transaction are executed completely or none at all (All-or-Nothing)?",
    opts: ["Atomicity", "Consistency", "Isolation", "Durability"],
    ans: 0,
    exp: "Why: Atomicity guarantees that if a transaction fails halfway through, the database rolls back all partial modifications using undo logs. Durability guarantees persistence after commit."
  },
  {
    section: "Database Management Systems (DBMS)",
    q: "Why are B+ Trees predominantly preferred over standard Binary Search Trees (BST) or B-Trees for database index structures on disk storage?",
    opts: [
      "B+ Trees store all actual record data pointers in leaf nodes linked sequentially, optimizing range queries and maximizing disk block fanout",
      "B+ Trees consume zero memory overhead",
      "B+ Trees do not require rebalancing during insertions",
      "B+ Trees only allow binary splits"
    ],
    ans: 0,
    exp: "Why: In B+ Trees, internal nodes only store routing keys (maximizing fanout and minimizing I/O depth), while leaf nodes store all data pointers and are connected via a doubly linked list for fast range scanning (ORDER BY, BETWEEN)."
  },
  // Operating Systems
  {
    section: "Operating Systems",
    q: "Which algorithm is used by the operating system for Deadlock Avoidance by determining if resource allocation keeps the system in a 'Safe State'?",
    opts: ["Dijkstra's Banker's Algorithm", "Round Robin Scheduling Algorithm", "Peterson's Algorithm", "Kruskal's Algorithm"],
    ans: 0,
    exp: "Why: Banker's algorithm tests whether allocating requested resources allows finding at least one valid execution sequence (Safe Sequence) where every process can satisfy its Max Need without deadlocking."
  },
  {
    section: "Operating Systems",
    q: "What phenomenon occurs in First-In-First-Out (FIFO) page replacement where increasing the number of allocated physical page frames paradoxically increases page faults?",
    opts: ["Thrashing", "Belady's Anomaly", "Priority Inversion", "Starvation"],
    ans: 1,
    exp: "Why: Belady's Anomaly demonstrates that FIFO does not satisfy the stack property of page replacement (unlike LRU or Optimal), leading to cases where more memory frames produce more page faults."
  },
  {
    section: "Operating Systems",
    q: "In process synchronization, how does a counting semaphore with an initial value of 5 behave after executing 3 wait() (P) operations and 1 signal() (V) operation?",
    opts: ["Value becomes 3", "Value becomes 2", "Value becomes 1", "Value becomes 4"],
    ans: 0,
    exp: "Why: Initial value = 5. Three wait() operations decrement the semaphore: 5 - 3 = 2. One signal() operation increments it: 2 + 1 = 3."
  },
  // Computer Networks
  {
    section: "Computer Networks",
    q: "Which protocol operates at the Internet/Network layer to dynamically map a known 32-bit Logical IPv4 address to a 48-bit Physical MAC address?",
    opts: ["ARP (Address Resolution Protocol)", "RARP", "DHCP", "DNS"],
    ans: 0,
    exp: "Why: ARP broadcasts an ARP Request query onto the local Ethernet segment asking 'Who has IP X? Send your MAC address'. The target machine replies with a unicast ARP Reply containing its MAC address."
  },
  {
    section: "Computer Networks",
    q: "What is the total number of usable host IP addresses available in a Class C subnet configured with a /26 CIDR mask (255.255.255.192)?",
    opts: ["64", "62", "30", "126"],
    ans: 1,
    exp: "Why: A /26 mask leaves (32 - 26) = 6 host bits. Total addresses = 2^6 = 64. Usable host addresses = 2^h - 2 = 64 - 2 (subtracting Network ID and Directed Broadcast Address) = 62 usable host IPs."
  },
  {
    section: "Computer Networks",
    q: "What standard TCP port number is utilized by HTTPS (HTTP over TLS/SSL) for encrypted end-to-end web communication?",
    opts: ["Port 80", "Port 443", "Port 8080", "Port 22"],
    ans: 1,
    exp: "Why: HTTP uses plaintext port 80; HTTPS uses TLS/SSL encrypted port 443; SSH uses port 22; DNS uses port 53."
  },
  // Data Structures & Algorithms
  {
    section: "Data Structures & Algorithms",
    q: "What is the worst-case time complexity of QuickSort when the pivot element selected is consistently the minimum or maximum element of an already sorted array?",
    opts: ["O(N log N)", "O(N^2)", "O(N)", "O(log N)"],
    ans: 1,
    exp: "Why: When unbalanced partitions occur (subproblem sizes N-1 and 0), the recurrence relation becomes T(N) = T(N-1) + O(N), resolving to O(N^2). Randomized pivoting or median-of-three solves this."
  },
  {
    section: "Data Structures & Algorithms",
    q: "Which algorithmic paradigm does Dijkstra's Single-Source Shortest Path algorithm on a directed graph with non-negative edge weights employ?",
    opts: ["Greedy Approach", "Dynamic Programming", "Divide and Conquer", "Backtracking"],
    ans: 0,
    exp: "Why: Dijkstra's algorithm uses a greedy strategy by always extracting the unvisited vertex with the minimum tentative distance from the min-priority queue (Binary Heap / Fibonacci Heap)."
  },
  {
    section: "Data Structures & Algorithms",
    q: "What is the maximum allowed balance factor (height(left) - height(right)) for any node in a valid AVL self-balancing binary search tree?",
    opts: ["{-1, 0, +1}", "{-2, 0, +2}", "{0 only}", "{-1, +1 only}"],
    ans: 0,
    exp: "Why: In an AVL tree, the balance factor of every node must be strictly in the set {-1, 0, +1}. If an insertion causes a balance factor of +2 or -2, rotations (LL, RR, LR, RL) restore balance."
  },
  // Theory of Computation & Compilers
  {
    section: "Theory of Computation & Compilers",
    q: "Which formal machine model corresponds to Context-Free Languages (Type-2 in the Chomsky Hierarchy)?",
    opts: ["Deterministic Finite Automaton (DFA)", "Pushdown Automaton (PDA)", "Linear Bounded Automaton (LBA)", "Turing Machine"],
    ans: 1,
    exp: "Why: Chomsky Hierarchy: Type 3 (Regular) = Finite Automata; Type 2 (Context-Free) = Pushdown Automata (with a single LIFO stack); Type 1 (Context-Sensitive) = LBA; Type 0 (Recursively Enumerable) = Turing Machine."
  },
  {
    section: "Theory of Computation & Compilers",
    q: "In compiler construction, which phase is responsible for grouping characters of the source program into meaningful sequences called Tokens?",
    opts: ["Lexical Analysis (Scanner)", "Syntax Analysis (Parser)", "Semantic Analysis", "Code Optimization"],
    ans: 0,
    exp: "Why: The Lexical Analyzer (Scanner / Lex / Flex) converts a raw stream of source characters into tokens (identifiers, keywords, literals, operators) using regular expressions and finite state automata."
  },
  // Computer Organization & Architecture
  {
    section: "Computer Organization & Architecture",
    q: "Which CPU register holds the memory address of the next machine instruction to be fetched and executed?",
    opts: ["Instruction Register (IR)", "Program Counter (PC)", "Memory Address Register (MAR)", "Accumulator (AC)"],
    ans: 1,
    exp: "Why: The Program Counter (PC) stores the pointer/address of the next instruction in sequence and is automatically incremented during the instruction fetch cycle."
  },
  {
    section: "Computer Organization & Architecture",
    q: "Which combination of logic gates is classified as 'Universal Gates' because any Boolean logic circuit can be synthesized exclusively using them?",
    opts: ["AND and OR", "NAND and NOR", "XOR and XNOR", "NOT and AND"],
    ans: 1,
    exp: "Why: Both NAND and NOR gates are functionally complete. Any fundamental logic function (NOT, AND, OR, XOR) can be constructed solely using NAND or solely using NOR networks."
  }
];

export function getCuratedQuestions(
  paper: "p1" | "p2" = "p1",
  section?: string,
  count: number = 25
): BankQuestion[] {
  let pool = paper === "p1" ? [...PAPER1_BANK] : [...PAPER2_BANK];

  if (section && section !== "all") {
    const filtered = pool.filter((q) => q.section.toLowerCase().includes(section.toLowerCase()));
    if (filtered.length > 0) {
      pool = filtered;
    }
  }

  // Shuffle pool
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  // If requested count is greater than pool size, cycle and clone with slight index numbering
  const result: BankQuestion[] = [];
  while (result.length < count) {
    for (const q of shuffled) {
      if (result.length >= count) break;
      result.push(q);
    }
  }

  return result.slice(0, count);
}
