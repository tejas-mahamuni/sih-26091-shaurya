import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ArrowUpRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PillNavProps {
  onStartAnalysis?: () => void;
}

export const PillNav: React.FC<PillNavProps> = ({ onStartAnalysis }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');

  const navLinks = [
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Insights', href: '#insights' },
    { label: 'For Entrepreneurs', href: '#entrepreneurs' },
    { label: 'About', href: '#about' },
  ];

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl">
        <div className="bg-[#1B2E4A]/90 backdrop-blur-xl border border-[#E4E9F0]/15 shadow-[0_16px_40px_rgba(0,0,0,0.5)] rounded-full px-4 py-2.5 sm:px-6 sm:py-3 flex items-center justify-between transition-all duration-300">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#F6F5F1] group-hover:text-[#D98E2C] transition-colors">
              Vyapaar<span className="text-[#D98E2C]">IQ</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B4F] animate-pulse" />
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3.5 py-1.5 text-xs lg:text-sm font-medium text-[#E4E9F0]/80 hover:text-[#F6F5F1] hover:bg-[#F6F5F1]/10 rounded-full transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <button
              onClick={() => setLanguage(l => l === 'EN' ? 'HI' : 'EN')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono-data text-[#E4E9F0]/80 hover:text-[#F6F5F1] bg-[#F6F5F1]/5 hover:bg-[#F6F5F1]/10 border border-[#E4E9F0]/10 rounded-full transition-all cursor-pointer"
              title="Toggle Language"
            >
              <Globe className="w-3 h-3 text-[#D98E2C]" />
              <span>{language}</span>
            </button>

            {/* Primary CTA */}
            <button
              onClick={onStartAnalysis}
              className="group inline-flex items-center gap-1.5 px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full bg-[#D98E2C] hover:bg-[#c47d21] text-[#1B2E4A] transition-all duration-200 shadow-sm cursor-pointer"
            >
              <span>Start Analysis</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-full text-[#E4E9F0] hover:bg-[#F6F5F1]/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-4 right-4 z-40 md:hidden bg-[#1B2E4A]/95 backdrop-blur-2xl border border-[#E4E9F0]/20 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-center"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-base font-medium text-[#F6F5F1] hover:text-[#D98E2C] border-b border-[#E4E9F0]/10 last:border-0 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onStartAnalysis) onStartAnalysis();
              }}
              className="mt-2 w-full py-3 rounded-full bg-[#D98E2C] text-[#1B2E4A] font-bold text-sm"
            >
              Start Analysis Now →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
