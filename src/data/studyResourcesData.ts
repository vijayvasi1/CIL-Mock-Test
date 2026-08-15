import { StudyResourceItem } from "../types";

export const STUDY_RESOURCES: StudyResourceItem[] = [
  {
    id: "cil-syllabus-exam-pattern",
    title: "Official CIL MT Examination Scheme & Syllabus Blueprint",
    category: "Official Syllabus",
    description:
      "Complete official syllabus breakdown for Paper I (General Aptitude - 100 Marks) and Paper II (Computer Science/IT - 100 Marks), including time limits, cutoff criteria, and marking schemes.",
    fileType: "PDF",
    estimatedReadTime: "8 min read",
    offlineAvailable: true,
    keyHighlights: [
      "Paper I: 100 MCQs (General Awareness, Reasoning, Numerical Ability, English) - 100 Marks",
      "Paper II: 100 MCQs (Professional Knowledge / Computer Science discipline) - 100 Marks",
      "Duration: Composite time of 3 Hours (180 Minutes) for both papers in online CBT mode",
      "Marking Scheme: 1 Mark per correct answer. NO negative marking across both papers",
      "Qualifying Cutoffs: Minimum 40% (40 marks) for UR/EWS, 35% for OBC, 30% for SC/ST/PwBD separately in each paper",
    ],
    contentMarkdown: `# Coal India Limited Management Trainee (CBT) Examination Blueprint

## 1. Scheme of Examination
- **Mode of Exam**: Computer-Based Online Test (CBT)
- **Total Duration**: 3 Hours (180 Minutes)
- **Total Marks**: 200 Marks (Paper I: 100 Marks + Paper II: 100 Marks)
- **Medium**: Bilingual (English & Hindi) except English section

## 2. Qualifying Cutoff Marks (Separate Qualifying Required in EACH Paper)
| Category | Minimum Qualifying Marks in Each Paper | Percentage |
| :--- | :--- | :--- |
| General (UR) / EWS | 40 Marks (out of 100) | 40% |
| OBC (Non-Creamy Layer) | 35 Marks (out of 100) | 35% |
| SC / ST / PwBD | 30 Marks (out of 100) | 30% |

## 3. Paper-I: General Aptitude (100 Marks)
1. **General Knowledge / Awareness (25 Marks)**: Indian Economy, Coal Sector & Ministry of Coal policies, Maharatna PSUs, Current Affairs, Science & Technology, Indian Constitution & Polity.
2. **Reasoning Ability (25 Marks)**: Syllogisms, Coding-Decoding, Blood Relations, Seating Arrangement, Direction Sense, Analogies, Data Sufficiency.
3. **Numerical Ability (25 Marks)**: Number Systems, Percentages, Profit & Loss, Ratio & Proportion, Time & Work, Speed-Distance-Time, Simple & Compound Interest, Data Interpretation.
4. **General English (25 Marks)**: Error Spotting, Reading Comprehension, Cloze Test, Synonyms/Antonyms, Para Jumbles, Active/Passive Voice.

## 4. Paper-II: Professional Knowledge — Systems / CS / IT (100 Marks)
- **Algorithms & Data Structures**: Arrays, Stacks, Queues, Linked Lists, Binary Trees, AVL Trees, Graphs, Sorting & Searching, Time/Space Complexity.
- **Operating Systems**: Process Scheduling, Multithreading, Deadlock Handling (Banker's Algorithm), Memory Management, Paging, Virtual Memory.
- **Database Management Systems (DBMS)**: ER Modeling, Relational Algebra, SQL, Normalization (1NF, 2NF, 3NF, BCNF), Transaction Processing, ACID properties, Concurrency Control.
- **Computer Networks**: OSI & TCP/IP Reference Models, IP Addressing & CIDR Subnetting, Routing Protocols (OSPF, BGP), TCP/UDP, DNS, HTTP/HTTPS.
- **Software Engineering & Object-Oriented Concepts**: SDLC Models, Agile, UML Diagrams, Design Patterns, OOP Principles (Inheritance, Polymorphism, Encapsulation).
- **Web Technologies & Information Security**: HTML5/CSS3/JavaScript basics, Symmetric/Asymmetric Cryptography, Firewalls, Web Vulnerabilities (SQLi, XSS).`,
  },
  {
    id: "coal-sector-maharatna-handbook",
    title: "Coal India Limited & Indian Coal Sector Comprehensive Fact Sheet",
    category: "Coal Sector & PSU",
    description:
      "High-yield factual compendium of Coal India Limited, its 8 subsidiary coal companies, Maharatna status, production targets, and Ministry of Coal national initiatives.",
    fileType: "CheatSheet",
    estimatedReadTime: "12 min read",
    offlineAvailable: true,
    keyHighlights: [
      "CIL Headquarters: Coal Bhawan, New Town, Rajarhat, Kolkata, West Bengal",
      "Conferred Maharatna PSU Status in April 2011 (World's largest coal producer)",
      "Operating Subsidiaries: ECL, BCCL, CCL, WCL, SECL, MCL, NCL, and planning wing CMPDIL",
      "Singareni Collieries Company Limited (SCCL) is a joint venture of Telangana Govt (51%) and Govt of India (49%)",
      "Production target: Aiming for 1 Billion Tonnes coal production milestone under Mission CIL",
    ],
    contentMarkdown: `# Coal India Limited (CIL) & National Coal Sector Reference Guide

## 1. Corporate Identity & Governance
- **Establishment**: Incorporated in November 1975 under the Companies Act, 1956.
- **Administrative Ministry**: Ministry of Coal, Government of India.
- **Status**: Awarded **Maharatna Status** by the Government of India in **April 2011**.
- **Headquarters**: Coal Bhawan, Premise No-04 MAR, Plot No-AF-III, Action Area-1A, Newtown, Rajarhat, Kolkata - 700156.

## 2. Wholly Owned Subsidiaries of CIL (8 Key Subsidiaries)
1. **Eastern Coalfields Limited (ECL)**: HQ in Sanctoria, West Bengal. Operates in Raniganj Coalfield (birthplace of coal mining in India, 1774).
2. **Bharat Coking Coal Limited (BCCL)**: HQ in Dhanbad (Koyla Nagar), Jharkhand. Operates in Jharia Coalfield (prime source of coking coal in India).
3. **Central Coalfields Limited (CCL)**: HQ in Ranchi, Jharkhand. Operates in Bokaro, Karanpura, Ramgarh coalfields.
4. **Western Coalfields Limited (WCL)**: HQ in Nagpur, Maharashtra. Operates in Maharashtra & Madhya Pradesh.
5. **South Eastern Coalfields Limited (SECL)**: HQ in Bilaspur, Chhattisgarh. Operates Korba, Raigarh, Mand-Raigarh coalfields (highest coal-producing subsidiary).
6. **Mahanadi Coalfields Limited (MCL)**: HQ in Sambalpur, Odisha. Operates Talcher and Ib Valley coalfields.
7. **Northern Coalfields Limited (NCL)**: HQ in Singrauli, Madhya Pradesh. Operates in Singrauli Coalfield (major mechanized opencast power coal supplier).
8. **Central Mine Planning & Design Institute Limited (CMPDIL)**: HQ in Ranchi, Jharkhand. The premier technical consultancy, mine design, and exploration wing of CIL.

*Note: CIL also operates overseas subsidiary Coal India Africana Limitada (CIAL) in Mozambique.*

## 3. Major Coal Varieties in India
- **Anthracite**: Highest carbon content (80–95%), highest calorific value, found in limited quantities in Jammu & Kashmir.
- **Bituminous**: Carbon content (60–80%), most abundant type in Indian coalfields (Gondwana formation).
- **Lignite**: Brown coal, carbon content (40–55%), major deposits in Neyveli (Tamil Nadu), Rajasthan, Gujarat, managed by NLC India Ltd.
- **Peat**: Earliest stage of coal formation, high moisture (>70%), lowest calorific value.

## 4. Key National Initiatives & Portals
- **National Coal Gasification Mission**: Target to achieve 100 Million Tonnes (MT) coal gasification by 2030.
- **UTTAM App**: Unlocking Transparency by Third Party Assessment of Mined Coal.
- **PRAKASH Portal**: Power Rail Koyla Availability through Supply Harmony for monitoring coal supplies to thermal power plants.
- **Koyla Darpan Portal**: Comprehensive digital dashboard for coal sector indicators.`,
  },
  {
    id: "cs-it-core-revision-sheet",
    title: "Computer Science & IT Core Fast-Revision & Formula Matrix",
    category: "CS & IT Core",
    description:
      "Rapid revision summaries, algorithm complexity tables, deadlock formulas, normal forms, OSI/TCP layer protocols, and SQL interview rules for CIL MT Paper II.",
    fileType: "CheatSheet",
    estimatedReadTime: "15 min read",
    offlineAvailable: true,
    keyHighlights: [
      "DBMS: 1NF (Atomic), 2NF (No partial dependency on candidate key), 3NF (No transitive dependency), BCNF (LHS must be super key)",
      "OS: Banker's Algorithm Need Matrix = Max - Allocation. Deadlock conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait",
      "Networks: IPv4 Subnetting formula (2^(32-prefix) - 2 usable hosts), TCP (Connection-oriented, 3-way handshake) vs UDP",
      "Data Structures: Quicksort Avg O(n log n), Worst O(n^2); Heapsort & Mergesort O(n log n); Binary Search O(log n)",
      "Software Engineering: COCOMO Model Effort = a * (KLOC)^b; Cyclomatic Complexity V(G) = E - N + 2P",
    ],
    contentMarkdown: `# Computer Science Core Revision & Formula Matrix for CIL MT (Systems)

## 1. Operating Systems Quick Review
- **Deadlock Necessary Conditions (Coffman Conditions)**:
  1. Mutual Exclusion
  2. Hold and Wait
  3. No Preemption
  4. Circular Wait
- **Banker's Algorithm Formula**:
  - $\\text{Need}[i][j] = \\text{Max}[i][j] - \\text{Allocation}[i][j]$
  - System is in a **Safe State** if there exists at least one safe execution sequence where every process can obtain required resources.
- **Page Replacement Algorithms**:
  - **FIFO**: Experiences **Belady's Anomaly** (page faults can increase with more allocated frames).
  - **LRU (Least Recently Used)**: Stack-based, never suffers from Belady's Anomaly.
  - **Optimal (OPT/MIN)**: Replaces page that will not be used for longest time (theoretical benchmark).
- **Disk Scheduling**: FCFS, SSTF (Shortest Seek Time First - prone to starvation), SCAN (Elevator algorithm), C-SCAN (Circular SCAN - uniform wait time), LOOK, C-LOOK.

## 2. Database Management Systems (DBMS)
- **Relational Normalization Rules**:
  - **1NF**: Attribute values must be atomic (no multi-valued or composite attributes).
  - **2NF**: In 1NF and no non-prime attribute is partially dependent on any candidate key ($X \\to Y$ where $X$ is proper subset of candidate key is forbidden).
  - **3NF**: In 2NF and for every functional dependency $X \\to Y$, either $X$ is a superkey OR $Y$ is a prime attribute (No transitive dependencies).
  - **BCNF (Boyce-Codd Normal Form)**: For every non-trivial $X \\to Y$, $X$ **must strictly be a superkey**.
- **ACID Properties**:
  - **Atomicity**: All-or-nothing (managed by Recovery Manager / Log).
  - **Consistency**: Preserves database integrity constraints.
  - **Isolation**: Serializability (managed by Concurrency Control / 2-Phase Locking).
  - **Durability**: Committed changes persist across crashes (WAL - Write-Ahead Logging).

## 3. Computer Networks Cheat Sheet
- **OSI 7-Layer vs TCP/IP 4-Layer Mapping**:
  - **Application (Layer 7)**: HTTP (80), HTTPS (443), DNS (53), SMTP (25), FTP (20/21), SSH (22).
  - **Transport (Layer 4)**: TCP (reliable, flow control with sliding window, congestion control), UDP (unreliable, low latency).
  - **Network (Layer 3)**: IP, ICMP, ARP (resolves IP $\\to$ MAC), RARP, Routing (OSPF, RIP, BGP).
  - **Data Link (Layer 2)**: Framing, MAC addressing, CSMA/CD (Ethernet), CSMA/CA (Wi-Fi), Error detection (CRC).
  - **Physical (Layer 1)**: Bits, signals, Manchester encoding, cables, hubs, repeaters.
- **Subnetting Formulae**:
  - Number of subnets $= 2^{\\text{borrowed bits}}$
  - Total addresses per subnet $= 2^{(32 - \\text{prefix length})}$
  - Usable host addresses per subnet $= 2^{(32 - \\text{prefix length})} - 2$ (Subtracting Network ID and Broadcast ID).

## 4. Time & Space Complexity Matrix
| Data Structure / Algorithm | Average Time | Worst Time | Worst Space |
| :--- | :--- | :--- | :--- |
| Array Access | $O(1)$ | $O(1)$ | $O(n)$ |
| Stack / Queue Push/Pop | $O(1)$ | $O(1)$ | $O(n)$ |
| Binary Search | $O(\\log n)$ | $O(\\log n)$ | $O(1)$ |
| Binary Search Tree Search | $O(\\log n)$ | $O(n)$ (skewed) | $O(n)$ |
| AVL / Red-Black Tree Search | $O(\\log n)$ | $O(\\log n)$ | $O(n)$ |
| Hash Table Lookup | $O(1)$ | $O(n)$ (collisions) | $O(n)$ |
| Merge Sort | $O(n \\log n)$ | $O(n \\log n)$ | $O(n)$ |
| Quick Sort | $O(n \\log n)$ | $O(n^2)$ | $O(\\log n)$ |
| Heap Sort | $O(n \\log n)$ | $O(n \\log n)$ | $O(1)$ |`,
  },
  {
    id: "quant-aptitude-formula-sheet",
    title: "Quantitative Aptitude & Reasoning Shortcut Formula Handbook",
    category: "Aptitude & Reasoning",
    description:
      "Time-saving tricks, mental math formulas, ratio shortcuts, and reasoning deduction algorithms for scoring 50/50 in Paper I Aptitude and Reasoning sections.",
    fileType: "CheatSheet",
    estimatedReadTime: "10 min read",
    offlineAvailable: true,
    keyHighlights: [
      "Time & Work: If A takes x days and B takes y days, combined time = (xy) / (x + y) days",
      "Relative Speed: Opposite direction = (S1 + S2); Same direction = |S1 - S2|",
      "Compound Interest Shortcut: Difference between CI and SI for 2 years = P * (R / 100)^2",
      "Syllogisms: 'All A are B' + 'All B are C' => 'All A are C'. 'Some' never implies 'All'",
      "Data Interpretation: Percentage increase = [(Final - Initial) / Initial] * 100",
    ],
    contentMarkdown: `# Quantitative Aptitude & Reasoning Formula Handbook for CIL MT

## 1. High-Yield Numerical Ability Formulas
- **Time and Work**:
  - If Person A completes a work in $x$ days and Person B in $y$ days:
    $$\\text{Combined Time} = \\frac{xy}{x + y} \\text{ days}$$
  - **Efficiency Formula**: $\\text{Work} = \\text{Efficiency} \\times \\text{Time}$. If A is $k$ times as efficient as B, time ratio $T_A : T_B = 1 : k$.
- **Speed, Time & Distance**:
  - $\\text{Speed} = \\frac{\\text{Distance}}{\\text{Time}}$
  - Conversion: $1 \\text{ km/h} = \\frac{5}{18} \\text{ m/s}$; $1 \\text{ m/s} = \\frac{18}{5} \\text{ km/h}$.
  - **Average Speed** for equal distances with speeds $u$ and $v$:
    $$\\text{Average Speed} = \\frac{2uv}{u + v}$$
  - **Trains Passing**:
    - Train of length $L_1$ passing a pole/man: $\\text{Time} = \\frac{L_1}{\\text{Speed}}$.
    - Train of length $L_1$ passing a platform of length $L_2$: $\\text{Time} = \\frac{L_1 + L_2}{\\text{Speed}}$.
- **Percentages & Profit/Loss**:
  - $\\text{Gain \\%} = \\frac{\\text{SP} - \\text{CP}}{\\text{CP}} \\times 100$
  - If price increases by $r\\%$, reduction in consumption to keep expenditure same $= \\left(\\frac{r}{100 + r}\\right) \\times 100\\%$.
- **Simple & Compound Interest**:
  - $\\text{SI} = \\frac{P \\times R \\times T}{100}$
  - $\\text{CI} = P \\left(1 + \\frac{R}{100}\\right)^T - P$
  - **Difference between CI and SI for 2 years**:
    $$D_2 = P \\left(\\frac{R}{100}\\right)^2$$
  - **Difference between CI and SI for 3 years**:
    $$D_3 = P \\left(\\frac{R}{100}\\right)^2 \\left(3 + \\frac{R}{100}\\right)$$

## 2. Logical Reasoning Quick Deductions
- **Syllogisms (Standard Logic Rules)**:
  - Universal Affirmative: *All A are B* $\\to$ Valid conversion: *Some B are A*.
  - Universal Negative: *No A is B* $\\to$ Valid conversion: *No B is A*.
  - Particular Affirmative: *Some A are B* $\\to$ Valid conversion: *Some B are A*.
  - Particular Negative: *Some A are not B* $\\to$ No valid conversion.
- **Direction Sense Test**:
  - Right turn from North $\\to$ East
  - Right turn from East $\\to$ South
  - Right turn from South $\\to$ West
  - Right turn from West $\\to$ North
  - Shortest distance between starting point and end point: Use Pythagoras Theorem $d = \\sqrt{\\Delta x^2 + \\Delta y^2}$.`,
  },
  {
    id: "general-english-high-frequency-rules",
    title: "General English Grammar Rules, Idioms & Cloze Test Master Guide",
    category: "General English",
    description:
      "Golden grammar rules (Subject-Verb agreement, Conditionals, Prepositions), 100 high-frequency PSU exam vocabulary words, and Cloze Test elimination strategies.",
    fileType: "Doc",
    estimatedReadTime: "10 min read",
    offlineAvailable: true,
    keyHighlights: [
      "Subject-Verb Agreement: Words joined by 'with', 'as well as', 'along with' take verb agreeing with the first subject",
      "Neither/Nor & Either/Or: Verb agrees with the subject nearest to it",
      "Conditional Clauses: If + Past Perfect (had done) -> would have + V3",
      "Frequently Tested Words: Ephemeral (transient), Ubiquitous (omnipresent), Pragmatic (practical), Mitigate (alleviate)",
      "Spotting Errors: 'Scarcely / Hardly' is followed by 'when', NOT 'than'. 'No sooner' is followed by 'than'",
    ],
    contentMarkdown: `# General English Master Guide for CIL MT Paper I

## 1. Top 10 Golden Rules for Error Spotting
1. **Rule of Along With / As Well As**: When two subjects are connected by *as well as, along with, together with, in addition to, accompanied by*, the verb strictly agrees with the **first subject**.
   - *Example*: The Manager, along with his assistants, **was** (not were) present.
2. **Rule of Either...Or / Neither...Nor**: When two subjects are connected by *either...or, neither...nor, not only...but also*, the verb agrees with the **nearest subject**.
   - *Example*: Neither the Chairman nor the directors **have** arrived.
3. **Correlative Conjunctions**:
   - *No sooner* is always followed by *than* (and inverted verb order: *No sooner did he arrive than...*).
   - *Hardly / Scarcely* is always followed by *when* or *before* (never *than*).
   - *Lest* is followed by *should* or bare subjunctive (never *not* or *will*).
4. **Each / Every / Either / Neither as Pronouns**: Always take a **singular verb** and singular pronoun.
   - *Example*: Each of the coal mining engineers **is** responsible for his safety unit.
5. **Conditional Sentences**:
   - **Type 1 (Probable)**: If + Simple Present $\\to$ will + V1 (*If it rains, we will stop.*)
   - **Type 2 (Improbable)**: If + Simple Past $\\to$ would + V1 (*If I were rich, I would buy.*)
   - **Type 3 (Impossible Past)**: If + Past Perfect (had + V3) $\\to$ would have + V3 (*If he had studied, he would have cleared.*)

## 2. High-Yield PSU Vocabulary & Synonym Reference
- **Affluent**: Wealthy, prosperous (Antonym: Destitute, impoverished)
- **Benign**: Gentle, non-threatening (Antonym: Malignant, hostile)
- **Candid**: Frank, straightforward, honest (Antonym: Deceitful, evasive)
- **Diligent**: Hardworking, conscientious (Antonym: Lethargic, slothful)
- **Exacerbate**: Worsen, aggravate a problem (Antonym: Ameliorate, mitigate)
- **Frugal**: Economical, thrifty (Antonym: Extravagant, profligate)
- **Lucid**: Clear, easily understandable (Antonym: Obscure, ambiguous)
- **Resilient**: Able to recover quickly from difficulties (Antonym: Fragile, brittle)`,
  },
  {
    id: "official-portals-links",
    title: "Official Government & CIL Portals Directory (Direct Links & PDFs)",
    category: "Past Papers",
    description:
      "Direct portal links and official notification links for Coal India Limited recruitment, Ministry of Coal reports, and candidate information bulletins.",
    fileType: "Portal",
    estimatedReadTime: "5 min read",
    offlineAvailable: true,
    directLink: "https://www.coalindia.in",
    keyHighlights: [
      "Coal India Limited Official Portal: www.coalindia.in (Career / Recruitment section)",
      "Ministry of Coal Official Portal: www.coal.gov.in (Annual reports & production statistics)",
      "UTTAM Coal Quality Portal: uttam.coalindia.in",
      "PRAKASH Portal (Supply monitoring): prakash.gov.in",
      "National Career Service Portal: www.ncs.gov.in",
    ],
    contentMarkdown: `# Official CIL & Ministry of Coal Resource Links

## 1. Official Websites & Recruitment Channels
- **Coal India Limited Corporate Portal**: [www.coalindia.in](https://www.coalindia.in)
- **CIL Career & MT Recruitment Noticeboard**: [www.coalindia.in/career-cil/](https://www.coalindia.in/career-cil/)
- **Ministry of Coal, Government of India**: [www.coal.gov.in](https://www.coal.gov.in)
- **CMPDIL Mine Planning Portal**: [www.cmpdi.co.in](https://www.cmpdi.co.in)

## 2. Recommended Offline Study Sequence
1. Review the **Official CIL MT Examination Scheme** to understand the 40% qualifying threshold per paper.
2. Study the **Coal Sector & PSU Maharatna Reference Guide** for guaranteed Paper I General Awareness marks.
3. Use the **Computer Science & IT Core Revision Sheet** to master DBMS Normalization and OS Deadlock formulas.
4. Practice with the **Quantitative Aptitude & Reasoning Handbook** shortcuts.
5. Attempt the **Full 100-Question CBT Mock Tests** in the Mock Tests tab under proctored timer mode!`,
  },
];
