import { Question } from "../types";

// Set 1 Paper 2 - Computer Science / Systems
export const SET1_PAPER2_QUESTIONS: Question[] = [
  {
    section: "Database Management Systems",
    q: "Which normal form strictly eliminates transitive functional dependencies on a non-prime attribute from any candidate key?",
    opts: ["1NF", "2NF", "3NF", "BCNF"],
    ans: 2,
    difficulty: "Medium",
    exp: "Third Normal Form (3NF) requires the relation to be in 2NF and ensures that no non-prime attribute is transitively dependent on any candidate key (for every X -> A, either X is a superkey or A is a prime attribute).",
  },
  {
    section: "Operating Systems",
    q: "Which CPU scheduling algorithm is non-preemptive and assigns the CPU to the process with the shortest burst time first, but may suffer from starvation of longer processes?",
    opts: ["Round Robin (RR)", "Shortest Job First (SJF)", "First Come First Served (FCFS)", "Priority Scheduling (Preemptive)"],
    ans: 1,
    difficulty: "Easy",
    exp: "Shortest Job First (SJF) is non-preemptive and optimal for minimizing average waiting time, though long processes can starve if short processes arrive continuously.",
  },
  {
    section: "Computer Networks",
    q: "Which layer of the OSI model is responsible for logical IP addressing and packet routing across heterogeneous networks?",
    opts: ["Data Link Layer", "Network Layer", "Transport Layer", "Session Layer"],
    ans: 1,
    difficulty: "Easy",
    exp: "The Network Layer (Layer 3) handles logical host addressing (IPv4/IPv6), subnetting, and optimal path determination (routing) between routers.",
  },
  {
    section: "Data Structures & Algorithms",
    q: "What is the worst-case time complexity of QuickSort when the pivot chosen is always the smallest or largest element?",
    opts: ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"],
    ans: 2,
    difficulty: "Medium",
    exp: "When the input is already sorted and the pivot is chosen as the first or last element, the partition produces unbalanced sub-arrays of size 0 and n-1, yielding O(n^2) worst-case time complexity.",
  },
  {
    section: "Software Engineering",
    q: "In Object-Oriented Design, the ability of different classes to respond to the same method call with distinct specialized implementations is termed:",
    opts: ["Encapsulation", "Polymorphism", "Inheritance", "Abstraction"],
    ans: 1,
    difficulty: "Easy",
    exp: "Polymorphism ('many forms') enables a single interface or method signature to be executed dynamically by different derived classes (method overriding and overloading).",
  },
  {
    section: "Operating Systems",
    q: "What are the four necessary and sufficient conditions for a deadlock to occur in an operating system?",
    opts: [
      "Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait",
      "Paging, Segmentation, Thrashing, Swapping",
      "Deadlock Detection, Prevention, Avoidance, Recovery",
      "Synchronization, Mutex, Semaphore, Monitor",
    ],
    ans: 0,
    difficulty: "Medium",
    exp: "Coffman conditions for deadlock: 1) Mutual Exclusion, 2) Hold and Wait, 3) No Preemption, and 4) Circular Wait. Breaking any one condition prevents deadlocks.",
  },
  {
    section: "Computer Networks",
    q: "What is the standard prefix length of the loopback IPv4 address block (127.0.0.1)?",
    opts: ["/8", "/16", "/24", "/32"],
    ans: 0,
    difficulty: "Medium",
    exp: "The entire 127.0.0.0/8 block is reserved by IETF for loopback and local host inter-process network testing.",
  },
  {
    section: "Information Security",
    q: "Which cryptographic algorithm is an asymmetric (public-key) encryption standard based on the mathematical difficulty of factoring large prime numbers?",
    opts: ["AES", "DES", "RSA", "Blowfish"],
    ans: 2,
    difficulty: "Easy",
    exp: "RSA (Rivest–Shamir–Adleman) is an asymmetric cryptosystem relying on the computational difficulty of factoring the product of two large prime numbers.",
  },
  {
    section: "Database Management Systems",
    q: "Which property in the ACID model ensures that changes made by committed transactions persist permanently even in the event of power outage or system crash?",
    opts: ["Atomicity", "Consistency", "Isolation", "Durability"],
    ans: 3,
    difficulty: "Easy",
    exp: "Durability guarantees that once a transaction has committed, its updates survive system failures, typically ensured via write-ahead logging (WAL).",
  },
  {
    section: "Data Structures & Algorithms",
    q: "Which data structure follows the Last-In-First-Out (LIFO) order and is inherently used for recursive function call stack management?",
    opts: ["Queue", "Stack", "Binary Heap", "Hash Table"],
    ans: 1,
    difficulty: "Easy",
    exp: "A Stack operates on the LIFO principle, making it the fundamental data structure used by system runtimes to store activation records and local variables in recursion.",
  },
];

