import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export const CompareBusinesses: React.FC = () => {
  const businesses = [
    {
      name: 'Dairy Chilling Unit',
      category: 'Livestock & Agri',
      viability: 86,
      capitalReq: '₹5,00,000',
      loanReq: '₹7,40,000',
      monthlySurplus: '₹31,500',
      competitionLevel: 'LOW',
      riskLevel: 'MEDIUM',
      bestFor: 'High daily local milk demand & mandi access',
      recommendation: 'PROCEED WITH CONDITIONS',
      highlight: true
    },
    {
      name: 'Spice Processing Hub',
      category: 'Food Processing',
      viability: 74,
      capitalReq: '₹4,00,000',
      loanReq: '₹6,00,000',
      monthlySurplus: '₹22,000',
      competitionLevel: 'MEDIUM',
      riskLevel: 'MEDIUM',
      bestFor: 'Regional distribution & highway access',
      recommendation: 'CONDITIONAL FEASIBILITY',
      highlight: false
    },
    {
      name: 'Hardware & Solar Supply',
      category: 'Retail Distribution',
      viability: 68,
      capitalReq: '₹3,00,000',
      loanReq: '₹4,50,000',
      monthlySurplus: '₹16,500',
      competitionLevel: 'HIGH',
      riskLevel: 'HIGH',
      bestFor: 'High footfall town market centers',
      recommendation: 'HIGH RISK / SATURATED',
      highlight: false
    }
  ];

  return (
    <div className="w-full text-[#111111] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-mono-data uppercase tracking-widest text-[#C9793A] block mb-2">
          OPPORTUNITY COMPARISON ENGINE
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#111111] mb-4">
          Which Business is the Best Use of Your Capital?
        </h1>
        <p className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed">
          Compare 3 business models against your ₹5,00,000 capital investment to maximize expected surplus and minimize bank loan default risk.
        </p>
      </div>

      {/* Comparison Table Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {businesses.map((b) => (
          <motion.div
            key={b.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-8 rounded-3xl border flex flex-col justify-between transition-all ${
              b.highlight
                ? 'bg-[#0E1116] text-[#F5F5F3] border-[#C9793A] shadow-2xl relative global-grid-pattern-dark overflow-hidden'
                : 'apple-card text-[#111111] shadow-xs'
            }`}
          >
            {b.highlight && (
              <span className="absolute top-4 left-8 px-3 py-0.5 rounded-full text-[10px] font-mono-data font-bold bg-[#C9793A] text-white z-10">
                BEST MATCH FOR YOUR CAPITAL
              </span>
            )}

            <div className="space-y-6 relative z-10 pt-2">
              <div>
                <span className="text-xs font-mono-data uppercase opacity-60 block mb-1">{b.category}</span>
                <h3 className="font-display text-2xl font-bold">{b.name}</h3>
              </div>

              {/* Score */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 font-mono-data">
                <span className="text-[11px] opacity-60 block">VIABILITY INDEX</span>
                <span className="text-4xl font-extrabold text-[#C9793A]">{b.viability}</span>
                <span className="text-sm opacity-60"> / 100</span>
              </div>

              {/* Data Rows */}
              <div className="space-y-3 font-mono-data text-xs border-t border-current/10 pt-4">
                <div className="flex justify-between py-1 border-b border-current/10">
                  <span className="opacity-60">OWN CAPITAL:</span>
                  <span className="font-bold">{b.capitalReq}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-current/10">
                  <span className="opacity-60">REQUIRED LOAN:</span>
                  <span className="font-bold text-[#C9793A]">{b.loanReq}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-current/10">
                  <span className="opacity-60">MONTHLY SURPLUS:</span>
                  <span className="font-bold text-[#3F7657]">{b.monthlySurplus}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-current/10">
                  <span className="opacity-60">COMPETITION:</span>
                  <span className="font-bold">{b.competitionLevel}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="opacity-60">RISK LEVEL:</span>
                  <span className="font-bold">{b.riskLevel}</span>
                </div>
              </div>

              <p className="text-xs opacity-80 leading-relaxed font-sans">
                {b.bestFor}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-current/10 relative z-10">
              <Link to="/analyze">
                <PrimaryButton size="sm" variant={b.highlight ? 'accent' : 'dark'} className="w-full">
                  Analyze This Business →
                </PrimaryButton>
              </Link>
            </div>

          </motion.div>
        ))}
      </div>

    </div>
  );
};
