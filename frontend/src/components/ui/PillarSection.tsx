import React from 'react';
import { motion } from 'framer-motion';
import { Map, Landmark, Compass } from 'lucide-react';
import { SectionHeading } from './SectionHeading';

export const PillarSection: React.FC = () => {
  const pillars = [
    {
      number: '01',
      title: 'MARKET',
      sub: 'Local demand & opportunity',
      icon: Map,
      color: 'from-[#D98E2C]/20 to-[#1B2E4A]',
      accentColor: '#D98E2C',
      description: 'Scans hyperlocal buyer density, nearby mandi rates, footfall routes, and direct/indirect competitor saturation.',
      metrics: ['Footfall Density', 'Competitor Saturation', 'Price Sensitivity']
    },
    {
      number: '02',
      title: 'FINANCE',
      sub: 'Feasibility & repayment',
      icon: Landmark,
      color: 'from-[#2E6B4F]/20 to-[#1B2E4A]',
      accentColor: '#2E6B4F',
      description: 'Calculates real project setup costs, mandatory working capital buffer, bank EMI stress, and payback timeline.',
      metrics: ['Working Capital Buffer', 'DSCR Ratio', 'Break-even Month']
    },
    {
      number: '03',
      title: 'DECISION',
      sub: 'One explainable score',
      icon: Compass,
      color: 'from-[#B5502F]/20 to-[#1B2E4A]',
      accentColor: '#B5502F',
      description: 'Synthesizes non-linear financial and geographic signals into a clear, transparent viability recommendation.',
      metrics: ['Viability Index', 'Risk Mitigation', 'Scheme Eligibility']
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Transition Header */}
      <SectionHeading
        eyebrow="THREE PILLARS OF DECISION INTELLIGENCE"
        title="A loan is a financial decision. A business is a local decision."
        subtitle="VyapaarIQ brings both into one view."
        align="center"
      />

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;

          return (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="group relative rounded-3xl bg-[#1B2E4A] border border-[#E4E9F0]/15 p-8 flex flex-col justify-between overflow-hidden hover:border-[#D98E2C]/50 transition-all duration-300 shadow-xl"
            >
              {/* Subtle Ambient Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-b ${pillar.color} opacity-40 group-hover:opacity-70 transition-opacity`} />
              
              <div className="relative z-10">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#20242B]/80 border border-[#E4E9F0]/10 text-[#D98E2C] group-hover:scale-110 transition-transform"
                    style={{ color: pillar.accentColor }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono-data text-2xl font-bold text-[#E4E9F0]/30 group-hover:text-[#F6F5F1] transition-colors">
                    {pillar.number}
                  </span>
                </div>

                {/* Pillar Title */}
                <h3 className="font-display text-2xl font-bold text-[#F6F5F1] tracking-tight mb-1">
                  {pillar.title}
                </h3>
                <p className="text-xs font-mono-data text-[#D98E2C] uppercase tracking-wider mb-4">
                  {pillar.sub}
                </p>

                {/* Description */}
                <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
                  {pillar.description}
                </p>
              </div>

              {/* Metrics Pill List */}
              <div className="relative z-10 pt-6 border-t border-[#E4E9F0]/10">
                <span className="text-[11px] font-mono-data uppercase text-[#94A3B8] block mb-2">Key Signals:</span>
                <div className="flex flex-wrap gap-1.5">
                  {pillar.metrics.map(m => (
                    <span key={m} className="px-2.5 py-1 rounded-full text-[11px] font-mono-data bg-[#20242B]/60 text-[#E4E9F0] border border-[#E4E9F0]/10">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>

    </section>
  );
};
