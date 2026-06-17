import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  FiEye, FiPaperclip, FiMessageSquare, FiDownload, FiSend,
  FiList, FiChevronRight, FiHome, FiClock, FiCalendar,
  FiPrinter, FiShare2, FiThumbsUp, FiThumbsDown,
  FiChevronLeft, FiArrowRight, FiCheck, FiCopy
} from "react-icons/fi";
import {
  getDocument, recordView, getViewStats,
  getComments, addComment, getDocuments, getTopic, getCategory
} from "../api/endpoints";

// ---- Reading time ----
function readingTime(text = "") {
  const words = text.trim().split(/\s+/).length;
  const mins = Math.ceil(words / 200);
  return `${mins} min read`;
}

// ---- Copy button ----
function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handle} className="copy-btn flex items-center gap-1">
      {copied ? <><FiCheck size={11} /> Copied</> : <><FiCopy size={11} /> Copy</>}
    </button>
  );
}

// ---- Helpful widget ----
function HelpfulWidget({ docId }) {
  const key = `helpful_${docId}`;
  const [vote, setVote] = useState(() => localStorage.getItem(key) || null);

  const handleVote = (v) => {
    if (vote) return;
    setVote(v);
    localStorage.setItem(key, v);
  };

  return (
    <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-5 text-center">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
        Was this article helpful?
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => handleVote("yes")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition ${
            vote === "yes"
              ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30"
              : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-emerald-300 hover:text-emerald-600"
          }`}
        >
          <FiThumbsUp size={15} /> Yes, helpful!
        </button>
        <button
          onClick={() => handleVote("no")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition ${
            vote === "no"
              ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-200 dark:shadow-rose-900/30"
              : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-rose-300 hover:text-rose-600"
          }`}
        >
          <FiThumbsDown size={15} /> Not really
        </button>
      </div>
      {vote && (
        <p className="text-xs text-slate-400 mt-3">
          {vote === "yes" ? "🎉 Thanks for the feedback!" : "😔 We'll work on improving this."}
        </p>
      )}
    </div>
  );
}

