import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, DollarSign, Building2, TrendingUp, SlidersHorizontal } from 'lucide-react';
import { ConfidenceBadge } from './ConfidenceBadge';

interface LaptopMockupProps {
  currentStage: number; // 0 to 5 (Stages 01 to 06)
}

export const LaptopMockup: React.FC<LaptopMockupProps> = ({ currentStage }) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-[16/10] bg-[#0E1116] rounded-t-3xl p-3 sm:p-4 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden">
      
      {/* Top Laptop Bezel Notch & Webcam */}
      <div className="relative w-full bg-[#171A20] rounded-2xl flex-1 border border-white/5 overflow-hidden flex flex-col">
        
        {/* Browser / App Header Bar */}
        <div className="h-8 bg-[#0E1116] border-b border-white/10 px-4 flex items-center justify-between text-[11px] font-mono-data text-white/50 z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A95743]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#C9793A]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#3F7657]/80" />
            <span className="ml-2 text-white/40">app.vyapaariq.in/analysis</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-[#C9793A]">● LIVE ENGINE</span>
            <span>STAGE 0{currentStage + 1} / 06</span>
          </div>
        </div>

        {/* Dynamic Display Screen Content */}
        <div className="flex-1 p-4 sm:p-6 bg-[#0E1116] text-[#F5F5F3] overflow-y-auto global-grid-pattern-dark relative">
          <AnimatePresence mode="wait">
            
            {/* STAGE 01: Location Intelligence */}
            {currentStage === 0 && (
              <motion.div
                key="stage-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="h-full flex flex-col justify-between"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C9793A]" />
                    <span className="font-mono-data text-xs uppercase tracking-wider text-white/70">
                      LOCATION INTELLIGENCE
                    </span>
                  </div>
                  <span className="text-xs font-mono-data text-[#3F7657] bg-[#3F7657]/10 px-2 py-0.5 rounded border border-[#3F7657]/20">
                    CATCHMENT_VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                  {/* Map Visualizer Mock */}
                  <div className="md:col-span-2 rounded-xl bg-[#171A20]/90 backdrop-blur-xs border border-white/10 p-4 relative overflow-hidden flex flex-col justify-between global-grid-pattern-dark">
                    <div className="flex justify-between items-start text-xs font-mono-data text-white/60 z-10">
                      <div>KANNAUJ RURAL NORTH</div>
                      <div>26.8500° N, 79.9167° E</div>
                    </div>
                    {/* Simulated Location Nodes */}
                    <div className="my-8 relative flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full border border-[#C9793A]/40 animate-ping absolute" />
                      <div className="w-16 h-16 rounded-full bg-[#C9793A]/20 border border-[#C9793A] flex items-center justify-center text-xs font-mono-data font-bold text-[#C9793A] z-10">
                        HUB-01
                      </div>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono-data text-white/50 z-10">
                      <span>RADIUS: 5.0 KM</span>
                      <span>SETTLEMENTS: 14 PANCHAYATS</span>
                    </div>
                  </div>

                  {/* Location Metrics */}
                  <div className="space-y-3 font-mono-data">
                    <div className="p-3 rounded-xl bg-[#171A20]/90 border border-white/10">
                      <span className="text-[10px] text-white/50 block">POPULATION DENSITY</span>
                      <span className="text-lg font-bold text-[#F5F5F3]">42,000 Households</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#171A20]/90 border border-white/10">
                      <span className="text-[10px] text-white/50 block">NEAREST MANDI</span>
                      <span className="text-lg font-bold text-[#C9793A]">3.4 km</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#171A20]/90 border border-white/10">
                      <span className="text-[10px] text-white/50 block">COMMERCIAL ACCESS</span>
                      <span className="text-lg font-bold text-[#3F7657]">HIGH</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 02: Financial Structure */}
            {currentStage === 1 && (
              <motion.div
                key="stage-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="h-full flex flex-col justify-between"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#C9793A]" />
                    <span className="font-mono-data text-xs uppercase tracking-wider text-white/70">
                      FINANCIAL STRUCTURE
                    </span>
                  </div>
                  <span className="text-xs font-mono-data text-[#C9793A]">CAPITAL MODELING</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-[#171A20]/90 border border-[#C9793A]/40">
                    <span className="text-xs font-mono-data uppercase text-white/50 block mb-1">OWN CAPITAL INVESTMENT</span>
                    <div className="font-mono-data text-3xl font-bold text-[#C9793A] mb-3">₹1,00,000</div>
                    <p className="text-xs text-white/60">Minimum suggested equity buffer for Tier-3 projects</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#171A20]/90 border border-white/10 space-y-3 font-mono-data text-xs">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-white/50">ESTIMATED PROJECT COST:</span>
                      <span className="text-white font-bold">₹3,50,000</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-white/50">MANDATORY WORKING CAPITAL:</span>
                      <span className="text-white font-bold">₹50,000</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-white/50">REQUIRED BANK LOAN:</span>
                      <span className="text-[#C9793A] font-bold">₹2,00,000</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-[#171A20]/80 border border-white/5 text-xs font-mono-data text-white/60 flex justify-between">
                  <span>ESTIMATED EMI: ₹8,400 / month</span>
                  <span>PAYBACK: 18 months</span>
                </div>
              </motion.div>
            )}

            {/* STAGE 03: Business Opportunity */}
            {currentStage === 2 && (
              <motion.div
                key="stage-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="h-full flex flex-col justify-between"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#C9793A]" />
                    <span className="font-mono-data text-xs uppercase tracking-wider text-white/70">
                      BUSINESS OPPORTUNITY SELECTION
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { name: 'Dairy Farm', selected: true, demand: 'High', capital: '₹3.5L' },
                    { name: 'Food Processing', selected: false, demand: 'Medium', capital: '₹4.2L' },
                    { name: 'Retail Store', selected: false, demand: 'High', capital: '₹2.8L' },
                    { name: 'Agri Services', selected: false, demand: 'Medium', capital: '₹3.0L' },
                  ].map(b => (
                    <div
                      key={b.name}
                      className={`p-4 rounded-xl border text-left font-mono-data text-xs transition-all ${
                        b.selected
                          ? 'bg-[#C9793A]/20 border-[#C9793A] text-white shadow-lg'
                          : 'bg-[#171A20]/90 border-white/10 text-white/60'
                      }`}
                    >
                      <div className="font-bold text-sm mb-1">{b.name}</div>
                      <div className="text-[10px] opacity-80">Demand: {b.demand}</div>
                      <div className="text-[10px] text-[#C9793A] font-semibold mt-2">{b.capital} Required</div>
                      {b.selected && <span className="inline-block mt-2 px-2 py-0.5 rounded bg-[#C9793A] text-white text-[9px] font-bold">SELECTED</span>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STAGE 04: Market Intelligence */}
            {currentStage === 3 && (
              <motion.div
                key="stage-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="h-full flex flex-col justify-between"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#3F7657]" />
                    <span className="font-mono-data text-xs uppercase tracking-wider text-white/70">
                      HYPERLOCAL MARKET DASHBOARD
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-data">
                  <div className="p-4 rounded-xl bg-[#171A20]/90 border border-white/10">
                    <span className="text-[10px] text-white/50 block">MARKET DEMAND</span>
                    <span className="text-3xl font-bold text-[#3F7657]">82</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#171A20]/90 border border-white/10">
                    <span className="text-[10px] text-white/50 block">COMPETITION</span>
                    <span className="text-3xl font-bold text-[#3F7657]">61</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#171A20]/90 border border-white/10">
                    <span className="text-[10px] text-white/50 block">OPPORTUNITY</span>
                    <span className="text-3xl font-bold text-[#C9793A]">84</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#171A20]/90 border border-white/10">
                    <span className="text-[10px] text-white/50 block">ACTIVE COMPETITORS</span>
                    <span className="text-3xl font-bold text-white">12</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 05: Risk Simulation */}
            {currentStage === 4 && (
              <motion.div
                key="stage-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="h-full flex flex-col justify-between"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#A95743]" />
                    <span className="font-mono-data text-xs uppercase tracking-wider text-white/70">
                      STRESS-TESTING SCENARIO (-20% DEMAND DROP)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-data">
                  <div className="p-4 rounded-xl bg-[#171A20]/90 border border-white/10 opacity-70">
                    <span className="text-xs text-white/50 block">BASE SCENARIO</span>
                    <div className="text-2xl font-bold text-white mt-1">Viability: 86</div>
                    <div className="text-xs text-[#3F7657] mt-1">Cash Surplus: ₹31K / mo</div>
                    <div className="text-[11px] text-white/40 mt-1">Risk: LOW</div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#171A20]/90 border border-[#A95743]">
                    <span className="text-xs text-[#A95743] font-bold block">STRESSED SCENARIO (-20%)</span>
                    <div className="text-2xl font-bold text-[#A95743] mt-1">Viability: 86 → 69</div>
                    <div className="text-xs text-[#A95743] mt-1">Cash Surplus: ₹31K → ₹14K</div>
                    <div className="text-[11px] text-[#A95743] mt-1 font-bold">Risk: MEDIUM → HIGH</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 06: Decision Intelligence */}
            {currentStage === 5 && (
              <motion.div
                key="stage-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="h-full flex flex-col justify-between"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-2">
                  <span className="font-mono-data text-xs uppercase tracking-wider text-white/70">
                    FINAL DECISION RECOMMENDATION
                  </span>
                  <ConfidenceBadge type="official" />
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-mono-data text-5xl font-extrabold text-white">86</span>
                    <span className="font-mono-data text-xl text-white/50"> / 100</span>
                    <span className="text-xs font-mono-data text-white/60 block mt-1">BUSINESS VIABILITY INDEX</span>
                  </div>

                  <div className="px-4 py-2 rounded-xl bg-[#C9793A]/20 border border-[#C9793A] text-[#C9793A] font-mono-data font-bold text-xs">
                    PROCEED WITH CONDITIONS
                  </div>
                </div>

                <p className="text-xs text-white/80 bg-[#171A20]/90 p-3 rounded-xl border border-white/5 mt-3">
                  "Strong local demand and manageable competition support the opportunity. Retaining working capital reduces repayment risk."
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* Laptop Base Stand */}
      <div className="w-full h-3 bg-[#171A20] rounded-b-2xl border-t border-white/10 flex items-center justify-center">
        <div className="w-20 h-1 bg-white/20 rounded-full" />
      </div>

    </div>
  );
};
