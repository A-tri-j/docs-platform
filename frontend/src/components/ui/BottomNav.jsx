import { Link, useLocation } from "react-router-dom";
import { FiHome, FiSearch, FiBookOpen, FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

export default function BottomNav({ onSearchOpen }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const items = [
    { to: "/", icon: <FiHome size={20} />, label: "Home" },
    { action: onSearchOpen, icon: <FiSearch size={20} />, label: "Search" },
    { to: "/categories", icon: <FiBookOpen size={20} />, label: "Docs" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-t border-slate-200/60 dark:border-white/[0.05] px-2 pb-safe">
      <div className="flex items-center justify-around py-2">
        {items.map((item, i) => {
          const active = item.to && location.pathname === item.to;
          const el = (
            <div className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition">
              <span className={active ? "text-indigo-500" : "text-slate-400 dark:text-slate-500"}>{item.icon}</span>
              <span className={`text-[10px] font-medium ${active ? "text-indigo-500" : "text-slate-400 dark:text-slate-500"}`}>{item.label}</span>
            </div>
          );
          return item.to ? (
            <Link key={i} to={item.to}>{el}</Link>
          ) : (
            <button key={i} onClick={item.action}>{el}</button>
          );
        })}
        <button onClick={toggleTheme} className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl">
          <span className="text-slate-400 dark:text-slate-500">{theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}</span>
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">Theme</span>
        </button>
      </div>
    </div>
  );
}
