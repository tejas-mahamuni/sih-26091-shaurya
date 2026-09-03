import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WordsPullUp } from './WordsPullUp';
import { PrimaryButton } from './PrimaryButton';
import { HeroVisualization } from './HeroVisualization';
import { ConfidenceBadge } from './ConfidenceBadge';
import { defaultDemoAnalysis } from '@/data/demoData';
import { Sparkles } from 'lucide-react';

interface HeroProps {
  onAnalyzeClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onAnalyzeClick }) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const data = defaultDemoAnalysis;

  return (
    <section className="relative w-full min-h-screen p-2 sm:p-4 lg:p-6 flex flex-col justify-between overflow-hidden bg-[#20242B]">
      {/* Outer Rounded Container for Desktop Editorial Aesthetics */}
      <div className="relative w-full flex-1 min-h-[92vh] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-[#1B2E4A] border border-[#E4E9F0]/15 flex flex-col justify-between p-6 sm:p-10 lg:p-14 shadow-2xl">
        
        {/* Interactive Background Visualizer */}
        <HeroVisualization onHoverStateChange={setHoveredNodeId} />

        {/* Top Spacer for Floating Navbar */}
        <div className="pt-16 sm:pt-20 z-20" />

        {/* Hero Content Grid */}
        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end my-auto py-8">
          
          {/* Main Editorial Headline & Primary CTA (Left Column) */}
          <div className="lg:col-span-8 flex flex-col items-start gap-6">
            
            {/* Upper Micro Label */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B2E4A]/80 border border-[#D98E2C]/40 text-[#D98E2C] text-xs font-mono-data uppercase tracking-widest backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-[#D98E2C] animate-pulse" />
              <span>BUSINESS DECISION INTELLIGENCE</span>
              <span className="text-[#94A3B8]">•</span>
              <span className="text-[#E4E9F0]">RURAL & SEMI-URBAN</span>
            </motion.div>

            {/* Oversized Entrance Typography */}
            <div className="flex flex-col gap-1 sm:gap-2">
              <WordsPullUp
                text="Before you borrow."
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight font-extrabold text-[#F6F5F1]"
                delay={0.1}
                showIndicator={true}
              />
              <WordsPullUp
                text="Know your business."
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight font-extrabold text-[#D98E2C]"
                delay={0.4}
              />
            </div>

            {/* Primary Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-4"
            >
              <PrimaryButton
                onClick={onAnalyzeClick}
                size="lg"
                variant="amber"
                className="shadow-[0_12px_40px_rgba(217,142,44,0.3)]"
              >
                Analyze My Business
              </PrimaryButton>
            </motion.div>
          </div>

          {/* Floating Data Panel & Supporting Paragraph (Right Column) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-6">
            
            {/* Embedded Analytical Intelligence Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="glass-panel p-6 rounded-3xl relative overflow-hidden group hover:border-[#D98E2C]/40 transition-all"
            >
              {/* Highlight bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D98E2C] via-[#2E6B4F] to-[#D98E2C]" />

              <div className="flex items-center justify-between border-b border-[#E4E9F0]/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D98E2C]" />
                  <span className="font-mono-data text-xs uppercase tracking-wider text-[#94A3B8]">
                    BUSINESS VIABILITY
                  </span>
                </div>
                <ConfidenceBadge type="estimated" size="sm" />
              </div>

              {/* Large Viability Score */}
              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono-data text-5xl font-extrabold text-[#F6F5F1] tracking-tight">
                    {hoveredNodeId ? '91' : data.businessViabilityScore}
                  </span>
                  <span className="font-mono-data text-lg text-[#94A3B8]">/ 100</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono-data font-bold bg-[#2E6B4F]/20 text-[#2E6B4F] border border-[#2E6B4F]/40">
                  HIGH CONFIDENCE
                </span>
              </div>

              {/* Grid of Key Signals */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono-data pt-2 border-t border-[#E4E9F0]/10">
                <div className="p-2 rounded-xl bg-[#20242B]/50 flex justify-between items-center">
                  <span className="text-[#94A3B8]">Demand</span>
                  <span className="text-[#2E6B4F] font-bold">HIGH ({data.metrics.marketDemand})</span>
                </div>
                <div className="p-2 rounded-xl bg-[#20242B]/50 flex justify-between items-center">
                  <span className="text-[#94A3B8]">Competition</span>
                  <span className="text-[#2E6B4F] font-bold">LOW ({data.metrics.competition})</span>
                </div>
                <div className="p-2 rounded-xl bg-[#20242B]/50 flex justify-between items-center">
                  <span className="text-[#94A3B8]">Capital</span>
                  <span className="text-[#D98E2C] font-bold">{data.metrics.capitalAdequacy} / 100</span>
                </div>
                <div className="p-2 rounded-xl bg-[#20242B]/50 flex justify-between items-center">
                  <span className="text-[#94A3B8]">Risk</span>
                  <span className="text-[#D98E2C] font-bold">{data.metrics.riskLevel}</span>
                </div>
              </div>
            </motion.div>

            {/* Compact Supporting Copy Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-xs sm:text-sm leading-relaxed text-[#E4E9F0]/80 font-normal bg-[#1B2E4A]/60 p-4 rounded-2xl border border-[#E4E9F0]/10 backdrop-blur-md"
            >
              VyapaarIQ combines local market signals, competition, financial feasibility and risk analysis to help you make a smarter business decision before taking a loan.
            </motion.p>

          </div>

        </div>

        {/* Hero Lower Label */}
        <div className="relative z-20 pt-4 border-t border-[#E4E9F0]/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono-data text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B4F]" />
            <span className="uppercase tracking-wider">MARKET • FINANCE • RISK INTELLIGENCE ENGINE</span>
          </div>
          <div className="tracking-widest uppercase">
            VALIDATED FOR INDIAN RURAL & TIER-2/3 COMMERCIAL ECOSYSTEMS
          </div>
        </div>

      </div>
    </section>
  );
};
