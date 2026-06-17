import { Link, useNavigate } from "react-router-dom";
import { FiSun, FiMoon, FiMenu, FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({ onToggleSidebar, onSearchOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-white/85 dark:bg-[#09090f]/90 shadow-sm"
        : "bg-white/60 dark:bg-[#09090f]/60"
    } backdrop-blur-xl border-b border-slate-200/60 dark:border-white/[0.04] px-4 sm:px-6`}>
      <div className="max-w-screen-xl mx-auto flex items-center h-14 gap-4">

        <button onClick={onToggleSidebar} className="md:hidden p-2 -ml-1 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition">
          <FiMenu size={20} />
        </button>

        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 group-hover:scale-105 transition-transform">
            <span className="text-sm">📘</span>
          </div>
          <span className="font-black text-[17px] tracking-tight text-slate-900 dark:text-white">
            Docu<span className="gradient-text">Hub</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 ml-2">
          <Link to="/" className="text-[13px] font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition">
            Home
          </Link>
        </div>

        <div className="flex-1" />

        {/* Search trigger */}
        <button
          onClick={onSearchOpen}
          className="hidden sm:flex items-center gap-2 bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/8 hover:border-indigo-300 dark:hover:border-indigo-700 rounded-xl px-3.5 py-2 w-56 lg:w-72 transition-all text-left"
        >
          <FiSearch size={14} className="text-slate-400 shrink-0" />
          <span className="flex-1 text-[13px] text-slate-400">Search docs...</span>
          <div className="hidden lg:flex items-center gap-0.5">
            <kbd className="text-[10px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 px-1.5 py-0.5 rounded font-mono">⌘</kbd>
            <kbd className="text-[10px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 px-1.5 py-0.5 rounded font-mono">K</kbd>
          </div>
        </button>

        <button onClick={onSearchOpen} className="sm:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition">
          <FiSearch size={18} />
        </button>

        <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-indigo-600 transition">
          {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
        </button>
      </div>
    </nav>
  );
}
