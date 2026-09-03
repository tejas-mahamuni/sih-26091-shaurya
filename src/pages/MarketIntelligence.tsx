import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge';
import { defaultDemoAnalysis } from '@/data/demoData';

export const MarketIntelligence: React.FC = () => {
  const data = defaultDemoAnalysis;

  return (
    <div className="w-full text-[#111111] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-mono-data uppercase tracking-widest text-[#C9793A] block mb-2">
          HYPERLOCAL GEOGRAPHIC TELEMETRY
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#111111] mb-4">
          Market Intelligence & Catchment Signals
        </h1>
        <p className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed">
          Analyzes local purchasing power, nearby wholesale mandi trade, footfall routes, and competitor density in target rural/semi-urban clusters.
        </p>
      </div>

      {/* Grid of Telemetry Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-2xl apple-card space-y-3 font-mono-data">
          <div className="flex justify-between items-center text-xs text-[#6B6B6B]">
            <span>MARKET DEMAND INDEX</span>
            <ConfidenceBadge type="local" />
          </div>
          <div className="text-4xl font-extrabold text-[#3F7657]">82 / 100</div>
          <p className="text-xs text-[#6B6B6B] font-sans">High local consumption for agricultural processing & cold storage goods.</p>
        </div>

        <div className="p-6 rounded-2xl apple-card space-y-3 font-mono-data">
          <div className="flex justify-between items-center text-xs text-[#6B6B6B]">
            <span>COMPETITION SATURATION</span>
            <ConfidenceBadge type="official" />
          </div>
          <div className="text-4xl font-extrabold text-[#3F7657]">61 / 100</div>
          <p className="text-xs text-[#6B6B6B] font-sans">Low direct competitor saturation within a 5km radius (3 active units).</p>
        </div>

        <div className="p-6 rounded-2xl apple-card space-y-3 font-mono-data">
          <div className="flex justify-between items-center text-xs text-[#6B6B6B]">
            <span>CATCHMENT POPULATION</span>
            <ConfidenceBadge type="official" />
          </div>
          <div className="text-4xl font-extrabold text-[#111111]">42,000</div>
          <p className="text-xs text-[#6B6B6B] font-sans">Households across 14 feeder panchayats connected via state highway.</p>
        </div>

      </div>

      {/* Competitor Map & Signals Matrix */}
      <div className="p-8 rounded-3xl bg-[#0E1116] text-[#F5F5F3] border border-white/10 space-y-6 global-grid-pattern-dark relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#C9793A]" />
            <span className="font-mono-data text-sm uppercase tracking-wider text-white">
              CATCHMENT NODES & COMPETITOR SIGNALS
            </span>
          </div>
          <span className="text-xs font-mono-data text-[#C9793A]">KANNAUJ RURAL CLUSTER</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
          
          {/* Simulated Map Matrix */}
          <div className="rounded-2xl bg-[#171A20]/90 border border-white/10 p-6 global-grid-pattern-dark relative min-h-[260px] flex flex-col justify-between">
            <div className="flex justify-between text-xs font-mono-data text-white/50">
              <span>LAT: 26.8500° N</span>
              <span>LONG: 79.9167° E</span>
            </div>

            {/* Central Node Display */}
            <div className="my-6 flex items-center justify-center relative">
              <div className="w-32 h-32 rounded-full border border-[#C9793A]/30 animate-pulse absolute" />
              <div className="p-4 rounded-xl bg-[#C9793A]/20 border border-[#C9793A] text-center font-mono-data z-10">
                <div className="text-xs font-bold text-[#C9793A]">MAIN MANDI HUB</div>
                <div className="text-[10px] text-white/70">3.4 km distance</div>
              </div>
            </div>

            <div className="flex justify-between text-[11px] font-mono-data text-white/60">
              <span>● Mandi Hub (High Demand Flow)</span>
              <span>● Active Competitors (3 Stores)</span>
            </div>
          </div>

          {/* Node Breakdown Table */}
          <div className="space-y-3 font-mono-data text-xs">
            <span className="text-white/50 uppercase block font-semibold">SURROUNDING COMMERCIAL NODES</span>
            {data.locationNodes.map(node => (
              <div key={node.id} className="p-3 rounded-xl bg-[#171A20]/90 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">{node.name}</span>
                  <span className="text-[11px] text-white/50">{node.signal}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C9793A]/20 text-[#C9793A] border border-[#C9793A]/40 uppercase">
                  {node.type}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};
