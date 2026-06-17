import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTopic, getCategory, getDocuments, getComments } from "../api/endpoints";
import { FiChevronRight, FiHome, FiFileText, FiArrowRight, FiClock, FiMessageSquare } from "react-icons/fi";

export default function TopicPage() {
  const { categoryId, topicId } = useParams();
  const [topic, setTopic] = useState(null);
  const [category, setCategory] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getTopic(topicId),
      getCategory(categoryId),
      getDocuments({ topic_id: topicId, status: "published" }),
    ]).then(async ([t, c, d]) => {
      setTopic(t.data);
      setCategory(c.data);
      setDocuments(d.data);
      setLoading(false);
      // fetch comment counts
      const counts = {};
      await Promise.all(d.data.map(async (doc) => {
        const res = await getComments(doc.id);
        counts[doc.id] = res.data.length;
      }));
      setCommentCounts(counts);
    });
  }, [topicId, categoryId]);

  if (loading) return (
    <div className="space-y-4 animate-pulse max-w-3xl">
      <div className="skeleton h-8 w-1/3 rounded-xl"></div>
      <div className="skeleton h-4 w-1/2 rounded-lg"></div>
      <div className="skeleton h-20 rounded-2xl mt-6"></div>
      <div className="skeleton h-20 rounded-2xl"></div>
    </div>
  );

  return (
    <div className="max-w-3xl animate-fade-up">
      <nav className="flex items-center gap-1.5 text-[12px] text-slate-400 mb-6 flex-wrap">
        <Link to="/" className="flex items-center gap-1 hover:text-indigo-500 transition"><FiHome size={12} /> Home</Link>
        <FiChevronRight size={11} />
        <Link to={`/category/${categoryId}`} className="hover:text-indigo-500 transition">{category?.name}</Link>
        <FiChevronRight size={11} />
        <span className="text-slate-700 dark:text-slate-300 font-medium">{topic.name}</span>
      </nav>

      <div className="mb-8 pb-6 border-b border-slate-200/60 dark:border-white/[0.05]">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{topic.name}</h1>
        {topic.description && <p className="text-slate-500 dark:text-slate-400 text-[15px]">{topic.description}</p>}
        <div className="mt-3">
          <span className="text-xs bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 text-slate-500 px-2.5 py-1 rounded-full font-medium">
            {documents.length} article{documents.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {documents.map((doc) => (
          <Link
            key={doc.id}
            to={`/docs/${categoryId}/${topicId}/${doc.id}`}
            className="group flex items-center gap-4 bg-white dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] rounded-2xl px-5 py-4 hover:border-indigo-300 dark:hover:border-indigo-700/50 hover:shadow-lg hover:shadow-indigo-100/50 hover:-translate-y-0.5 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center text-indigo-500 shrink-0">
              <FiFileText size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[14px] text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition truncate">{doc.title}</h3>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <FiClock size={10} /> {new Date(doc.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
                {commentCounts[doc.id] > 0 && (
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <FiMessageSquare size={10} /> {commentCounts[doc.id]} comment{commentCounts[doc.id] !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
            <FiArrowRight size={15} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all shrink-0" />
          </Link>
        ))}
        {documents.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <FiFileText size={32} className="mx-auto mb-3 opacity-30" />
            <p>No published documents yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
