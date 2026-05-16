import { Link } from "react-router-dom";
import { Building2, Menu, Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      scrolled 
        ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 py-3 shadow-sm" 
        : "bg-transparent py-5"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
            <Building2 className="text-white" size={22} />
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Bari Bhara
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">হোম</Link>
          <Link to="/features" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">ফিচার</Link>
          <Link to="/pricing" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">প্রাইসিং</Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-all active:scale-90"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <Link 
              to="/dashboard" 
              className="px-6 py-2.5 bg-primary text-white font-bold rounded-full text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              ড্যাশবোর্ড
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-on-surface hover:text-primary transition-colors">লগইন</Link>
              <Link 
                to="/register" 
                className="px-6 py-2.5 bg-primary text-white font-bold rounded-full text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                ফ্রি শুরু করুন
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-on-surface">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;