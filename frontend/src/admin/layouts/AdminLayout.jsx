import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiGrid, FiFolder, FiBookOpen, FiFileText, FiTag,
  FiLogOut, FiMenu, FiX, FiExternalLink
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <FiGrid size={18} />, color: "from-indigo-500 to-purple-500" },
  { to: "/admin/categories", label: "Categories", icon: <FiFolder size={18} />, color: "from-cyan-500 to-blue-500" },
  { to: "/admin/topics", label: "Topics", icon: <FiBookOpen size={18} />, color: "from-emerald-500 to-teal-500" },
  { to: "/admin/documents", label: "Documents", icon: <FiFileText size={18} />, color: "from-rose-500 to-orange-400" },
  { to: "/admin/tags", label: "Tags", icon: <FiTag size={18} />, color: "from-amber-500 to-orange-500" },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white text-lg backdrop-blur">📘</span>
          <div>
            <p className="text-white font-extrabold text-base leading-tight">DocuHub</p>
            <p className="text-white/50 text-[11px]">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-white/15 text-white shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shadow-sm`}>
                {item.icon}
              </span>
              {item.label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-2">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 text-sm transition"
        >
          <FiExternalLink size={15} /> View Public Site
        </Link>
        <div className="bg-white/10 rounded-xl px-3 py-2.5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-white text-xs font-semibold">{user?.username}</p>
              <p className="text-white/40 text-[10px]">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-white/60 hover:text-red-300 text-xs py-1 transition"
          >
            <FiLogOut size={13} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex-col shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex flex-col shadow-2xl animate-fade-in">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm shadow-gray-100/50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <FiMenu size={20} />
            </button>
            <div>
              <h1 className="text-base font-bold text-gray-900 dark:text-white">
                {navItems.find((n) => location.pathname.startsWith(n.to))?.label || "Admin"}
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">Manage your documentation content</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.username}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
