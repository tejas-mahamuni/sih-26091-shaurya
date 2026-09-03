import React from 'react';
import { ShieldCheck, MapPin } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="w-full text-[#111111] py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      
      <div className="space-y-3">
        <span className="text-xs font-mono-data uppercase tracking-widest text-[#C9793A] block">
          ABOUT VYAPAARIQ
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#111111]">
          Know Your Business Before You Borrow.
        </h1>
      </div>

      <div className="p-8 rounded-3xl apple-card space-y-6 text-sm sm:text-base text-[#6B6B6B] leading-relaxed shadow-xs">
        <p>
          First-time entrepreneurs in rural and semi-urban India often fail not because they lack hard work, but because they take high-interest loans for businesses that have no local market demand or are already saturated with local competitors.
        </p>

        <p>
          <strong className="text-[#111111]">VyapaarIQ</strong> bridges this gap by combining hyperlocal census & mandi data with financial loan stress modeling. It gives entrepreneurs and banking institutions a clear, transparent viability index before capital is committed.
        </p>

        <div className="pt-4 border-t border-[#E2E2DC] grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-data text-xs text-[#111111]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#3F7657]" />
            <span>Priority Sector Lending Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#C9793A]" />
            <span>Tier-2, Tier-3 & Panchayat Hub Focus</span>
          </div>
        </div>
      </div>

    </div>
  );
};
