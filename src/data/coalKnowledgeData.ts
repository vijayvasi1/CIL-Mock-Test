export interface CoalSubsidiaryItem {
  id: string;
  shortName: string;
  fullName: string;
  formationDate: string;
  formationYear: number;
  headquarters: string;
  hqLocation: string;
  states: string[];
  majorCoalfields: string[];
  keyFacts: string;
  flagshipMines: string[];
  mechanizationLevel: string;
  role: string;
  category: "Mining Subsidiary" | "Consultancy & Planning" | "Direct Unit" | "Overseas";
}

export interface CoalClassificationItem {
  type: string;
  rank: number;
  carbonContent: string;
  calorificValue: string;
  volatileMatter: string;
  moistureContent: string;
  ashContent: string;
  cokingProperty: string;
  description: string;
  indianOccurrence: string;
  primaryUses: string[];
  colorHex: string;
  badgeClass: string;
}

export interface CoalReserveStat {
  rank: number;
  state: string;
  geologicalReservesBT: number; // in Billion Tonnes
  percentOfTotal: number;
  majorCoalfields: string[];
  keySubsidiaries: string[];
}

export interface NationalInitiative {
  id: string;
  title: string;
  targetYear: string;
  outlay: string;
  keyHighlights: string[];
  description: string;
  portalOrApp?: string;
  status: string;
}

export interface FactCheckQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: "Headquarters" | "Incorporation Date" | "Coalfield" | "Coal Properties" | "National Statistics";
}

