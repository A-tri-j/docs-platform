import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200/80 dark:border-white/[0.04] mt-16">
      <div className="max-w-screen-xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center text-sm shadow-md">
            📘
          </div>
          <span className="font-black text-gray-700 dark:text-slate-300 text-sm">
            Docu<span className="gradient-text">Hub</span>
          </span>
        </div>
        <p className="text-xs text-gray-400 dark:text-slate-600 text-center">
          © {new Date().getFullYear()} DocuHub · Designed & Developed by{" "}
          <span className="font-semibold text-indigo-500">Atrij Ghosh</span>
        </p>
        <p className="text-xs text-gray-400 dark:text-slate-600">
          React · FastAPI · PostgreSQL
        </p>
      </div>
    </footer>
  );
}
