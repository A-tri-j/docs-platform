import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../api/endpoints";
import { FiArrowRight, FiBookOpen, FiZap, FiSearch, FiCode } from "react-icons/fi";

const CAT_COLORS = [
  { from: "from-violet-500", to: "to-indigo-500", light: "bg-violet-50 dark:bg-violet-950/30", border: "border-violet-200/60 dark:border-violet-800/30", text: "text-violet-600 dark:text-violet-400", icon: "bg-violet-100 dark:bg-violet-900/50" },
  { from: "from-cyan-500", to: "to-blue-500", light: "bg-cyan-50 dark:bg-cyan-950/30", border: "border-cyan-200/60 dark:border-cyan-800/30", text: "text-cyan-600 dark:text-cyan-400", icon: "bg-cyan-100 dark:bg-cyan-900/50" },
  { from: "from-rose-500", to: "to-pink-500", light: "bg-rose-50 dark:bg-rose-950/30", border: "border-rose-200/60 dark:border-rose-800/30", text: "text-rose-600 dark:text-rose-400", icon: "bg-rose-100 dark:bg-rose-900/50" },
  { from: "from-emerald-500", to: "to-teal-500", light: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200/60 dark:border-emerald-800/30", text: "text-emerald-600 dark:text-emerald-400", icon: "bg-emerald-100 dark:bg-emerald-900/50" },
  { from: "from-amber-500", to: "to-orange-500", light: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200/60 dark:border-amber-800/30", text: "text-amber-600 dark:text-amber-400", icon: "bg-amber-100 dark:bg-amber-900/50" },
  { from: "from-fuchsia-500", to: "to-purple-500", light: "bg-fuchsia-50 dark:bg-fuchsia-950/30", border: "border-fuchsia-200/60 dark:border-fuchsia-800/30", text: "text-fuchsia-600 dark:text-fuchsia-400", icon: "bg-fuchsia-100 dark:bg-fuchsia-900/50" },
];

const FEATURES = [
  { icon: <FiBookOpen size={18} />, label: "Rich Docs", desc: "Markdown with syntax highlighting", color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/40" },
  { icon: <FiSearch size={18} />, label: "Full Search", desc: "Search across titles & content", color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-950/40" },
  { icon: <FiZap size={18} />, label: "Fast & Secure", desc: "JWT auth, optimized APIs", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/40" },
  { icon: <FiCode size={18} />, label: "Code Ready", desc: "Copy code, file attachments", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
];

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then((res) => { setCategories(res.data); setLoading(false); });
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-14">
      {/* Hero */}
      <div className="relative pt-4 pb-2">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200/50 dark:border-indigo-800/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          Modern Documentation Platform
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight mb-5">
          Everything you need,<br />
          <span className="gradient-text">beautifully organized.</span>
        </h1>

        <p className="text-gray-500 dark:text-slate-400 text-lg max-w-xl leading-relaxed mb-7">
          Guides, API references, and code examples — all in one place.
          Built for developers, by developers.
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          <Link to="#categories" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:from-indigo-600 hover:to-purple-600 transition shadow-lg shadow-indigo-300/30 dark:shadow-indigo-900/50">
            Browse Docs <FiArrowRight size={15} />
          </Link>
        </div>

        {/* Decorative glow */}
        <div className="absolute -top-8 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      </div>

      {/* Feature pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {FEATURES.map((f) => (
          <div key={f.label} className="flex items-center gap-2.5 bg-white dark:bg-white/[0.03] border border-gray-200/70 dark:border-white/[0.05] rounded-xl px-3 py-2.5 shadow-sm shadow-gray-100/50">
            <span className={`${f.bg} ${f.color} w-8 h-8 rounded-lg flex items-center justify-center shrink-0`}>{f.icon}</span>
            <div>
              <p className="text-xs font-bold text-gray-800 dark:text-slate-200">{f.label}</p>
              <p className="text-[10px] text-gray-400 leading-tight">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div id="categories">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-xl font-black text-gray-900 dark:text-white">Browse Categories</h2>
          <span className="text-xs bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 text-indigo-500 px-2.5 py-1 rounded-full font-semibold">
            {categories.length} available
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1,2].map((i) => <div key={i} className="skeleton h-40 rounded-2xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat, i) => {
              const c = CAT_COLORS[i % CAT_COLORS.length];
              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className={`group relative overflow-hidden ${c.light} border ${c.border} rounded-2xl p-5 hover:shadow-xl hover:shadow-gray-200/40 dark:hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-300`}
                >
                  {/* Top icon row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.from} ${c.to} flex items-center justify-center text-white shadow-lg`}>
                      <FiBookOpen size={20} />
                    </div>
                    <FiArrowRight
                      size={16}
                      className={`${c.text} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all`}
                    />
                  </div>

                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">{cat.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">{cat.description}</p>

                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${c.text}`}>
                    Explore docs <FiArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>

                  {/* Decorative bg circle */}
                  <div className={`absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br ${c.from} ${c.to} opacity-[0.08] rounded-full group-hover:opacity-[0.12] transition-opacity`}></div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
