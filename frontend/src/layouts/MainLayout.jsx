import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import ReadingProgress from "../components/ui/ReadingProgress";
import BackToTop from "../components/ui/BackToTop";
import BottomNav from "../components/ui/BottomNav";
import LiveSearch from "../components/ui/LiveSearch";
import useSwipe from "../hooks/useSwipe";
import { useEffect } from "react";

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Ctrl+K / Cmd+K opens search
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Swipe right to open sidebar, left to close
  useSwipe({
    onSwipeRight: useCallback(() => setMobileOpen(true), []),
    onSwipeLeft: useCallback(() => setMobileOpen(false), []),
  });

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <ReadingProgress />
      <Navbar
        onToggleSidebar={() => setMobileOpen(true)}
        onSearchOpen={() => setSearchOpen(true)}
      />
      <div className="flex flex-1 max-w-screen-xl mx-auto w-full">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 animate-fade-up">
          <Outlet />
        </main>
      </div>
      <Footer />
      <BackToTop />
      <BottomNav onSearchOpen={() => setSearchOpen(true)} />
      <LiveSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
