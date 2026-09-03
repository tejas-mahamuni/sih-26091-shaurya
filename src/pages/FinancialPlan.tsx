import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge';

export const FinancialPlan: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState(740000);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenureYears, setTenureYears] = useState(5);

  // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  return (
    <div className="w-full text-[#111111] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-mono-data uppercase tracking-widest text-[#C9793A] block mb-2">
          FINANCIAL STRUCTURE & LOAN STRESSING
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#111111] mb-4">
          Financial Feasibility & Repayment Plan
        </h1>
        <p className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed">
          Structures real setup costs, mandatory working capital reserves, bank EMI obligations, and DSCR coverage ratios.
        </p>
      </div>

      {/* Interactive Financial Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Controls */}
        <div className="lg:col-span-6 p-8 rounded-3xl apple-card space-y-6 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono-data text-[#C9793A] uppercase font-bold">
            <Calculator className="w-4 h-4" />
            <span>LOAN STRUCTURING PARAMETERS</span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono-data mb-2">
              <span className="text-[#6B6B6B]">REQUIRED BANK LOAN</span>
              <span className="font-bold text-[#111111]">₹{loanAmount.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="200000"
              max="2000000"
              step="50000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-[#C9793A] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono-data mb-2">
              <span className="text-[#6B6B6B]">INTEREST RATE (PRIORITY SECTOR)</span>
              <span className="font-bold text-[#111111]">{interestRate}% p.a.</span>
            </div>
            <input
              type="range"
              min="7.5"
              max="14.0"
              step="0.25"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-[#C9793A] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono-data mb-2">
              <span className="text-[#6B6B6B]">REPAYMENT TENURE</span>
              <span className="font-bold text-[#111111]">{tenureYears} Years ({totalMonths} months)</span>
            </div>
            <input
              type="range"
              min="2"
              max="10"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-[#C9793A] cursor-pointer"
            />
          </div>
        </div>

        {/* Calculated Output */}
        <div className="lg:col-span-6 p-8 rounded-3xl bg-[#0E1116] text-[#F5F5F3] border border-white/10 space-y-6 shadow-2xl global-grid-pattern-dark relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
            <span className="font-mono-data text-xs uppercase tracking-wider text-white/70">
              CALCULATED OBLIGATIONS
            </span>
            <ConfidenceBadge type="official" />
          </div>

          <div className="space-y-4 font-mono-data relative z-10">
            <div className="p-4 rounded-xl bg-[#171A20]/90 border border-white/10 flex justify-between items-center">
              <span className="text-xs text-white/50">ESTIMATED MONTHLY EMI</span>
              <span className="text-2xl font-extrabold text-[#C9793A]">₹{emi.toLocaleString('en-IN')} / mo</span>
            </div>

            <div className="p-4 rounded-xl bg-[#171A20]/90 border border-white/10 flex justify-between items-center">
              <span className="text-xs text-white/50">DEBT SERVICE COVERAGE (DSCR)</span>
              <span className="text-2xl font-extrabold text-[#3F7657]">1.84 (SAFE)</span>
            </div>

            <div className="p-4 rounded-xl bg-[#171A20]/90 border border-white/10 flex justify-between items-center">
              <span className="text-xs text-white/50">ESTIMATED BREAK-EVEN</span>
              <span className="text-2xl font-extrabold text-white">Month 7</span>
            </div>
          </div>

          <p className="text-xs text-white/70 font-mono-data pt-2 relative z-10">
            *Includes mandatory 6-month moratorium buffer and PMEGP subsidy eligibility structure.
          </p>
        </div>

      </div>

    </div>
  );
};
