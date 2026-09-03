import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#111111] text-[#F5F5F3] border-t border-white/10 py-16 px-4 sm:px-6 lg:px-8 relative global-grid-pattern-dark">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10">
        
        {/* Brand */}
        <div className="md:col-span-5 flex flex-col justify-between gap-6">
          <div>
            <Link to="/" className="inline-block font-display text-2xl font-bold tracking-tight mb-2 text-white">
              Vyapaar<span className="text-[#C9793A]">IQ</span>
            </Link>
            <p className="text-sm text-[#6B6B6B] max-w-sm leading-relaxed">
              Know your business before you borrow. AI-powered decision intelligence for rural and semi-urban entrepreneurs.
            </p>
          </div>

          <div className="text-xs font-mono-data text-[#6B6B6B]">
            © {new Date().getFullYear()} VyapaarIQ. All rights reserved.
          </div>
        </div>

        {/* Navigation Routes */}
        <div className="md:col-span-3 space-y-2.5 font-mono-data text-xs">
          <span className="uppercase text-[#C9793A] block font-semibold mb-4 tracking-wider">
            PRODUCT PAGES
          </span>
          <div><Link to="/how-it-works" className="text-white/70 hover:text-white transition-colors">How It Works</Link></div>
          <div><Link to="/market" className="text-white/70 hover:text-white transition-colors">Market Intelligence</Link></div>
          <div><Link to="/finance" className="text-white/70 hover:text-white transition-colors">Financial Plan</Link></div>
          <div><Link to="/risk" className="text-white/70 hover:text-white transition-colors">Risk & Stress Simulator</Link></div>
          <div><Link to="/compare" className="text-white/70 hover:text-white transition-colors">Compare Businesses</Link></div>
          <div><Link to="/analyze" className="text-[#C9793A] hover:underline font-bold">Start Analysis Flow →</Link></div>
        </div>

        {/* Catchment Info */}
        <div className="md:col-span-4 space-y-2.5 font-mono-data text-xs">
          <span className="uppercase text-[#C9793A] block font-semibold mb-4 tracking-wider">
            TARGET ECOSYSTEMS
          </span>
          <p className="text-[#6B6B6B] leading-relaxed">
            Optimized for Indian Tier-2, Tier-3, Panchayat Samiti, and Rural Mandi commercial hubs.
          </p>
          <div className="pt-2 text-[#3F7657] font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3F7657]" />
            <span>Priority Sector Lending Compliant Structure</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
