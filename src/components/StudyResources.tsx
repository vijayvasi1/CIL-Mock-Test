import React, { useState } from "react";
import {
  BookOpen,
  FileText,
  Download,
  ExternalLink,
  Search,
  CheckCircle2,
  Bookmark,
  Printer,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Globe,
  Share2,
  Award,
  Clock,
  ArrowUpRight,
  X,
  FileCode,
  ShieldCheck,
  Fuel,
  Zap,
} from "lucide-react";
import { STUDY_RESOURCES } from "../data/studyResourcesData";
import { StudyResourceItem } from "../types";
import { CoalKnowledgeBase } from "./CoalKnowledgeBase";
import { CoalFactCheckQuiz } from "./CoalFactCheckQuiz";

interface StudyResourcesProps {
  onStartFullTest?: () => void;
}

export const StudyResources: React.FC<StudyResourcesProps> = ({ onStartFullTest }) => {
  const [resourceTab, setResourceTab] = useState<"knowledge_base" | "fact_check" | "vault">("knowledge_base");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeReadingItem, setActiveReadingItem] = useState<StudyResourceItem | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const categories = [
    "all",
    "Official Syllabus",
    "Coal Sector & PSU",
    "CS & IT Core",
    "Aptitude & Reasoning",
    "General English",
    "Past Papers",
  ];

  const filteredResources = STUDY_RESOURCES.filter((item) => {
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchHighlights = item.keyHighlights.some((h) => h.toLowerCase().includes(q));
      const matchContent = (item.contentMarkdown || "").toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchHighlights && !matchContent) return false;
    }
    return true;
  });

  // Handle Offline Download (HTML/Markdown Document Export)
  const handleDownloadResource = (item: StudyResourceItem) => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${item.title} - CIL MT Study Material</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 40px auto; padding: 0 20px; }
    h1 { color: #0f172a; border-bottom: 2px solid #f59e0b; padding-bottom: 8px; }
    h2 { color: #1e293b; margin-top: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
    h3 { color: #334155; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-size: 14px; }
    th { background: #f1f5f9; font-weight: bold; }
    ul, ol { padding-left: 20px; }
    li { margin-bottom: 6px; }
    .badge { display: inline-block; padding: 4px 8px; background: #fef3c7; color: #92400e; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="badge">CIL MT (Systems) Recruitment • Official Study Reference</div>
  <h1>${item.title}</h1>
  <p><strong>Category:</strong> ${item.category} | <strong>Estimated Read Time:</strong> ${item.estimatedReadTime}</p>
  <div style="background: #f8fafc; border-left: 4px solid #f59e0b; padding: 12px 16px; margin: 16px 0;">
    <strong>High-Yield Highlights:</strong>
    <ul>
      ${item.keyHighlights.map((h) => `<li>${h}</li>`).join("")}
    </ul>
  </div>
  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
  <div>
    ${(item.contentMarkdown || "")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/\n\n/gim, "<br/><br/>")}
  </div>
  <div class="footer">
    Downloaded from CIL MT (Systems) Computer-Based Online Examination Preparation Engine.
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.title.replace(/[^a-zA-Z0-9]/g, "_")}_CIL_MT.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadNotice(`✓ Downloaded "${item.title}" for offline study! You can open or print it as PDF anytime.`);
    setTimeout(() => setDownloadNotice(null), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Download Alert Toast */}
      {downloadNotice && (
        <div className="bg-emerald-500/20 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-200 px-4 py-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold shadow-md animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{downloadNotice}</span>
          </div>
          <button
            onClick={() => setDownloadNotice(null)}
            className="p-1 text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 font-bold cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Top Selector Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-xs flex flex-wrap items-center gap-2">
        <button
          onClick={() => setResourceTab("knowledge_base")}
          className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            resourceTab === "knowledge_base"
              ? "bg-amber-500 text-slate-950 shadow-sm"
              : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          }`}
        >
          <Fuel className="w-4 h-4" />
          <span>Coal Knowledge Base & Factsheets</span>
        </button>

        <button
          onClick={() => setResourceTab("fact_check")}
          className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            resourceTab === "fact_check"
              ? "bg-amber-500 text-slate-950 shadow-sm"
              : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Coal Fact Check (Quick-Fire Drill)</span>
        </button>

        <button
          onClick={() => setResourceTab("vault")}
          className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            resourceTab === "vault"
              ? "bg-amber-500 text-slate-950 shadow-sm"
              : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Offline Study Notes & Syllabi</span>
        </button>
      </div>

      {/* VIEW 1: COAL KNOWLEDGE BASE */}
      {resourceTab === "knowledge_base" && (
        <CoalKnowledgeBase onStartCustomQuiz={() => setResourceTab("fact_check")} />
      )}

      {/* VIEW 2: COAL FACT CHECK QUICK-FIRE QUIZ */}
      {resourceTab === "fact_check" && (
        <div className="space-y-4">
          <CoalFactCheckQuiz onStartFullTest={onStartFullTest} />
        </div>
      )}

      {/* VIEW 3: OFFLINE STUDY NOTES & SYLLABI VAULT */}
      {resourceTab === "vault" && (
        <div className="space-y-6">
          {/* Hero Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 text-white shadow-md space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  Curated Offline Study Hub & PDF Repository
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                  CIL MT (Systems) Study Resources & Reference Vault
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
                  Access official Coal India Limited examination syllabi, Maharatna PSU factsheets, high-yield CS/IT
                  formula sheets, and quantitative deduction guides. Read online or export for offline reference.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="https://www.coalindia.in"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-600 flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>Official CIL Portal</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="pt-2 border-t border-slate-800 flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search syllabus, formulas, coal sector facts, or CS topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Quick Category Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                        : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    {cat === "all" ? "All Vaults" : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Official PSU Quick Reference Directory Banners */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <a
              href="https://www.coalindia.in/career-cil/"
              target="_blank"
              rel="noreferrer"
              className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 rounded-xl shadow-xs transition-all flex items-start justify-between group"
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase text-amber-600 tracking-wider">Official Noticeboard</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 mt-0.5">
                  CIL Career & MT Recruitment
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Latest official bulletins & updates</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 shrink-0" />
            </a>

            <a
              href="https://www.coal.gov.in"
              target="_blank"
              rel="noreferrer"
              className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-xl shadow-xs transition-all flex items-start justify-between group"
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase text-emerald-600 tracking-wider">Govt of India</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 mt-0.5">
                  Ministry of Coal Statistics
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Annual reports & production KPIs</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 shrink-0" />
            </a>

            <a
              href="https://cmpdi.co.in"
              target="_blank"
              rel="noreferrer"
              className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl shadow-xs transition-all flex items-start justify-between group"
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase text-indigo-600 tracking-wider">Technical Wing</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 mt-0.5">
                  CMPDIL Exploration Portal
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Mine planning & IT architecture</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 shrink-0" />
            </a>

            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-amber-500 text-slate-950 rounded-lg shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase text-amber-800 dark:text-amber-400 tracking-wider">Offline Access</div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">100% Offline Ready</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">Export as HTML/PDF</div>
              </div>
            </div>
          </div>

          {/* Main Grid of Curated Study Materials */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredResources.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4 transition-all"
              >
                <div className="space-y-3">
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-500" />
                      {item.estimatedReadTime}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base leading-snug">{item.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.description}</p>

                  {/* Key Bullet Highlights */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl p-3 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      High-Yield Core Takeaways:
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                      {item.keyHighlights.slice(0, 3).map((h, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-amber-500 font-bold shrink-0">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveReadingItem(item)}
                    className="flex-1 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Full Reference</span>
                  </button>

                  <button
                    onClick={() => handleDownloadResource(item)}
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                    title="Download offline document"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reader Modal for Full Document / PDF Text */}
      {activeReadingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col justify-between overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                      {activeReadingItem.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{activeReadingItem.estimatedReadTime}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-100 mt-0.5">
                    {activeReadingItem.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadResource(activeReadingItem)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                  title="Download offline document"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export Offline</span>
                </button>
                <button
                  onClick={() => setActiveReadingItem(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content Scroll Area */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200 leading-relaxed max-h-[70vh] scrollbar-thin">
              {/* Highlights Callout */}
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl space-y-2">
                <h4 className="font-extrabold text-amber-900 dark:text-amber-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Key Highlights & Must-Remember Rules
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300 pt-1">
                  {activeReadingItem.keyHighlights.map((h, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Formatted Content */}
              <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
                {activeReadingItem.contentMarkdown?.split("\n\n").map((para, i) => {
                  if (para.startsWith("# ")) {
                    return (
                      <h2 key={i} className="text-xl font-extrabold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
                        {para.replace("# ", "")}
                      </h2>
                    );
                  }
                  if (para.startsWith("## ")) {
                    return (
                      <h3 key={i} className="text-base font-bold text-amber-700 dark:text-amber-400 mt-4">
                        {para.replace("## ", "")}
                      </h3>
                    );
                  }
                  if (para.startsWith("### ")) {
                    return (
                      <h4 key={i} className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2">
                        {para.replace("### ", "")}
                      </h4>
                    );
                  }
                  if (para.startsWith("| ")) {
                    // Table rendering
                    const lines = para.split("\n").filter((l) => l.trim().length > 0);
                    const headerLine = lines[0];
                    const rowLines = lines.slice(2);
                    const headers = headerLine.split("|").map((h) => h.trim()).filter((h) => h.length > 0);

                    return (
                      <div key={i} className="overflow-x-auto my-3 border border-slate-200 dark:border-slate-800 rounded-lg">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                            <tr>
                              {headers.map((h, hIdx) => (
                                <th key={hIdx} className="p-2.5">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {rowLines.map((r, rIdx) => {
                              const cells = r.split("|").map((c) => c.trim()).filter((c) => c.length > 0);
                              return (
                                <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                  {cells.map((c, cIdx) => (
                                    <td key={cIdx} className="p-2.5 text-slate-700 dark:text-slate-300 font-medium">
                                      {c}
                                    </td>
                                  ))}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  return (
                    <div key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {para}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Offline study document prepared for CIL MT (Systems) 2025–2026.
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadResource(activeReadingItem)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download HTML / Print PDF</span>
                </button>
                <button
                  onClick={() => setActiveReadingItem(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
