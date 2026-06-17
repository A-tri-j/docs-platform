import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiFolder, FiBookOpen, FiFileText, FiTag, FiArrowRight, FiTrendingUp } from "react-icons/fi";
import { getCategories, getTopics, getDocuments, getTags } from "../../api/endpoints";

export default function Dashboard() {
  const [stats, setStats] = useState({ categories: 0, topics: 0, documents: 0, tags: 0 });
  const [recentDocs, setRecentDocs] = useState([]);

  useEffect(() => {
    Promise.all([getCategories(), getTopics(), getDocuments(), getTags()]).then(
      ([cats, topics, docs, tags]) => {
        setStats({
          categories: cats.data.length,
          topics: topics.data.length,
          documents: docs.data.length,
          tags: tags.data.length,
        });
        setRecentDocs(docs.data.slice(-5).reverse());
      }
    );
  }, []);

  const cards = [
    { label: "Categories", value: stats.categories, icon: <FiFolder />, gradient: "from-indigo-500 to-purple-500", to: "/admin/categories", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
    { label: "Topics", value: stats.topics, icon: <FiBookOpen />, gradient: "from-cyan-500 to-blue-500", to: "/admin/topics", bg: "bg-cyan-50 dark:bg-cyan-900/20" },
    { label: "Documents", value: stats.documents, icon: <FiFileText />, gradient: "from-emerald-500 to-teal-500", to: "/admin/documents", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Tags", value: stats.tags, icon: <FiTag />, gradient: "from-amber-500 to-orange-400", to: "/admin/tags", bg: "bg-amber-50 dark:bg-amber-900/20" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10">
          <p className="text-indigo-300 text-sm font-semibold mb-1">Welcome back 👋</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">DocuHub Admin Panel</h2>
          <p className="text-white/60 text-sm">Manage your documentation, categories, topics and more.</p>
        </div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute right-20 bottom-0 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"></div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className={`group ${card.bg} border border-slate-200/60 dark:border-gray-700/50 rounded-2xl p-4 sm:p-5 hover:shadow-lg transition-all hover:-translate-y-0.5`}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white mb-3 text-lg shadow-sm group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{card.value}</p>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-0.5">{card.label}</p>
            <span className="text-xs text-indigo-500 flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition">
              Manage <FiArrowRight size={11} />
            </span>
          </Link>
        ))}
      </div>

      {/* Recent documents */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-gray-800">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiTrendingUp className="text-indigo-500" /> Recent Documents
          </h3>
          <Link to="/admin/documents" className="text-xs text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1">
            View all <FiArrowRight size={11} />
          </Link>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-gray-800">
          {recentDocs.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-8">No documents yet.</p>
          )}
          {recentDocs.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-gray-800 flex items-center justify-center text-indigo-500">
                  <FiFileText size={15} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{doc.title}</p>
                  <p className="text-xs text-slate-400">{new Date(doc.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                doc.status === "published"
                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-gray-400"
              }`}>
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