export const CIL_SUBSIDIARIES_DATA: CoalSubsidiaryItem[] = [
  {
    id: "bccl",
    shortName: "BCCL",
    fullName: "Bharat Coking Coal Limited",
    formationDate: "January 1972",
    formationYear: 1972,
    headquarters: "Dhanbad (Koyla Nagar), Jharkhand",
    hqLocation: "Dhanbad, Jharkhand",
    states: ["Jharkhand", "West Bengal"],
    majorCoalfields: ["Jharia Coalfield", "Raniganj Coalfield (western portion)"],
    keyFacts: "Incorporated earliest in Jan 1972. It is India's premier producer of prime coking coal for blast furnaces in the steel industry.",
    flagshipMines: ["Moonidih Underground", "Block II OCP", "Katras", "Kusunda", "Lodna", "Bastacolla"],
    mechanizationLevel: "Mixed (Continuous Miners, PSLW longwall in Moonidih, heavy OCP shovels)",
    role: "Prime Coking Coal Supply to Steel PSUs (SAIL, RINL)",
    category: "Mining Subsidiary",
  },
  {
    id: "wcl",
    shortName: "WCL",
    fullName: "Western Coalfields Limited",
    formationDate: "29 October 1975",
    formationYear: 1975,
    headquarters: "Nagpur (Coal Estate), Maharashtra",
    hqLocation: "Nagpur, Maharashtra",
    states: ["Maharashtra", "Madhya Pradesh"],
    majorCoalfields: ["Wardha Valley", "Umrer", "Pench Valley", "Kanhan Valley", "Pathakhera"],
    keyFacts: "Incorporated on 29 October 1975. Serves thermal power stations across Maharashtra, Madhya Pradesh, Gujarat, and Southern India.",
    flagshipMines: ["Gondegaon OCP", "Penganga OCP", "Umrer OCP", "Durgapur OCP", "Tawa Underground"],
    mechanizationLevel: "High mechanization with Surface Miners & Draglines",
    role: "Power Sector Coal Supply for Western & Central India",
    category: "Mining Subsidiary",
  },
  {
    id: "ccl",
    shortName: "CCL",
    fullName: "Central Coalfields Limited",
    formationDate: "1 November 1975",
    formationYear: 1975,
    headquarters: "Ranchi (Darbhanga House), Jharkhand",
    hqLocation: "Ranchi, Jharkhand",
    states: ["Jharkhand"],
    majorCoalfields: ["East Bokaro", "West Bokaro", "North Karanpura", "South Karanpura", "Ramgarh", "Giridih"],
    keyFacts: "Formed on 1 November 1975 out of the nationalized National Coal Development Corporation (NCDC). Major producer of medium coking and non-coking coal.",
    flagshipMines: ["Amrapali Mega OCP", "Magadh Mega OCP", "Ashoka OCP", "Piprawar OCP", "Rajrappa"],
    mechanizationLevel: "Mega In-Pit Crushing & Conveying, Surface Miners",
    role: "Coking & Non-coking coal for Power, Steel & Washeries",
    category: "Mining Subsidiary",
  },
  {
    id: "cmpdil",
    shortName: "CMPDIL",
    fullName: "Central Mine Planning & Design Institute Limited",
    formationDate: "1 November 1975",
    formationYear: 1975,
    headquarters: "Ranchi (Gondwana Place, Kanke Road), Jharkhand",
    hqLocation: "Ranchi, Jharkhand",
    states: ["Pan-India (7 Regional Institutes)"],
    majorCoalfields: ["All Indian & Overseas Coal Basins (Consultancy & Exploration)"],
    keyFacts: "Incorporated on 1 November 1975 as CIL's non-mining consultancy & technical planning wing. Operates 7 Regional Institutes (RIs) at Asansol, Dhanbad, Ranchi, Nagpur, Bilaspur, Singrauli, and Bhubaneswar.",
    flagshipMines: ["N/A (Consultancy, 2D/3D Seismic Exploration, Drone Lidar & Mine Planning)"],
    mechanizationLevel: "Hydrostatic Drill Rigs, 3D Geomodelling, GIS Labs",
    role: "Geological Exploration, Mine Design, Environmental Clearances & CIL IT Planning",
    category: "Consultancy & Planning",
  },
  {
    id: "ecl",
    shortName: "ECL",
    fullName: "Eastern Coalfields Limited",
    formationDate: "1 November 1975",
    formationYear: 1975,
    headquarters: "Sanctoria (Dishergarh), West Bengal",
    hqLocation: "Sanctoria, West Bengal",
    states: ["West Bengal", "Jharkhand"],
    majorCoalfields: ["Raniganj Coalfield", "Rajmahal Coalfield (Godda, Jharkhand)"],
    keyFacts: "Incorporated on 1 November 1975. Operates the historic Raniganj coalfield, where commercial coal mining in India first started in 1774 by Summer and Heatly.",
    flagshipMines: ["Rajmahal OCP (Godda)", "Sonepur Bazari OCP", "Jhanjra Underground (Continuous Miners)", "Khottadih"],
    mechanizationLevel: "High-capacity Continuous Miners & High-tech Longwalls underground",
    role: "Superior High-GCV Coal & Captive Supply to NTPC Farakka/Kahalgaon",
    category: "Mining Subsidiary",
  },
  {
    id: "secl",
    shortName: "SECL",
    fullName: "South Eastern Coalfields Limited",
    formationDate: "1 November 1985",
    formationYear: 1985,
    headquarters: "Bilaspur (Seepat Road), Chhattisgarh",
    hqLocation: "Bilaspur, Chhattisgarh",
    states: ["Chhattisgarh", "Madhya Pradesh"],
    majorCoalfields: ["Korba", "Mand-Raigarh", "Sohagpur", "Johilla", "Bisrampur", "Chirimiri", "Hasdeo"],
    keyFacts: "Incorporated on 1 November 1985 by carving out areas from WCL. Operates Gevra, Kusmunda, and Dipka mega-opencast mines in the Korba coalfield.",
    flagshipMines: ["Gevra Mega OCP (>70 MTPA capacity)", "Kusmunda Mega OCP", "Dipka OCP", "Manikpur OCP"],
    mechanizationLevel: "World-class 240T Dumpers, 42m³ Shovels, Surface Miners, Rapid Loading Silos",
    role: "Highest Volume Coal Producer powering India's National Grid",
    category: "Mining Subsidiary",
  },
  {
    id: "ncl",
    shortName: "NCL",
    fullName: "Northern Coalfields Limited",
    formationDate: "1 November 1985",
    formationYear: 1985,
    headquarters: "Singrauli (Panjreh), Madhya Pradesh",
    hqLocation: "Singrauli, Madhya Pradesh",
    states: ["Madhya Pradesh", "Uttar Pradesh"],
    majorCoalfields: ["Singrauli Coalfield (Northern part across MP/UP border)"],
    keyFacts: "Incorporated on 1 November 1985 by carving out Singrauli from CCL. Distinguished by 100% mechanized opencast mining supplying pithead super thermal plants.",
    flagshipMines: ["Jayant OCP", "Nigahi OCP", "Dudhichua OCP", "Amlohri OCP", "Bina OCP", "Khadia OCP"],
    mechanizationLevel: "100% Mechanized Opencast (Walking Draglines, Electric Rope Shovels, MGR Rail Silos)",
    role: "Direct Pithead Supply to NTPC Singrauli, Vindhyachal, Rihand & Anpara",
    category: "Mining Subsidiary",
  },
  {
    id: "mcl",
    shortName: "MCL",
    fullName: "Mahanadi Coalfields Limited",
    formationDate: "3 April 1992",
    formationYear: 1992,
    headquarters: "Sambalpur (Jagriti Vihar, Burla), Odisha",
    hqLocation: "Sambalpur, Odisha",
    states: ["Odisha"],
    majorCoalfields: ["Talcher Coalfield", "Ib Valley Coalfield (Jharsuguda/Sundargarh)"],
    keyFacts: "Incorporated on 3 April 1992 by carving out Talcher and Ib Valley from SECL. Consistently ranks as CIL's largest volume producer (>200 MTPA).",
    flagshipMines: ["Bhubaneswari Mega OCP", "Lakhanpur OCP", "Kulda OCP", "Ananta OCP", "Kaniha OCP", "Belpahar OCP"],
    mechanizationLevel: "100% Surface Miners for blasting-free eco-friendly coal extraction",
    role: "Baseload Supplier to Coastal & Southern India Power Stations via Rail & Ports",
    category: "Mining Subsidiary",
  },
  {
    id: "nec",
    shortName: "NEC",
    fullName: "North Eastern Coalfields",
    formationDate: "2007 (Institutionalized Operating Unit)",
    formationYear: 2007,
    headquarters: "Margherita (Tinsukia District), Assam",
    hqLocation: "Margherita, Assam",
    states: ["Assam", "Meghalaya", "Arunachal Pradesh", "Nagaland"],
    majorCoalfields: ["Makum Coalfield", "Dilli-Jeypore Coalfield"],
    keyFacts: "Directly administered operational unit of CIL. Mined coals belong to Tertiary geological era (characterised by low ash <5%, high volatile matter, and very high organic sulphur 2–7%).",
    flagshipMines: ["Tikak OCP", "Ledo OCP", "Tipong Colliery", "Tirap Colliery"],
    mechanizationLevel: "Hillside Contour Mining, Underground Roadheaders",
    role: "Special High-Calorific Coal for Tea processing, Cement & Brick kilns in North-East",
    category: "Direct Unit",
  },
  {
    id: "cial",
    shortName: "CIAL",
    fullName: "Coal India Africana Limitada",
    formationDate: "2009",
    formationYear: 2009,
    headquarters: "Maputo / Tete, Mozambique",
    hqLocation: "Tete Province, Mozambique",
    states: ["Mozambique (Africa)"],
    majorCoalfields: ["Tete Coal Basin (Blocks A1 & A2)"],
    keyFacts: "100% Wholly owned overseas subsidiary of CIL incorporated in 2009 in Mozambique for acquiring, exploring, and developing overseas coal assets.",
    flagshipMines: ["Exploration Concession Blocks in Moatize Basin"],
    mechanizationLevel: "Exploration & Core Drilling",
    role: "Overseas Coking & Thermal Coal Asset Exploration",
    category: "Overseas",
  },
];

