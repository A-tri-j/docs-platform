import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return show ? (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 w-10 h-10 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 text-indigo-500 rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-gray-800 transition animate-fade-up"
    >
      <FiArrowUp size={18} />
    </button>
  ) : null;
}
