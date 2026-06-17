import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX, FiFileText, FiArrowRight, FiCommand } from "react-icons/fi";
import { searchDocuments } from "../../api/endpoints";

function highlight(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded px-0.5">{part}</mark>
      : part
  );
}

export default function LiveSearch({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    const timer = setTimeout(() => {
      searchDocuments(query)
        .then((res) => setResults(res.data.slice(0, 8)))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (doc) => {
    navigate(`/document/${doc.id}`);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-700 overflow-hidden animate-fade-up">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-gray-800">
          <FiSearch size={18} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation..."
            className="flex-1 bg-transparent text-slate-800 dark:text-white text-sm outline-none placeholder:text-slate-400"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-600 transition">
              <FiX size={16} />
            </button>
          )}
          <kbd className="text-[10px] bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-400 px-1.5 py-0.5 rounded font-mono shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {loading && (
            <div className="px-4 py-6 text-center text-sm text-slate-400 animate-pulse">Searching...</div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-slate-500 text-sm">No results for "<span className="font-semibold text-indigo-500">{query}</span>"</p>
            </div>
          )}

          {results.map((doc) => (
            <button
              key={doc.id}
              onClick={() => handleSelect(doc)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center text-indigo-500 shrink-0">
                <FiFileText size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                  {highlight(doc.title, query)}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Document</p>
              </div>
              <FiArrowRight size={14} className="text-slate-300 group-hover:text-indigo-500 shrink-0" />
            </button>
          ))}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 border-t border-slate-100 dark:border-gray-800 flex items-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><kbd className="bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 px-1 rounded font-mono">↵</kbd> select</span>
          <span className="flex items-center gap-1"><kbd className="bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 px-1 rounded font-mono">ESC</kbd> close</span>
          <span className="flex items-center gap-1"><FiCommand size={10} /><kbd className="bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 px-1 rounded font-mono">K</kbd> open</span>
        </div>
      </div>
    </div>
  );
}