export const COAL_CLASSIFICATION_DATA: CoalClassificationItem[] = [
  {
    type: "Anthracite",
    rank: 1,
    carbonContent: "85% – 95%",
    calorificValue: "7,500 – 8,600 kcal/kg",
    volatileMatter: "< 8% (Very Low)",
    moistureContent: "< 3% – 5%",
    ashContent: "< 5% – 10%",
    cokingProperty: "Non-coking (Burns with short, hot, smokeless blue flame)",
    description: "The highest metamorphic rank of coal. Dense, lustrous, metallic black with sub-metallic sheen and conchoidal fracture.",
    indianOccurrence: "Extremely scarce in India; small occurrences in Kalakot and Reasi areas of Jammu & Kashmir.",
    primaryUses: ["High-grade Metallurgy", "Space heating", "Specialized filters & Carbon anodes", "Smokeless domestic fuel"],
    colorHex: "#1e293b",
    badgeClass: "bg-slate-900 text-amber-300 border-amber-500/40",
  },
  {
    type: "Bituminous (Coking & Non-Coking)",
    rank: 2,
    carbonContent: "65% – 85%",
    calorificValue: "5,500 – 7,500 kcal/kg",
    volatileMatter: "20% – 35%",
    moistureContent: "4% – 10%",
    ashContent: "15% – 45% (Typical for Indian Gondwana coals)",
    cokingProperty: "Prime Coking (Jharia), Medium Coking (Bokaro/Ramgarh), Semi-coking (Raniganj)",
    description: "Most abundant commercial coal type in India (over 85% of total reserves). Dense black, banded with vitrain and durain layers.",
    indianOccurrence: "Major Gondwana basins: Jharia (Jharkhand), Raniganj (WB), Korba (CG), Singrauli (MP/UP), Talcher & Ib Valley (Odisha).",
    primaryUses: ["Thermal Power Generation (>70% of Indian electricity)", "Coke making for Steel Blast Furnaces", "Cement manufacturing"],
    colorHex: "#334155",
    badgeClass: "bg-indigo-950 text-indigo-200 border-indigo-500/40",
  },
  {
    type: "Sub-Bituminous",
    rank: 3,
    carbonContent: "45% – 65%",
    calorificValue: "4,000 – 5,500 kcal/kg",
    volatileMatter: "35% – 45%",
    moistureContent: "10% – 25%",
    ashContent: "10% – 25%",
    cokingProperty: "Completely Non-Coking",
    description: "Dull black to dark brown intermediate grade between lignite and bituminous. Disintegrates upon prolonged exposure to air (slacking).",
    indianOccurrence: "Upper seams of Singrauli, Talcher, Wardha Valley, and parts of Godavari Valley (SCCL).",
    primaryUses: ["Baseload Pithead Super Thermal Power Stations", "Industrial Boilers", "Gasification Syngas"],
    colorHex: "#475569",
    badgeClass: "bg-emerald-950 text-emerald-200 border-emerald-500/40",
  },
  {
    type: "Lignite (Brown Coal)",
    rank: 4,
    carbonContent: "25% – 45%",
    calorificValue: "2,500 – 4,000 kcal/kg",
    volatileMatter: "40% – 55%",
    moistureContent: "30% – 50% (High moisture)",
    ashContent: "5% – 15%",
    cokingProperty: "Non-Coking (Prone to spontaneous combustion)",
    description: "Soft, brownish-black coal with distinct woody and vegetal texture. Lowest rank of true coal with high moisture and low energy density.",
    indianOccurrence: "Neyveli (Tamil Nadu - >80% of Indian lignite), Palana & Bikaner (Rajasthan), Panandhro (Gujarat), Nichahom (J&K). Managed by NLC India Ltd.",
    primaryUses: ["Pithead Lignite Thermal Power Plants (NLC Neyveli)", "Urea Fertilizer synthesis", "Synthetic Gas & Wax production"],
    colorHex: "#78350f",
    badgeClass: "bg-amber-950 text-amber-200 border-amber-500/40",
  },
  {
    type: "Peat",
    rank: 5,
    carbonContent: "< 25% – 30%",
    calorificValue: "< 2,500 kcal/kg",
    volatileMatter: "> 60%",
    moistureContent: "> 70% – 85% (Unprocessed)",
    ashContent: "5% – 10%",
    cokingProperty: "Not a commercial coal; first stage in coalification",
    description: "Partially decomposed vegetal matter accumulated in waterlogged bogs and marshes. High volume of water and smoky, low-heat burn.",
    indianOccurrence: "Nilgiri Hills (Tamil Nadu), Sundarbans mangrove peat (West Bengal), Kashmir Valley peat bogs.",
    primaryUses: ["Horticulture soil conditioner", "Domestic heating in cold rural regions after sun drying"],
    colorHex: "#854d0e",
    badgeClass: "bg-stone-900 text-stone-300 border-stone-600",
  },
];

