import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCategories, getTopics } from "../api/endpoints";
import { FiChevronRight, FiX, FiHash, FiBook, FiFileText } from "react-icons/fi";

const COLORS = [
  { bg: "bg-violet-100 dark:bg-violet-950/40", text: "text-violet-600 dark:text-violet-400", dot: "bg-violet-500" },
  { bg: "bg-cyan-100 dark:bg-cyan-950/40", text: "text-cyan-600 dark:text-cyan-400", dot: "bg-cyan-500" },
  { bg: "bg-rose-100 dark:bg-rose-950/40", text: "text-rose-600 dark:text-rose-400", dot: "bg-rose-500" },
  { bg: "bg-emerald-100 dark:bg-emerald-950/40", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  { bg: "bg-amber-100 dark:bg-amber-950/40", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
  { bg: "bg-pink-100 dark:bg-pink-950/40", text: "text-pink-600 dark:text-pink-400", dot: "bg-pink-500" },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const [categories, setCategories] = useState([]);
  const [topicsMap, setTopicsMap] = useState({});
  const [openCats, setOpenCats] = useState([]);
  const { topicId } = useParams();

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
  }, []);

  const toggle = async (catId) => {
    setOpenCats((p) => p.includes(catId) ? p.filter((x) => x !== catId) : [...p, catId]);
    if (!topicsMap[catId]) {
      const res = await getTopics(catId);
      setTopicsMap((p) => ({ ...p, [catId]: res.data }));
    }
  };

  const SidebarInner = () => (
    <div className="flex flex-col h-full px-3 py-4 gap-1">
      {/* Section label */}
      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 dark:text-slate-600 px-2 mb-2">
        Documentation
      </p>

      {categories.map((cat, i) => {
        const c = COLORS[i % COLORS.length];
        const open = openCats.includes(cat.id);
        return (
          <div key={cat.id}>
            <button
              onClick={() => toggle(cat.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-semibold transition-all group ${
                open
                  ? "text-gray-900 dark:text-white bg-white dark:bg-white/5 shadow-sm shadow-gray-200/60 dark:shadow-black/20 border border-gray-100 dark:border-transparent"
                  : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              <span className={`w-6 h-6 rounded-lg ${c.bg} ${c.text} flex items-center justify-center shrink-0 text-xs`}>
                <FiBook size={12} />
              </span>
              <span className="flex-1 text-left truncate">{cat.name}</span>
              <FiChevronRight
                size={14}
                className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-90 text-indigo-500" : ""}`}
              />
            </button>

            {open && topicsMap[cat.id] && (
              <div className="ml-4 mt-0.5 mb-1 pl-3 border-l-2 border-gray-200 dark:border-white/[0.06] space-y-0.5">
                {topicsMap[cat.id].map((topic) => {
                  const active = String(topic.id) === topicId;
                  return (
                    <Link
                      key={topic.id}
                      to={`/docs/${cat.id}/${topic.id}`}
                      onClick={onClose}
                      className={`flex items-center gap-2 text-[12.5px] px-2.5 py-1.5 rounded-lg transition-all ${
                        active
                          ? "nav-active"
                          : "text-gray-500 dark:text-slate-500 hover:text-gray-800 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-white/5"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${active ? "bg-white" : c.dot}`}></span>
                      <span className="truncate">{topic.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Bottom badge */}
      <div className="mt-auto pt-3 border-t border-gray-200/60 dark:border-white/[0.04]">
        <div className="px-2.5 py-2 rounded-xl bg-gradient-to-br from-indigo-50/80 to-purple-50/40 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100/50 dark:border-indigo-900/30">
          <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">DocuHub v1.0</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Modern docs platform 🚀</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-gray-200/70 dark:border-white/[0.04] h-[calc(100vh-56px)] sticky top-14 overflow-y-auto bg-white/50 dark:bg-transparent">
        <SidebarInner />
      </aside>

      {/* Mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-[#0d0d1a] shadow-2xl overflow-y-auto animate-slide-in">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-200/60 dark:border-white/5">
              <span className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[11px]">📘</div>
                DocuHub
              </span>
              <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition">
                <FiX size={16} />
              </button>
            </div>
            <SidebarInner />
          </aside>
        </div>
      )}
    </>
  );
}
