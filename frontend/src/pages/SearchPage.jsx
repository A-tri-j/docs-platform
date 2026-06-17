import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchDocuments } from "../api/endpoints";
import { FiSearch, FiFileText, FiArrowRight } from "react-icons/fi";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (q) searchDocuments(q).then((res) => { setResults(res.data); setLoading(false); });
    else setLoading(false);
  }, [q]);

  return (
    <div className="max-w-3xl animate-fade-up">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
          Search results
        </h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm">
          {loading ? "Searching..." : `${results.length} result${results.length !== 1 ? "s" : ""} for `}
          {!loading && <span className="font-semibold text-indigo-500">"{q}"</span>}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => <div key={i} className="skeleton h-20 rounded-2xl"></div>)}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <FiSearch size={40} className="mx-auto mb-4 text-slate-300 dark:text-slate-700" />
          <p className="text-gray-500 font-semibold mb-1">No results found</p>
          <p className="text-gray-400 text-sm">Try a different keyword or browse the categories.</p>
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-500 text-sm font-semibold mt-4 hover:underline">
            Back to Home <FiArrowRight size={13} />
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {results.map((doc) => (
            <Link
              key={doc.id}
              to={`/document/${doc.id}`}
              className="group flex items-center gap-4 bg-white dark:bg-white/[0.03] border border-gray-200/70 dark:border-white/[0.06] rounded-2xl px-5 py-4 hover:border-indigo-300 dark:hover:border-indigo-700/50 hover:shadow-lg hover:shadow-gray-100/60 hover:-translate-y-0.5 transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center text-indigo-500 shrink-0">
                <FiFileText size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[14px] text-gray-800 dark:text-slate-200 group-hover:text-indigo-600 transition truncate">{doc.title}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Document</p>
              </div>
              <FiArrowRight size={15} className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