export const COAL_RESERVE_STATISTICS: CoalReserveStat[] = [
  {
    rank: 1,
    state: "Jharkhand",
    geologicalReservesBT: 86.2,
    percentOfTotal: 26.1,
    majorCoalfields: ["Jharia", "East Bokaro", "West Bokaro", "North Karanpura", "South Karanpura", "Rajmahal", "Ramgarh"],
    keySubsidiaries: ["BCCL", "CCL", "ECL"],
  },
  {
    rank: 2,
    state: "Odisha",
    geologicalReservesBT: 85.9,
    percentOfTotal: 25.9,
    majorCoalfields: ["Talcher Coalfield", "Ib Valley Coalfield"],
    keySubsidiaries: ["MCL"],
  },
  {
    rank: 3,
    state: "Chhattisgarh",
    geologicalReservesBT: 73.4,
    percentOfTotal: 22.2,
    majorCoalfields: ["Korba", "Mand-Raigarh", "Hasdeo-Arand", "Bisrampur", "Chirimiri", "Sohagpur"],
    keySubsidiaries: ["SECL"],
  },
  {
    rank: 4,
    state: "West Bengal",
    geologicalReservesBT: 33.1,
    percentOfTotal: 10.0,
    majorCoalfields: ["Raniganj Coalfield", "Birbhum", "Deocha-Pachami"],
    keySubsidiaries: ["ECL"],
  },
  {
    rank: 5,
    state: "Madhya Pradesh",
    geologicalReservesBT: 30.0,
    percentOfTotal: 9.1,
    majorCoalfields: ["Singrauli (MP part)", "Pench-Kanhan", "Sohagpur", "Johilla", "Mohpani"],
    keySubsidiaries: ["NCL", "SECL", "WCL"],
  },
  {
    rank: 6,
    state: "Telangana (SCCL)",
    geologicalReservesBT: 22.8,
    percentOfTotal: 6.9,
    majorCoalfields: ["Godavari Valley Coalfield (Kothagudem, Ramagundam, Bellampalli)"],
    keySubsidiaries: ["Singareni Collieries (SCCL - Joint PSU)"],
  },
  {
    rank: 7,
    state: "Maharashtra",
    geologicalReservesBT: 12.9,
    percentOfTotal: 3.9,
    majorCoalfields: ["Wardha Valley (Chandrapur, Ballarpur, Majri)", "Umrer", "Kamptee"],
    keySubsidiaries: ["WCL"],
  },
];

