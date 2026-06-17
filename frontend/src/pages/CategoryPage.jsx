import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCategory, getTopics } from "../api/endpoints";
import { FiChevronRight, FiHome, FiBookOpen, FiArrowRight } from "react-icons/fi";

export default function CategoryPage() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCategory(categoryId), getTopics(categoryId)]).then(([c, t]) => {
      setCategory(c.data); setTopics(t.data); setLoading(false);
    });
  }, [categoryId]);

  if (loading) return (
    <div className="space-y-4 animate-pulse max-w-3xl">
      <div className="skeleton h-8 w-1/2 rounded-xl"></div>
      <div className="skeleton h-4 w-2/3 rounded-lg"></div>
      <div className="skeleton h-24 rounded-2xl mt-6"></div>
      <div className="skeleton h-24 rounded-2xl"></div>
    </div>
  );

  return (
    <div className="max-w-3xl animate-fade-up">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[12px] text-slate-400 mb-6 flex-wrap">
        <Link to="/" className="flex items-center gap-1 hover:text-indigo-500 transition"><FiHome size={12} /> Home</Link>
        <FiChevronRight size={11} />
        <span className="text-gray-700 dark:text-slate-300 font-medium">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8 pb-6 border-b border-gray-200/70 dark:border-white/[0.05]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50">
            <FiBookOpen size={18} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">{category.name}</h1>
        </div>
        <p className="text-gray-500 dark:text-slate-400 text-[15px] ml-[52px]">{category.description}</p>
      </div>

      {/* Topics */}
      <div className="space-y-2.5">
        {topics.map((topic, i) => (
          <Link
            key={topic.id}
            to={`/docs/${categoryId}/${topic.id}`}
            className="group flex items-center gap-4 bg-white dark:bg-white/[0.03] border border-gray-200/70 dark:border-white/[0.06] rounded-2xl px-5 py-4 hover:border-indigo-300 dark:hover:border-indigo-700/50 hover:shadow-lg hover:shadow-gray-100/60 dark:hover:shadow-indigo-900/20 hover:-translate-y-0.5 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/70 dark:border-white/5 flex items-center justify-center text-gray-500 dark:text-slate-400 font-mono text-xs font-bold shrink-0">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[14px] text-gray-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition truncate">{topic.name}</h3>
              {topic.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{topic.description}</p>}
            </div>
            <FiArrowRight size={15} className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all shrink-0" />
          </Link>
        ))}
        {topics.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <FiBookOpen size={32} className="mx-auto mb-3 opacity-30" />
            <p>No topics yet in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