export default function DocumentPage() {
  const { documentId, categoryId, topicId } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [views, setViews] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [headings, setHeadings] = useState([]);
  const [category, setCategory] = useState(null);
  const [topic, setTopic] = useState(null);
  const [allDocs, setAllDocs] = useState([]);
  const [shareMsg, setShareMsg] = useState(false);
  const [activeHeading, setActiveHeading] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    getDocument(documentId).then((res) => {
      const d = res.data;
      setDoc(d);
      // Extract headings
      const lines = (d.content || "").split("\n");
      setHeadings(lines
        .filter((l) => /^#{1,3} /.test(l))
        .map((l) => ({
          text: l.replace(/^#{1,3} /, ""),
          level: (l.match(/^#+/) || [""])[0].length,
          id: l.replace(/^#{1,3} /, "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        }))
      );
    });
    recordView(documentId);
    getViewStats(documentId).then((res) => setViews(res.data.total_views));
    getComments(documentId).then((res) => setComments(res.data));
    if (categoryId) getCategory(categoryId).then((res) => setCategory(res.data));
    if (topicId) {
      getTopic(topicId).then((res) => setTopic(res.data));
      getDocuments({ topic_id: topicId, status: "published" }).then((res) => setAllDocs(res.data));
    }
  }, [documentId]);

  // Active heading tracking
  useEffect(() => {
    const handler = () => {
      for (const h of [...headings].reverse()) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveHeading(h.id);
          return;
        }
      }
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [headings]);

  // Prev / Next
  const currentIdx = allDocs.findIndex((d) => String(d.id) === String(documentId));
  const prevDoc = currentIdx > 0 ? allDocs[currentIdx - 1] : null;
  const nextDoc = currentIdx < allDocs.length - 1 ? allDocs[currentIdx + 1] : null;

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setPosting(true);
    try {
      const res = await addComment(documentId, newComment);
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch { alert("Please login to comment."); }
    finally { setPosting(false); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareMsg(true);
    setTimeout(() => setShareMsg(false), 2000);
  };

  const handlePrint = () => window.print();

  if (!doc) return (
    <div className="max-w-4xl animate-pulse space-y-4">
      <div className="skeleton h-10 w-2/3 rounded-xl"></div>
      <div className="skeleton h-4 w-1/3 rounded-lg"></div>
      <div className="skeleton h-64 rounded-2xl mt-6"></div>
    </div>
  );

  return (
    <div className="flex gap-8 animate-fade-up max-w-5xl">
      {/* Main content */}
      <article className="flex-1 min-w-0">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[12px] text-slate-400 mb-5 flex-wrap">
          <Link to="/" className="flex items-center gap-1 hover:text-indigo-500 transition"><FiHome size={12} /> Home</Link>
          {category && <><FiChevronRight size={11} /><Link to={`/category/${categoryId}`} className="hover:text-indigo-500">{category.name}</Link></>}
          {topic && <><FiChevronRight size={11} /><Link to={`/docs/${categoryId}/${topicId}`} className="hover:text-indigo-500">{topic.name}</Link></>}
          <FiChevronRight size={11} />
          <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[200px]">{doc.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-7 pb-6 border-b border-slate-200/60 dark:border-white/[0.05]">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4 leading-tight">{doc.title}</h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-full">
              <FiEye size={12} /> {views} views
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-full">
              <FiClock size={12} /> {readingTime(doc.content)}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-full">
              <FiCalendar size={12} /> Updated {new Date(doc.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            {doc.tags?.map((tag) => (
              <span key={tag.id} className="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 px-2.5 py-1 rounded-full text-xs font-semibold border border-indigo-100 dark:border-indigo-900/30">
                #{tag.name}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition"
            >
              {shareMsg ? <><FiCheck size={12} className="text-emerald-500" /> Copied!</> : <><FiShare2 size={12} /> Share</>}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition"
            >
              <FiPrinter size={12} /> Print
            </button>
          </div>
        </div>

        {/* Markdown content */}
        <div className="markdown-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => { const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, "-"); return <h1 id={id}>{children}</h1>; },
              h2: ({ children }) => { const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, "-"); return <h2 id={id}>{children}</h2>; },
              h3: ({ children }) => { const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, "-"); return <h3 id={id}>{children}</h3>; },
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const code = String(children).replace(/\n$/, "");
                return !inline && match ? (
                  <div className="relative group">
                    <CopyButton code={code} />
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{ borderRadius: "0.875rem", fontSize: "13px", fontFamily: "'JetBrains Mono', monospace" }}
                      {...props}
                    >
                      {code}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className={className} {...props}>{children}</code>
                );
              },
            }}
          >
            {doc.content || ""}
          </ReactMarkdown>
        </div>

        {/* Helpful widget */}
        <HelpfulWidget docId={documentId} />

        {/* Attachments */}
        {doc.files?.length > 0 && (
          <div className="mt-6 bg-white dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 text-sm">
              <FiPaperclip className="text-indigo-500" /> Attachments
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {doc.files.map((f) => (
                <a key={f.id}
                  href={f.file_path?.startsWith("http") ? f.file_path : `${import.meta.env.VITE_API_URL}/${f.file_path}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-xl px-3 py-2.5 text-sm transition group border border-slate-200/60 dark:border-white/5"
                >
                  <span className="truncate text-slate-700 dark:text-slate-300 text-xs">{f.file_name}</span>
                  <FiDownload size={14} className="text-slate-400 group-hover:text-indigo-500 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Prev / Next navigation */}
        {(prevDoc || nextDoc) && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prevDoc ? (
              <Link
                to={`/docs/${categoryId}/${topicId}/${prevDoc.id}`}
                className="group flex flex-col gap-1 bg-white dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] rounded-2xl px-4 py-3.5 hover:border-indigo-300 dark:hover:border-indigo-700/50 hover:shadow-md transition"
              >
                <span className="text-[10px] text-slate-400 flex items-center gap-1"><FiChevronLeft size={10} /> Previous</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition truncate">{prevDoc.title}</span>
              </Link>
            ) : <div />}
            {nextDoc && (
              <Link
                to={`/docs/${categoryId}/${topicId}/${nextDoc.id}`}
                className="group flex flex-col gap-1 bg-white dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] rounded-2xl px-4 py-3.5 hover:border-indigo-300 dark:hover:border-indigo-700/50 hover:shadow-md transition text-right"
              >
                <span className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">Next <FiArrowRight size={10} /></span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition truncate">{nextDoc.title}</span>
              </Link>
            )}
          </div>
        )}

        {/* Comments */}
        <div className="mt-6 bg-white dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] rounded-2xl p-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
            <FiMessageSquare className="text-indigo-500" /> Comments ({comments.length})
          </h3>
          <form onSubmit={handleAddComment} className="flex gap-2 mb-5">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="flex-1 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300/50 dark:focus:ring-indigo-700/50 transition placeholder:text-slate-400 text-slate-800 dark:text-slate-200"
            />
            <button type="submit" disabled={posting}
              className="bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-600 transition flex items-center gap-1.5 disabled:opacity-50 shrink-0">
              <FiSend size={13} /> Post
            </button>
          </form>
          <div className="space-y-2.5">
            {comments.map((c) => (
              <div key={c.id} className="bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.04] rounded-xl p-3.5">
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-1.5">{c.comment}</p>
                <span className="text-[11px] text-slate-400">{new Date(c.created_at).toLocaleString()}</span>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-6">Be the first to comment! 💬</p>
            )}
          </div>
        </div>
      </article>

      {/* TOC — right sidebar */}
      {headings.length > 0 && (
        <aside className="hidden xl:block w-52 shrink-0">
          <div className="sticky top-20">
            <div className="bg-white/70 dark:bg-white/[0.03] backdrop-blur border border-slate-200/60 dark:border-white/[0.06] rounded-2xl p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-3 flex items-center gap-1.5">
                <FiList size={11} /> On This Page
              </p>
              <ul className="space-y-0.5">
                {headings.map((h, i) => (
                  <li key={i}>
                    <a
                      href={`#${h.id}`}
                      className={`block text-[12px] py-1 px-2 rounded-lg transition truncate ${
                        activeHeading === h.id
                          ? "text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/50"
                          : "text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                      } ${h.level === 3 ? "pl-4" : ""}`}
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