// Set 2 Paper 2 - Computer Science
export const SET2_PAPER2_QUESTIONS: Question[] = [
  {
    section: "Database Management Systems",
    q: "Which SQL clause is used to filter group-level summary records created by the GROUP BY statement?",
    opts: ["WHERE", "HAVING", "ORDER BY", "DISTINCT"],
    ans: 1,
    difficulty: "Easy",
    exp: "'HAVING' filters grouped aggregates (e.g. HAVING COUNT(*) > 5), whereas 'WHERE' filters individual rows before grouping occurs.",
  },
  {
    section: "Operating Systems",
    q: "What phenomenon occurs when excessive page faults happen continuously, causing the operating system to spend more time swapping pages than executing useful work?",
    opts: ["Starvation", "Thrashing", "Deadlock", "Belady's Anomaly"],
    ans: 1,
    difficulty: "Easy",
    exp: "Thrashing occurs when the working set of active processes exceeds physical RAM capacity, causing high paging I/O and near-zero CPU throughput.",
  },
  {
    section: "Computer Networks",
    q: "Which protocol operates at the Transport layer to provide connection-oriented, reliable byte-stream transmission with flow and congestion control?",
    opts: ["UDP", "TCP", "IP", "ICMP"],
    ans: 1,
    difficulty: "Easy",
    exp: "Transmission Control Protocol (TCP) provides reliable, ordered, error-checked delivery of a stream of octets between applications running on hosts over an IP network.",
  },
  {
    section: "Data Structures & Algorithms",
    q: "In an AVL tree, what is the maximum allowed difference between the heights of the left and right subtrees of any node?",
    opts: ["0", "1", "2", "Unlimited"],
    ans: 1,
    difficulty: "Easy",
    exp: "An AVL tree is a self-balancing binary search tree where the balance factor (height(left) - height(right)) for every node is strictly within {-1, 0, +1}.",
  },
  {
    section: "Software Engineering",
    q: "Which software lifecycle model follows a rigid, linear-sequential progression where testing is performed only after the entire coding phase is complete?",
    opts: ["Agile Scrum", "Waterfall Model", "Spiral Model", "RAD Model"],
    ans: 1,
    difficulty: "Easy",
    exp: "The Classic Waterfall model executes phases sequentially (Requirements -> Design -> Implementation -> Verification -> Maintenance) with little accommodation for shifting requirements.",
  },
];

// Set 3 Paper 2 - Computer Science
export const SET3_PAPER2_QUESTIONS: Question[] = [
  {
    section: "Operating Systems",
    q: "Which page replacement algorithm is prone to Belady's Anomaly (where increasing the number of page frames leads to an increase in page faults)?",
    opts: ["Optimal (OPT)", "Least Recently Used (LRU)", "First-In-First-Out (FIFO)", "LFU"],
    ans: 2,
    difficulty: "Medium",
    exp: "Belady's Anomaly occurs in FIFO page replacement, because FIFO does not belong to the stack algorithm family.",
  },
  {
    section: "Database Management Systems",
    q: "In relational algebra, which fundamental operator is used to select a subset of columns (vertical filtering) from a table?",
    opts: ["Selection (σ)", "Projection (π)", "Cartesian Product (×)", "Join (⨝)"],
    ans: 1,
    difficulty: "Easy",
    exp: "Projection (π) extracts specified attribute columns while eliminating duplicate tuples from the result set.",
  },
  {
    section: "Computer Networks",
    q: "Which well-known port is utilized by the Secure Shell (SSH) protocol for encrypted remote administration?",
    opts: ["Port 21", "Port 22", "Port 23", "Port 80"],
    ans: 1,
    difficulty: "Easy",
    exp: "SSH default port is TCP 22 (Telnet uses 23, FTP uses 20/21).",
  },
  {
    section: "Data Structures & Algorithms",
    q: "Which graph traversal algorithm uses a First-In-First-Out (FIFO) queue and finds the shortest path in an unweighted graph?",
    opts: ["Depth First Search (DFS)", "Breadth First Search (BFS)", "Kruskal's Algorithm", "Prim's Algorithm"],
    ans: 1,
    difficulty: "Easy",
    exp: "Breadth-First Search (BFS) explores vertices layer by layer using a Queue and guarantees minimum hop count in unweighted graphs.",
  },
];