export const NATIONAL_INITIATIVES: NationalInitiative[] = [
  {
    id: "ncgm",
    title: "National Coal Gasification Mission",
    targetYear: "2030",
    outlay: "₹8,500 Crore Viability Gap Funding",
    description: "Ambitious national policy by the Ministry of Coal to gasify 100 Million Tonnes of domestic coal by 2030 to produce syngas, clean methanol, synthetic natural gas (SNG), and chemicals, reducing import dependence.",
    keyHighlights: [
      "100 MT coal gasification target by 2030",
      "₹8,500 Cr financial assistance in 3 categories (PSUs, Private developers, Pilot projects)",
      "Coal-to-Ammonium Nitrate plant in Odisha (MCL & CIL)",
      "20% rebate on revenue share for commercial coal gasification bidders",
    ],
    status: "Active & Funded",
  },
  {
    id: "fmc",
    title: "First Mile Connectivity (FMC) Mega Logistics",
    targetYear: "2027–2030",
    outlay: "> ₹24,000 Crore",
    description: "Replaces road transportation of coal by trucks with mechanized, automated overland conveyor belts, in-pit crushing systems, and computerized rapid loading railway silos.",
    keyHighlights: [
      "Eliminates highway truck emissions and fugitive coal dust pollution",
      "Over 100 FMC projects sanctioned across all CIL subsidiaries",
      "Over 600 MTPA mechanized coal evacuation capacity",
      "Automated weight and quality sampling at computerized railway silos",
    ],
    status: "Phase I & II Under Execution",
  },
  {
    id: "uttam",
    title: "UTTAM Mobile App (Unlocking Transparency by Third-Party Assessment)",
    targetYear: "Continuous",
    outlay: "Digital Governance",
    portalOrApp: "UTTAM App",
    description: "Official mobile application launched by the Ministry of Coal to allow consumers and general public to track third-party coal sampling, grade analysis, and dispatch quality transparently.",
    keyHighlights: [
      "Transparent third-party sampling results by CIMFR and certified labs",
      "Real-time monitoring of coal grade declarations across all collieries",
      "Reduces grade slippage disputes between CIL subsidiaries and power utilities",
    ],
    status: "Live & Operational",
  },
  {
    id: "prakash",
    title: "PRAKASH Portal (Power Rail Koyla Availability through Supply Harmony)",
    targetYear: "Continuous",
    outlay: "Inter-Ministry Coordination",
    portalOrApp: "PRAKASH Portal",
    description: "Integrated online portal jointly developed by Ministry of Coal, Ministry of Power, and Ministry of Railways to ensure transparent, daily synchronization of coal stocks, rake loadings, and power plant inventories.",
    keyHighlights: [
      "Daily visibility over coal rake movements and pithead stock levels",
      "Prevents critical coal inventory shortages at 180+ thermal power plants",
      "Real-time coordination between CIL dispatchers and Indian Railways freight controllers",
    ],
    status: "Live & Operational",
  },
  {
    id: "koyla_shakti",
    title: "Koyla Shakti & CLAMP Portals",
    targetYear: "2025–2026 Rollout",
    outlay: "GIS Digital Transformation",
    portalOrApp: "Koyla Shakti GIS Dashboard",
    description: "Next-generation digital governance suite launched on October 29, 2025 by the Ministry of Coal. CLAMP (Comprehensive Land Acquisition Management Portal) streamlines land acquisition & R&R for project displaced persons.",
    keyHighlights: [
      "Integrated GIS spatial mapping of all coal blocks and mine boundaries",
      "Transparent compensation and employment tracking for Land Acquisition",
      "Digitized Project PASSION (Centralized SAP S/4HANA ERP across CIL)",
    ],
    status: "Active Deployment",
  },
];

