import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';

export const RiskAnalysis: React.FC = () => {
  const [demandDrop, setDemandDrop] = useState(0); // 0%, -10%, -20%, -30%

  // Dynamic calculations based on demandDrop
  const baseViability = 86;
  const currentViability = Math.max(45, baseViability - demandDrop * 0.85);

  const baseSurplus = 31000;
  const currentSurplus = Math.max(6000, Math.round(baseSurplus * (1 - (demandDrop / 100) * 1.6)));

  const getRiskLevel = () => {
    if (demandDrop >= 25) return { label: 'HIGH RISK', color: 'text-[#A95743] bg-[#A95743]/15 border-[#A95743]' };
    if (demandDrop >= 15) return { label: 'MEDIUM RISK', color: 'text-[#C9793A] bg-[#C9793A]/15 border-[#C9793A]' };
    return { label: 'LOW RISK', color: 'text-[#3F7657] bg-[#3F7657]/15 border-[#3F7657]' };
  };

  const risk = getRiskLevel();

  return (
    <div className="w-full text-[#111111] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-mono-data uppercase tracking-widest text-[#A95743] block mb-2">
          STRESS TESTING & SWOT ANALYSIS
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#111111] mb-4">
          Risk & Off-Season Sensitivity Simulator
        </h1>
        <p className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed">
          Test what happens to your cash flow and viability if local market demand drops during monsoon or off-seasons.
        </p>
      </div>

      {/* Stress Test Interactive Simulator */}
      <div className="p-8 rounded-3xl bg-[#0E1116] text-[#F5F5F3] border border-white/10 space-y-8 shadow-2xl global-grid-pattern-dark relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6 relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono-data text-[#C9793A] uppercase font-bold">
            <SlidersHorizontal className="w-4 h-4" />
            <span>INTERACTIVE DEMAND STRESS TESTER</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-mono-data font-bold border ${risk.color}`}>
            {risk.label}
          </span>
        </div>

        {/* Slider Controls */}
        <div className="space-y-4 max-w-2xl relative z-10">
          <div className="flex justify-between text-xs font-mono-data">
            <span className="text-white/60">SIMULATE OFF-SEASON DEMAND REDUCTION</span>
            <span className="text-[#A95743] font-bold">-{demandDrop}% DEMAND DROP</span>
          </div>
          <input
            type="range"
            min="0"
            max="35"
            step="5"
            value={demandDrop}
            onChange={(e) => setDemandDrop(Number(e.target.value))}
            className="w-full accent-[#A95743] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-mono-data text-white/40">
            <span>Normal Market (0%)</span>
            <span>Mild Slump (-10%)</span>
            <span>Severe Monsoon (-20%)</span>
            <span>Extreme Slump (-30%)</span>
          </div>
        </div>

        {/* Dynamic Result Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono-data pt-4 relative z-10">
          
          <div className="p-5 rounded-2xl bg-[#171A20]/90 border border-white/10">
            <span className="text-xs text-white/50 block">VIABILITY INDEX</span>
            <div className="text-4xl font-extrabold text-white mt-2">
              {Math.round(currentViability)} <span className="text-lg text-white/40">/ 100</span>
            </div>
            <span className="text-xs text-[#A95743] block mt-1">
              {demandDrop > 0 ? `-${Math.round(baseViability - currentViability)} pts from base` : 'Base Optimal'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#171A20]/90 border border-white/10">
            <span className="text-xs text-white/50 block">MONTHLY CASH SURPLUS</span>
            <div className="text-4xl font-extrabold text-[#C9793A] mt-2">
              ₹{currentSurplus.toLocaleString('en-IN')}
            </div>
            <span className="text-xs text-white/50 block mt-1">
              After ₹31K monthly loan EMI
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#171A20]/90 border border-white/10">
            <span className="text-xs text-white/50 block">RECOMMENDED BUFFER</span>
            <div className="text-4xl font-extrabold text-[#3F7657] mt-2">
              ₹1,80,000
            </div>
            <span className="text-xs text-white/50 block mt-1">
              Required liquid working capital
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
