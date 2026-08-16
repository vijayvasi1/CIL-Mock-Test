import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Building2,
  Calendar,
  MapPin,
  Flame,
  Layers,
  BarChart3,
  Sparkles,
  Award,
  Globe2,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Info,
  Zap,
  Tag,
  Share2,
  Download,
  X,
  ExternalLink,
  ShieldCheck,
  Fuel,
} from "lucide-react";
import {
  CIL_SUBSIDIARIES_DATA,
  COAL_CLASSIFICATION_DATA,
  COAL_RESERVE_STATISTICS,
  NATIONAL_INITIATIVES,
  CoalSubsidiaryItem,
  CoalClassificationItem,
  CoalReserveStat,
  NationalInitiative,
} from "../data/coalKnowledgeData";

interface CoalKnowledgeBaseProps {
  onStartCustomQuiz?: (topic: string) => void;
}

export const CoalKnowledgeBase: React.FC<CoalKnowledgeBaseProps> = ({ onStartCustomQuiz }) => {
  const [activeTab, setActiveTab] = useState<
    "subsidiaries" | "classification" | "reserves" | "initiatives" | "gondwana_tertiary"
  >("subsidiaries");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubsidiary, setSelectedSubsidiary] = useState<CoalSubsidiaryItem | null>(null);
  const [selectedClassification, setSelectedClassification] = useState<CoalClassificationItem | null>(null);
  const [selectedInitiative, setSelectedInitiative] = useState<NationalInitiative | null>(null);

  // Filtered Subsidiaries
  const filteredSubsidiaries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return CIL_SUBSIDIARIES_DATA;
    return CIL_SUBSIDIARIES_DATA.filter((sub) => {
      return (
        sub.shortName.toLowerCase().includes(q) ||
        sub.fullName.toLowerCase().includes(q) ||
        sub.headquarters.toLowerCase().includes(q) ||
        sub.formationDate.toLowerCase().includes(q) ||
        sub.formationYear.toString().includes(q) ||
        sub.states.some((s) => s.toLowerCase().includes(q)) ||
        sub.majorCoalfields.some((cf) => cf.toLowerCase().includes(q)) ||
        sub.keyFacts.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  // Filtered Classifications
  const filteredClassifications = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return COAL_CLASSIFICATION_DATA;
    return COAL_CLASSIFICATION_DATA.filter((c) => {
      return (
        c.type.toLowerCase().includes(q) ||
        c.carbonContent.toLowerCase().includes(q) ||
        c.calorificValue.toLowerCase().includes(q) ||
        c.cokingProperty.toLowerCase().includes(q) ||
        c.indianOccurrence.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  // Filtered Reserves
  const filteredReserves = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return COAL_RESERVE_STATISTICS;
    return COAL_RESERVE_STATISTICS.filter((r) => {
      return (
        r.state.toLowerCase().includes(q) ||
        r.majorCoalfields.some((cf) => cf.toLowerCase().includes(q)) ||
        r.keySubsidiaries.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  // Filtered Initiatives
  const filteredInitiatives = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return NATIONAL_INITIATIVES;
    return NATIONAL_INITIATIVES.filter((init) => {
      return (
        init.title.toLowerCase().includes(q) ||
        init.outlay.toLowerCase().includes(q) ||
        init.description.toLowerCase().includes(q) ||
        init.keyHighlights.some((h) => h.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 350, damping: 28 },
    },
    exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15 } },
  };

  return (
    <div className="space-y-6">
      {/* Knowledge Base Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 border border-amber-500/30 rounded-2xl p-6 text-white shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-2">
              <Fuel className="w-3.5 h-3.5" />
              Interactive Coal Knowledge Base & High-Yield Factsheets
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              CIL Subsidiaries, Coal Classification & National Statistics
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Explore exhaustive factual profiles of all 10 CIL entities, exact dates of incorporation, corporate headquarters,
              coal classification chemistry (Anthracite to Peat), state reserves, and National Gasification initiatives.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="p-3 bg-slate-800/90 border border-amber-500/30 rounded-xl text-center">
              <div className="text-xl font-black text-amber-400">10</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">CIL Units</div>
            </div>
            <div className="p-3 bg-slate-800/90 border border-amber-500/30 rounded-xl text-center">
              <div className="text-xl font-black text-emerald-400">86+ BT</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Top Reserves (JH)</div>
            </div>
            <div className="p-3 bg-slate-800/90 border border-amber-500/30 rounded-xl text-center">
              <div className="text-xl font-black text-indigo-400">100 MT</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Gasification 2030</div>
            </div>
          </div>
        </div>

        {/* Search Bar & Tab Selectors */}
        <div className="pt-3 border-t border-slate-800 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by company (BCCL, WCL, SECL), HQ (Dhanbad, Nagpur), coalfield (Jharia, Korba), year (1972-2009), or coal rank..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setActiveTab("subsidiaries")}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "subsidiaries"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>CIL Subsidiaries ({filteredSubsidiaries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("classification")}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "classification"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Coal Classification & Ranks</span>
            </button>

            <button
              onClick={() => setActiveTab("reserves")}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "reserves"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>State-wise Reserves & Stats</span>
            </button>

            <button
              onClick={() => setActiveTab("gondwana_tertiary")}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "gondwana_tertiary"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Gondwana vs Tertiary Coals</span>
            </button>

            <button
              onClick={() => setActiveTab("initiatives")}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "initiatives"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>National Gasification & FMC</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: CIL SUBSIDIARIES (10 Entities) */}
      {activeTab === "subsidiaries" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-500" />
              <span>CIL Subsidiaries & Operational Entities (1972–2009)</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Showing {filteredSubsidiaries.length} of 10 entities
            </span>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredSubsidiaries.map((item) => (
              <motion.div
                key={item.id}
                variants={cardVariants}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden cursor-pointer"
                onClick={() => setSelectedSubsidiary(item)}
              >
                {/* Accent top stripe */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 group-hover:h-1.5 transition-all" />

                <div className="space-y-3">
                  {/* Top Row: Short Name Badge & Year */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg font-black text-sm bg-amber-500 text-slate-950 shadow-xs">
                        {item.shortName}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800">
                      <Calendar className="w-3 h-3 text-amber-500" />
                      <span>{item.formationYear}</span>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base leading-snug group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
                      {item.fullName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Incorporated: <span className="font-semibold text-slate-700 dark:text-slate-200">{item.formationDate}</span>
                    </p>
                  </div>

                  {/* Headquarters & States */}
                  <div className="space-y-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">HQ: </span>
                        <span className="text-slate-900 dark:text-slate-100 font-semibold">{item.headquarters}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <Layers className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">Coalfields: </span>
                        <span className="text-slate-700 dark:text-slate-300">{item.majorCoalfields.join(", ")}</span>
                      </div>
                    </div>
                  </div>

                  {/* High Yield Key Fact */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {item.keyFacts}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-800 dark:text-amber-400 group-hover:underline flex items-center gap-1">
                    View Complete Profile <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">
                    {item.states.join(" • ")}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* TAB 2: COAL CLASSIFICATION & CHEMICAL PROPERTIES (With smooth entrance animations) */}
      {activeTab === "classification" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Coal Ranks & Chemical Composition (Anthracite → Peat)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ranked by metamorphism degree, carbon concentration, and Gross Calorific Value (GCV).
              </p>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredClassifications.map((item) => (
                <motion.div
                  key={item.type}
                  layout
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  onClick={() => setSelectedClassification(item)}
                  className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-500 rounded-2xl p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4 cursor-pointer relative overflow-hidden group"
                >
                  {/* Top Rank Badge */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-xs font-black bg-slate-900 dark:bg-slate-800 text-amber-400 border border-amber-500/30">
                      Rank #{item.rank}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${item.badgeClass}`}>
                      {item.type.split(" ")[0]}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
                      {item.type}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Chemical Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 rounded-xl">
                      <div className="text-[10px] font-extrabold uppercase text-amber-900 dark:text-amber-400">
                        Carbon Content
                      </div>
                      <div className="text-sm font-black text-amber-950 dark:text-amber-200 mt-0.5">
                        {item.carbonContent}
                      </div>
                    </div>

                    <div className="p-2.5 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 rounded-xl">
                      <div className="text-[10px] font-extrabold uppercase text-indigo-900 dark:text-indigo-400">
                        Calorific Value
                      </div>
                      <div className="text-sm font-black text-indigo-950 dark:text-indigo-200 mt-0.5">
                        {item.calorificValue}
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                      <div className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                        Moisture %
                      </div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {item.moistureContent}
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                      <div className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                        Ash & Volatiles
                      </div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {item.ashContent}
                      </div>
                    </div>
                  </div>

                  {/* Indian Occurrence */}
                  <div className="p-2.5 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl text-xs space-y-1">
                    <div className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      <span>Indian Occurrence:</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-medium line-clamp-2">
                      {item.indianOccurrence}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-800 dark:text-amber-400 group-hover:underline flex items-center gap-1">
                      Full Chemical Details <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      {item.cokingProperty.split(" ")[0]}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Quick Summary Table for Classification */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Comparative Technical Matrix (Anthracite to Peat)</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                  <tr>
                    <th className="p-3">Rank / Coal Type</th>
                    <th className="p-3">Carbon Content</th>
                    <th className="p-3">Gross Calorific Value (GCV)</th>
                    <th className="p-3">Moisture %</th>
                    <th className="p-3">Coking Capacity</th>
                    <th className="p-3">Key Indian Locations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {COAL_CLASSIFICATION_DATA.map((row) => (
                    <tr key={row.type} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                        {row.type}
                      </td>
                      <td className="p-3 font-semibold text-amber-800 dark:text-amber-400">
                        {row.carbonContent}
                      </td>
                      <td className="p-3 font-semibold text-indigo-800 dark:text-indigo-400">
                        {row.calorificValue}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">
                        {row.moistureContent}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">
                        {row.cokingProperty}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        {row.indianOccurrence}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STATE-WISE RESERVES & STATISTICS */}
      {activeTab === "reserves" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-500" />
                <span>State-Wise Geological Coal Reserves in India (GSI Data)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total Indian Geological Reserves exceed 360+ Billion Tonnes across Gondwana & Tertiary basins.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Top State Cards */}
            <div className="lg:col-span-2 space-y-3">
              {filteredReserves.map((stat) => (
                <div
                  key={stat.state}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs hover:border-amber-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shrink-0">
                      #{stat.rank}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                          {stat.state}
                        </h4>
                        <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[10px] font-extrabold rounded">
                          {stat.percentOfTotal}% of India
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Coalfields: <span className="text-slate-700 dark:text-slate-300 font-medium">{stat.majorCoalfields.join(", ")}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                    <div className="text-right">
                      <div className="text-base font-black text-slate-900 dark:text-slate-100">
                        {stat.geologicalReservesBT} BT
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Geological Reserves</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {stat.keySubsidiaries.map((sub) => (
                        <span
                          key={sub}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-bold rounded border border-slate-200 dark:border-slate-700"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stat Summary Sidebar */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-slate-950 shadow-md space-y-3">
                <h4 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Key Production Facts</span>
                </h4>
                <ul className="space-y-2 text-xs font-semibold text-slate-950/90 leading-snug">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span><strong>Highest Reserves:</strong> Jharkhand (#1 with 86.2 BT)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span><strong>Highest Production:</strong> Odisha (MCL) &amp; Chhattisgarh (SECL) produce &gt;50% of CIL output</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span><strong>Prime Coking Coal:</strong> Jharia Coalfield (BCCL, Jharkhand) is India&apos;s sole major reserve</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span><strong>Largest Opencast Mine:</strong> Gevra Mega OCP in SECL (capacity &gt;70 MTPA)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">
                  CIL Production Trajectory
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">FY 2024–25 Actual</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">~773.6 MT</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">FY 2025–26 Target</span>
                    <span className="font-bold text-amber-800 dark:text-amber-400">1.15 Billion Tonnes</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-slate-600 dark:text-slate-400">2030 National Target</span>
                    <span className="font-bold text-emerald-800 dark:text-emerald-400">1.6 Billion Tonnes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GONDWANA VS TERTIARY COALS */}
      {activeTab === "gondwana_tertiary" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-amber-800 dark:text-amber-400 tracking-wider">Geological Formations</span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                Gondwana Coalfields vs Tertiary Coalfields of India
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Over 98% of India&apos;s coal belongs to the Permian Gondwana period, while ~2% belongs to the younger Tertiary period.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gondwana Block */}
              <div className="p-5 bg-amber-50/60 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-800/80 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
                    Gondwana Coals (98% Reserves)
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-400">~250 Million Years</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Geological Age:</strong> Upper Carboniferous to Permian age (~250 to 300 million years old).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>River Basins:</strong> Damodar Valley, Son Valley, Mahanadi Valley, Wardha Valley, Godavari Valley, and Koel-Brahmani Basins.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Ash Content:</strong> High Ash (15% to 45%) due to drift origin of vegetal deposits.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Sulphur Content:</strong> Very Low Sulphur (&lt; 0.5% to 0.8%), making them environmentally safer for combustion.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Moisture:</strong> Low to Moderate moisture content.</span>
                  </li>
                </ul>
              </div>

              {/* Tertiary Block */}
              <div className="p-5 bg-indigo-50/60 dark:bg-indigo-950/20 border-2 border-indigo-300 dark:border-indigo-800/80 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white">
                    Tertiary Coals (2% Reserves)
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-800 dark:text-indigo-400">~15–60 Million Years</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Geological Age:</strong> Eocene, Oligocene, and Miocene epochs (~15 to 60 million years old).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Geographical States:</strong> Assam (Makum), Meghalaya (Garo, Khasi, Jaintia hills), Arunachal Pradesh (Namchik-Namphuk), Nagaland, and J&K (Kalakot).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Ash Content:</strong> Very Low Ash (&lt; 3% to 6%), high volatile matter.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Sulphur Content:</strong> Extremely High Sulphur (2% to 7%), predominantly in organic and pyritic forms.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Applications:</strong> Good coking properties but corrosive due to high sulphur; ideal for local tea processing & cement kilns.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NATIONAL GASIFICATION & FMC */}
      {activeTab === "initiatives" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Clean Coal Missions & Digital Transformation</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Major policy initiatives, First Mile Connectivity (FMC), UTTAM app, and PRAKASH portal.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredInitiatives.map((init) => (
              <div
                key={init.id}
                onClick={() => setSelectedInitiative(init)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      {init.status}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                      Target: {init.targetYear}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
                    {init.title}
                  </h4>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs flex items-center justify-between font-semibold">
                    <span className="text-slate-500 dark:text-slate-400">Financial Outlay / Scope:</span>
                    <span className="text-slate-900 dark:text-slate-100 font-bold">{init.outlay}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {init.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="text-[10px] font-extrabold uppercase text-slate-400">Core Highlights:</div>
                    {init.keyHighlights.slice(0, 3).map((h, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-amber-800 dark:text-amber-400 font-bold group-hover:underline">
                  <span>View Full Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Subsidiary Deep Dive */}
      {selectedSubsidiary && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-fade-in space-y-4">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-amber-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-base">
                  {selectedSubsidiary.shortName}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg leading-tight text-white">
                    {selectedSubsidiary.fullName}
                  </h3>
                  <p className="text-xs text-amber-300">
                    Formed {selectedSubsidiary.formationDate} • {selectedSubsidiary.category}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubsidiary(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-800 dark:text-slate-200 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Headquarters</div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5">
                    {selectedSubsidiary.headquarters}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Operating States</div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5">
                    {selectedSubsidiary.states.join(", ")}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Major Coalfields & Basins
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSubsidiary.majorCoalfields.map((cf) => (
                    <span
                      key={cf}
                      className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 font-bold rounded-lg border border-amber-200 dark:border-amber-800 text-xs"
                    >
                      {cf}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-amber-900 dark:text-amber-400">
                  High-Yield Institutional Profile
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {selectedSubsidiary.keyFacts}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Flagship Mines & Key Operations
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSubsidiary.flagshipMines.map((m) => (
                    <span
                      key={m}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold rounded-lg text-xs"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1">
                <div className="font-bold text-slate-700 dark:text-slate-300">Technology & Mechanization Level:</div>
                <div className="text-slate-600 dark:text-slate-400">{selectedSubsidiary.mechanizationLevel}</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setSelectedSubsidiary(null)}
                className="px-5 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Classification Deep Dive */}
      {selectedClassification && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-fade-in space-y-4">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black">
                  Rank #{selectedClassification.rank}
                </span>
                <h3 className="font-extrabold text-lg text-white mt-1">
                  {selectedClassification.type}
                </h3>
              </div>
              <button
                onClick={() => setSelectedClassification(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-800 dark:text-slate-200 max-h-[70vh] overflow-y-auto">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {selectedClassification.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800">
                  <div className="text-[10px] font-bold text-amber-900 dark:text-amber-400 uppercase">Carbon %</div>
                  <div className="text-sm font-black text-amber-950 dark:text-amber-200 mt-0.5">
                    {selectedClassification.carbonContent}
                  </div>
                </div>

                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800">
                  <div className="text-[10px] font-bold text-indigo-900 dark:text-indigo-400 uppercase">GCV (kcal/kg)</div>
                  <div className="text-sm font-black text-indigo-950 dark:text-indigo-200 mt-0.5">
                    {selectedClassification.calorificValue}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Moisture</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {selectedClassification.moistureContent}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Ash %</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {selectedClassification.ashContent}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-slate-400">Coking Properties</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {selectedClassification.cokingProperty}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-slate-400">Indian Occurrence</div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {selectedClassification.indianOccurrence}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Primary Industrial Uses
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedClassification.primaryUses.map((u) => (
                    <span
                      key={u}
                      className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 font-bold rounded-lg text-xs border border-amber-200 dark:border-amber-800"
                    >
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setSelectedClassification(null)}
                className="px-5 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Initiative Deep Dive */}
      {selectedInitiative && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-fade-in space-y-4">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-emerald-950 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500 text-white font-bold">
                  {selectedInitiative.status}
                </span>
                <h3 className="font-extrabold text-lg text-white mt-1">
                  {selectedInitiative.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInitiative(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-800 dark:text-slate-200 max-h-[70vh] overflow-y-auto">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
                <span className="text-slate-500">Target Year:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedInitiative.targetYear}</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
                <span className="text-slate-500">Budget / Financial Outlay:</span>
                <span className="font-bold text-emerald-800 dark:text-emerald-400">{selectedInitiative.outlay}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {selectedInitiative.description}
              </p>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2">
                <div className="text-[10px] font-extrabold uppercase text-emerald-900 dark:text-emerald-400">
                  Key Strategic Highlights
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {selectedInitiative.keyHighlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setSelectedInitiative(null)}
                className="px-5 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