export const COAL_FACT_CHECK_QUESTIONS: FactCheckQuestion[] = [
  {
    id: 1,
    question: "Which CIL subsidiary was incorporated in January 1972 and has its headquarters in Dhanbad (Koyla Nagar), Jharkhand?",
    options: ["Western Coalfields Limited", "Bharat Coking Coal Limited", "Central Coalfields Limited", "Eastern Coalfields Limited"],
    correctIndex: 1,
    explanation: "Bharat Coking Coal Limited (BCCL) was incorporated in January 1972 with headquarters in Dhanbad, Jharkhand, producing prime coking coal.",
    topic: "Incorporation Date",
  },
  {
    id: 2,
    question: "Where is the corporate headquarters of Western Coalfields Limited (WCL) situated?",
    options: ["Ranchi", "Nagpur", "Bilaspur", "Sambalpur"],
    correctIndex: 1,
    explanation: "Western Coalfields Limited (WCL) was incorporated on 29 October 1975 and has its corporate headquarters in Nagpur, Maharashtra.",
    topic: "Headquarters",
  },
  {
    id: 3,
    question: "Which CIL subsidiary operates the Gevra, Kusmunda, and Dipka mega opencast mines in Korba?",
    options: ["MCL", "SECL", "CCL", "NCL"],
    correctIndex: 1,
    explanation: "South Eastern Coalfields Limited (SECL, HQ Bilaspur) operates Gevra, Kusmunda, and Dipka mega mines in the Korba coalfield of Chhattisgarh.",
    topic: "Coalfield",
  },
  {
    id: 4,
    question: "Which state in India possesses the largest total geological coal reserves?",
    options: ["Odisha", "Chhattisgarh", "Jharkhand", "West Bengal"],
    correctIndex: 2,
    explanation: "Jharkhand holds the largest geological coal reserves in India (>86 Billion Tonnes), led by Jharia, Bokaro, and Karanpura coalfields.",
    topic: "National Statistics",
  },
  {
    id: 5,
    question: "Mahanadi Coalfields Limited (MCL) was incorporated on 3 April 1992. Where is its headquarters located?",
    options: ["Bhubaneswar", "Sambalpur", "Cuttack", "Rourkela"],
    correctIndex: 1,
    explanation: "MCL is headquartered at Jagriti Vihar, Burla, Sambalpur, Odisha, and operates Talcher and Ib Valley coalfields.",
    topic: "Headquarters",
  },
  {
    id: 6,
    question: "Which CIL subsidiary is distinguished by having 100% mechanized opencast mines in the Singrauli basin?",
    options: ["NCL", "ECL", "WCL", "CCL"],
    correctIndex: 0,
    explanation: "Northern Coalfields Limited (NCL, HQ Singrauli, MP) operates 100% mechanized opencast coal mines.",
    topic: "Coalfield",
  },
  {
    id: 7,
    question: "What is the official target set under the National Coal Gasification Mission for clean coal utilization by 2030?",
    options: ["25 Million Tonnes", "50 Million Tonnes", "100 Million Tonnes", "200 Million Tonnes"],
    correctIndex: 2,
    explanation: "The National Coal Gasification Mission aims to gasify 100 Million Tonnes of coal by 2030 with ₹8,500 Crore Viability Gap Funding.",
    topic: "National Statistics",
  },
  {
    id: 8,
    question: "What is the primary distinguishing property of Tertiary coals mined by North Eastern Coalfields (NEC) in Assam?",
    options: [
      "High ash (>40%) and low volatility",
      "Low ash (<5%) and high organic sulphur (2% to 7%)",
      "Zero volatile matter and pure anthracite grade",
      "High moisture (>50%) and no calorific heat",
    ],
    correctIndex: 1,
    explanation: "Tertiary coals from Assam (Makum coalfield) are geologically younger with very low ash (<5%), high caking power, and high organic sulphur (2–7%).",
    topic: "Coal Properties",
  },
  {
    id: 9,
    question: "Eastern Coalfields Limited (ECL) has its corporate headquarters at Sanctoria, West Bengal. In which historic coalfield does it operate?",
    options: ["Singrauli", "Talcher", "Raniganj", "Wardha Valley"],
    correctIndex: 2,
    explanation: "ECL operates the Raniganj coalfield, where commercial coal mining in India commenced in 1774 by Summer and Heatly.",
    topic: "Coalfield",
  },
  {
    id: 10,
    question: "How many Regional Institutes (RIs) are operated across India by Central Mine Planning & Design Institute Limited (CMPDIL)?",
    options: ["4 Regional Institutes", "7 Regional Institutes", "10 Regional Institutes", "12 Regional Institutes"],
    correctIndex: 1,
    explanation: "CMPDIL (HQ Ranchi) operates 7 Regional Institutes: RI-1 Asansol, RI-2 Dhanbad, RI-3 Ranchi, RI-4 Nagpur, RI-5 Bilaspur, RI-6 Singrauli, and RI-7 Bhubaneswar.",
    topic: "Headquarters",
  },
  {
    id: 11,
    question: "In which overseas country does CIL hold coal exploration concessions through its subsidiary 'Coal India Africana Limitada' (CIAL)?",
    options: ["South Africa", "Mozambique", "Australia", "Indonesia"],
    correctIndex: 1,
    explanation: "Coal India Africana Limitada (CIAL) was incorporated in 2009 in Mozambique (Tete province) as CIL's 100% foreign subsidiary.",
    topic: "Incorporation Date",
  },
  {
    id: 12,
    question: "Which mobile application was developed by the Ministry of Coal to ensure transparency in third-party coal sampling and grading?",
    options: ["GARV App", "UTTAM App", "TARANG App", "SAUBHAGYA App"],
    correctIndex: 1,
    explanation: "UTTAM (Unlocking Transparency by Third Party Assessment of Mined Coal) allows monitoring of coal sampling and grade declarations.",
    topic: "National Statistics",
  },
  {
    id: 13,
    question: "Which type of coal has the highest carbon concentration (85–95%) and highest calorific energy value?",
    options: ["Peat", "Lignite", "Bituminous", "Anthracite"],
    correctIndex: 3,
    explanation: "Anthracite has the highest carbon content (85–95%), highest calorific value (>7,500 kcal/kg), and burns with a smokeless flame.",
    topic: "Coal Properties",
  },
  {
    id: 14,
    question: "On 1 November 1975, Central Coalfields Limited (CCL, HQ Ranchi) was formed largely out of which predecessor PSU?",
    options: ["National Coal Development Corporation (NCDC)", "Singareni Collieries (SCCL)", "Coal Mines Authority Limited (CMAL)", "Hindustan Zinc Limited"],
    correctIndex: 0,
    explanation: "CCL was created on 1 November 1975 from the nationalized National Coal Development Corporation (NCDC) and manages Bokaro and Karanpura fields.",
    topic: "Incorporation Date",
  },
  {
    id: 15,
    question: "Which state is the largest producer of Lignite (Brown Coal) in India, hosting the Neyveli lignite mines?",
    options: ["Gujarat", "Rajasthan", "Tamil Nadu", "Odisha"],
    correctIndex: 2,
    explanation: "Tamil Nadu accounts for over 80% of India's lignite reserves and production, centered at Neyveli (operated by NLC India Ltd).",
    topic: "Coal Properties",
  },
];
