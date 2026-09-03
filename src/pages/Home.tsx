import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Landmark, Compass } from 'lucide-react';
import { HeroScrollSequence } from '@/components/ui/HeroScrollSequence';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge';
import { defaultDemoAnalysis } from '@/data/demoData';

export const Home: React.FC = () => {
  const data = defaultDemoAnalysis;

  return (
    <div className="w-full text-[#111111]">
      
      {/* Scroll-Driven Pinned Hero Sequence */}
      <HeroScrollSequence />

      {/* Section 1: Problem / Purpose */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center border-t border-[#E2E2DC]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <span className="text-xs font-mono-data uppercase tracking-widest text-[#C9793A]">
            WHY VYAPAARIQ
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#111111] max-w-3xl mx-auto leading-tight">
            A business decision needs more than a loan calculator.
          </h2>
          <p className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed max-w-2xl mx-auto">
            Traditional banks check your credit score. VyapaarIQ checks whether your chosen business will actually succeed in your specific village or town.
          </p>
        </motion.div>
      </section>

      {/* Section 2: Three Pillars */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E2E2DC]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-2xl apple-card space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F5F5F3]/80 border border-[#E2E2DC] flex items-center justify-center text-[#C9793A]">
              <Map className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl font-bold text-[#111111]">MARKET</h3>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              Hyperlocal demand, nearby mandi rates, footfall routes, and competitor density.
            </p>
            <Link to="/market" className="inline-flex items-center gap-1 text-xs font-mono-data text-[#C9793A] font-bold hover:underline">
              Explore Market Intelligence →
            </Link>
          </div>

          <div className="p-8 rounded-2xl apple-card space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F5F5F3]/80 border border-[#E2E2DC] flex items-center justify-center text-[#3F7657]">
              <Landmark className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl font-bold text-[#111111]">FINANCE</h3>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              Real project setup costs, mandatory working capital buffer, bank EMI stress, and payback.
            </p>
            <Link to="/finance" className="inline-flex items-center gap-1 text-xs font-mono-data text-[#3F7657] font-bold hover:underline">
              Explore Financial Plan →
            </Link>
          </div>

          <div className="p-8 rounded-2xl apple-card space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F5F5F3]/80 border border-[#E2E2DC] flex items-center justify-center text-[#111111]">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl font-bold text-[#111111]">DECISION</h3>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              One explainable score and actionable recommendation before taking a bank loan.
            </p>
            <Link to="/risk" className="inline-flex items-center gap-1 text-xs font-mono-data text-[#111111] font-bold hover:underline">
              Explore Stress Simulator →
            </Link>
          </div>

        </div>
      </section>

      {/* Section 3: Compact Product Preview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-[#E2E2DC]">
        <div className="text-center mb-12">
          <span className="text-xs font-mono-data uppercase tracking-widest text-[#C9793A]">
            DECISION ENGINE OUTPUT
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mt-2">
            One decision. Backed by evidence.
          </h2>
        </div>

        <div className="p-8 rounded-3xl bg-[#0E1116] text-[#F5F5F3] border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-8 global-grid-pattern-dark relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs font-mono-data text-white/50 uppercase block mb-1">COMPOSITE VIABILITY INDEX</span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono-data text-6xl font-extrabold text-white">86</span>
              <span className="font-mono-data text-xl text-white/50">/ 100</span>
            </div>
            <p className="text-xs text-white/70 font-mono-data mt-2">
              "Strong local demand supports the opportunity. Retaining working capital reduces repayment risk."
            </p>
          </div>

          <div className="flex flex-col items-end gap-3 shrink-0 relative z-10">
            <span className="px-4 py-2 rounded-xl bg-[#C9793A]/20 border border-[#C9793A] text-[#C9793A] font-mono-data font-bold text-sm">
              PROCEED WITH CONDITIONS
            </span>
            <ConfidenceBadge type="official" />
          </div>
        </div>
      </section>

      {/* Section 4: Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center border-t border-[#E2E2DC]">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mb-4">
          Ready to test your business idea?
        </h2>
        <p className="text-sm sm:text-base text-[#6B6B6B] mb-8 max-w-lg mx-auto">
          Evaluate local demand, setup costs, and loan affordability in under 3 minutes.
        </p>
        <Link to="/analyze">
          <PrimaryButton size="lg" variant="accent">
            Start Analysis →
          </PrimaryButton>
        </Link>
      </section>

    </div>
  );
};
