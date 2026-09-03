import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const location = useLocation();

  const navLinks = [
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Market', path: '/market' },
    { label: 'Finance', path: '/finance' },
    { label: 'Risk', path: '/risk' },
    { label: 'Compare', path: '/compare' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F5F5F3]/85 backdrop-blur-md border-b border-[#E2E2DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        
        {/* Left: Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-display text-lg sm:text-xl font-bold text-[#111111] tracking-tight group-hover:text-[#C9793A] transition-colors">
            Vyapaar<span className="text-[#C9793A]">IQ</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#3F7657]" />
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-xs sm:text-sm font-medium transition-colors hover:text-[#111111]",
                  isActive ? "text-[#111111] font-semibold" : "text-[#6B6B6B]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Controls */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <button
            onClick={() => setLang(l => l === 'EN' ? 'HI' : 'EN')}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono-data text-[#6B6B6B] hover:text-[#111111] border border-[#E2E2DC] rounded-full transition-colors cursor-pointer bg-white/50"
            title="Switch Language"
          >
            <Globe className="w-3 h-3 text-[#C9793A]" />
            <span>{lang}</span>
          </button>

          {/* Start Analysis CTA */}
          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full bg-[#111111] hover:bg-[#222222] text-[#F5F5F3] transition-all shadow-xs"
          >
            <span>Start Analysis</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#C9793A]" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-[#111111] hover:bg-black/5"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[#F5F5F3] border-b border-[#E2E2DC] px-6 py-4 flex flex-col gap-3 shadow-lg"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-sm font-medium text-[#111111] border-b border-[#E2E2DC]/50 last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