// Set 4 Paper 2 - Computer Science
export const SET4_PAPER2_QUESTIONS: Question[] = [
  {
    section: "Operating Systems",
    q: "The Banker's Algorithm is primarily used in operating systems for:",
    opts: ["Deadlock Prevention", "Deadlock Avoidance", "Deadlock Detection", "Deadlock Recovery"],
    ans: 1,
    difficulty: "Medium",
    exp: "Banker's Algorithm by Edsger Dijkstra tests for safety by simulating the allocation for predetermined maximum possible amounts of all resources to avoid unsafe states.",
  },
  {
    section: "Computer Networks",
    q: "What is the primary function of the Address Resolution Protocol (ARP)?",
    opts: [
      "Translate domain names to IP addresses",
      "Map a known 32-bit IPv4 address to a 48-bit physical MAC hardware address",
      "Assign dynamic IP addresses automatically",
      "Encrypt packets at the network layer",
    ],
    ans: 1,
    difficulty: "Easy",
    exp: "ARP (Address Resolution Protocol) broadcasts a query on the local Ethernet network to discover the link-layer MAC address associated with a given IPv4 address.",
  },
  {
    section: "Database Management Systems",
    q: "A schedule of transactions is conflict serializable if its precedence (serialization) graph contains:",
    opts: ["At least one cycle", "No directed cycles (Acyclic)", "Only self-loops", "Equal in-degree and out-degree"],
    ans: 1,
    difficulty: "Medium",
    exp: "A schedule is conflict serializable if and only if its precedence graph is a Directed Acyclic Graph (DAG).",
  },
];

// Set 5 Paper 2 - Computer Science
export const SET5_PAPER2_QUESTIONS: Question[] = [
  {
    section: "Data Structures & Algorithms",
    q: "What is the time complexity to search, insert, and delete an element in a balanced Red-Black Tree with n nodes?",
    opts: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    ans: 1,
    difficulty: "Easy",
    exp: "Red-Black Trees maintain a maximum height of 2 * log2(n + 1), guaranteeing O(log n) worst-case time for lookup, insertion, and deletion.",
  },
  {
    section: "Software Engineering",
    q: "In software engineering, what architectural design principle states that software entities (classes, modules, functions) should be open for extension, but closed for modification?",
    opts: ["Single Responsibility Principle", "Open/Closed Principle (OCP)", "Liskov Substitution Principle", "Interface Segregation"],
    ans: 1,
    difficulty: "Medium",
    exp: "The Open/Closed Principle (part of SOLID principles) states that code should allow new functionality to be added via extension (inheritance/interfaces) without modifying verified existing code.",
  },
];

// Set 6 Paper 2 - Computer Science & System
export const SET6_PAPER2_QUESTIONS: Question[] = [
  {
    section: "Computer Networks",
    q: "In the TCP 3-way handshake mechanism to establish a connection, what are the sequence of control flags exchanged?",
    opts: ["SYN -> SYN-ACK -> ACK", "ACK -> SYN -> SYN-ACK", "FIN -> ACK -> FIN-ACK", "RST -> SYN -> ACK"],
    ans: 0,
    difficulty: "Easy",
    exp: "TCP connection establishment starts with Client sending SYN, Server responding with SYN-ACK, and Client acknowledging with ACK.",
  },
  {
    section: "Database Management Systems",
    q: "Which RAID level provides pure disk striping without any parity or fault tolerance redundancy?",
    opts: ["RAID 0", "RAID 1", "RAID 5", "RAID 10"],
    ans: 0,
    difficulty: "Easy",
    exp: "RAID 0 stripes data blocks across multiple drives for high I/O throughput but offers zero redundancy—failure of any single disk results in total data loss.",
  },
];

// Set 7 Paper 2 - Advanced System Engineering & CS
export const SET7_PAPER2_QUESTIONS: Question[] = [
  {
    section: "Operating Systems",
    q: "In modern operating systems, which memory management architecture completely decouples the logical address space from physical RAM via page tables and TLB cache?",
    opts: ["Dynamic Partitioning", "Virtual Memory Management", "Overlay Architecture", "Monolithic Segmentation"],
    ans: 1,
    difficulty: "Easy",
    exp: "Virtual Memory gives each process the illusion of a contiguous address space using demand paging and Translation Lookaside Buffers (TLB).",
  },
  {
    section: "Database Management Systems",
    q: "Which concurrency control protocol prevents dirty reads, unrepeatable reads, and phantom reads by acquiring shared locks for reading and exclusive locks for writing until transaction completion?",
    opts: ["Strict Two-Phase Locking (Strict 2PL)", "Timestamp Ordering Protocol", "Validation-based Protocol", "Multiversion Scheme"],
    ans: 0,
    difficulty: "Medium",
    exp: "Strict 2PL holds all exclusive locks (and often shared locks) until the end of the transaction (Commit/Abort), guaranteeing serializability and preventing cascading rollbacks.",
  },
];
