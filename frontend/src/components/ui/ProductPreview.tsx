import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from './SectionHeading';
import { ConfidenceBadge } from './ConfidenceBadge';
import { MetricCard } from './MetricCard';
import { defaultDemoAnalysis } from '@/data/demoData';
import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

export const ProductPreview: React.FC = () => {
  const data = defaultDemoAnalysis;

  return (
    <section id="insights" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      <SectionHeading
        eyebrow="EXPLAINABLE DECISION ENGINE"
        title="See the decision, not just the data."
        subtitle="VyapaarIQ doesn't dump raw spreadsheets. It synthesizes complex local market and loan dynamics into an actionable, transparent recommendation."
        align="center"
      />

      {/* Main Interactive Product Preview Frame */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="rounded-[2.5rem] bg-[#1B2E4A] border border-[#E4E9F0]/20 p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden"
      >
        {/* Editorial Top Status Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E4E9F0]/10 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-display text-xl font-bold text-[#F6F5F1]">
                Cold Storage & Spice Processing Unit
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono-data bg-[#D98E2C]/15 text-[#D98E2C] border border-[#D98E2C]/30">
                FEASIBILITY REPORT #VYP-8921
              </span>
            </div>
            <p className="text-xs font-mono-data text-[#94A3B8] mt-1">
              LOCATION: {data.locationContext.district} • CATCHMENT: {data.locationContext.catchmentPopulation}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ConfidenceBadge type="official" size="md" />
            <ConfidenceBadge type="local" size="md" />
            <ConfidenceBadge type="estimated" size="md" />
          </div>
        </div>

        {/* Hero Score + Recommendation Showcase Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-stretch">
          
          {/* Business Viability Score Block */}
          <div className="lg:col-span-5 bg-[#20242B]/80 rounded-3xl p-8 border border-[#E4E9F0]/10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 font-mono-data text-9xl font-bold text-[#D98E2C] pointer-events-none select-none">
              86
            </div>

            <div>
              <span className="text-xs font-mono-data uppercase tracking-widest text-[#94A3B8]">
                COMPOSITE VIABILITY INDEX
              </span>
              <div className="flex items-baseline gap-3 my-4">
                <span className="font-mono-data text-6xl sm:text-7xl font-extrabold text-[#F6F5F1] tracking-tight">
                  86
                </span>
                <span className="font-mono-data text-2xl text-[#94A3B8]">/ 100</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#E4E9F0]/10">
              <div className="flex justify-between text-xs font-mono-data">
                <span className="text-[#94A3B8]">Project Cost:</span>
                <span className="text-[#F6F5F1] font-bold">{data.financialSummary.estimatedProjectCost}</span>
              </div>
              <div className="flex justify-between text-xs font-mono-data">
                <span className="text-[#94A3B8]">Required Bank Loan:</span>
                <span className="text-[#D98E2C] font-bold">{data.financialSummary.requiredLoan}</span>
              </div>
              <div className="flex justify-between text-xs font-mono-data">
                <span className="text-[#94A3B8]">Estimated Monthly EMI:</span>
                <span className="text-[#F6F5F1] font-bold">{data.financialSummary.monthlyEmi}</span>
              </div>
              <div className="flex justify-between text-xs font-mono-data">
                <span className="text-[#94A3B8]">Payback Horizon:</span>
                <span className="text-[#2E6B4F] font-bold">{data.financialSummary.paybackPeriod}</span>
              </div>
            </div>
          </div>

          {/* Viability Recommendation & Explainability (Why?) */}
          <div className="lg:col-span-7 bg-[#20242B]/80 rounded-3xl p-8 border border-[#E4E9F0]/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-[#D98E2C]" />
                <span className="text-xs font-mono-data uppercase tracking-wider text-[#94A3B8]">
                  PRIMARY DECISION RECOMMENDATION
                </span>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#D98E2C]/15 border border-[#D98E2C]/40 text-[#D98E2C] mb-6">
                <span className="w-3 h-3 rounded-full bg-[#D98E2C] animate-ping" />
                <span className="font-mono-data text-lg font-bold tracking-tight">
                  PROCEED WITH CONDITIONS
                </span>
              </div>

              {/* Why? Box */}
              <div className="bg-[#1B2E4A] p-6 rounded-2xl border border-[#E4E9F0]/10 relative">
                <div className="flex items-center gap-2 text-xs font-mono-data text-[#D98E2C] uppercase font-bold mb-2">
                  <HelpCircle className="w-4 h-4" />
                  <span>Why this recommendation?</span>
                </div>
                <p className="text-sm sm:text-base text-[#F6F5F1] leading-relaxed font-normal">
                  "{data.whyExplanation}"
                </p>
              </div>
            </div>

            {/* Key Actionable Conditions */}
            <div className="mt-6 pt-4 border-t border-[#E4E9F0]/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#E4E9F0]">
                <CheckCircle2 className="w-4 h-4 text-[#2E6B4F] shrink-0" />
                <span>Maintain ₹1.8L liquid buffer for off-season</span>
              </div>
              <div className="flex items-center gap-2 text-[#E4E9F0]">
                <CheckCircle2 className="w-4 h-4 text-[#2E6B4F] shrink-0" />
                <span>Apply under PMEGP Scheme (35% Subsidy)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Breakdown Signal Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard
            label="Market Demand"
            value={data.metrics.marketDemand}
            level={data.metrics.marketDemandLevel}
            confidence="local"
            progress={data.metrics.marketDemand}
          />
          <MetricCard
            label="Competition"
            value={data.metrics.competition}
            level={data.metrics.competitionLevel}
            confidence="official"
            progress={data.metrics.competition}
          />
          <MetricCard
            label="Capital Adequacy"
            value={data.metrics.capitalAdequacy}
            level="GOOD"
            confidence="local"
            progress={data.metrics.capitalAdequacy}
          />
          <MetricCard
            label="Profit Potential"
            value={data.metrics.profitPotential}
            level="GOOD"
            confidence="estimated"
            progress={data.metrics.profitPotential}
          />
          <MetricCard
            label="Loan Affordability"
            value={data.metrics.loanAffordability}
            level="GOOD"
            confidence="official"
            progress={data.metrics.loanAffordability}
          />
          <MetricCard
            label="Risk Level"
            value={data.metrics.riskLevel}
            level="MEDIUM"
            confidence="estimated"
            progress={65}
          />
        </div>

      </motion.div>

    </section>
  );
};
