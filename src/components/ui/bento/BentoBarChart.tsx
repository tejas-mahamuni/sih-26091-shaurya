import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface BarDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  secondaryLabel?: string;
  color?: string;
  badge?: string;
  subtext?: string;
}

export interface BentoBarChartProps {
  data: BarDataPoint[];
  valuePrefix?: string;
  valueSuffix?: string;
  height?: number;
  className?: string;
  dark?: boolean;
}

export const BentoBarChart: React.FC<BentoBarChartProps> = ({
  data,
  valuePrefix = '₹',
  valueSuffix = '',
  height = 180,
  className = '',
  dark = false,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 text-xs text-[#6B6B6B] font-mono-data">
        No bar chart data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => Math.max(d.value, d.secondaryValue || 0, 0)), 1);

  const formatVal = (val: number) => {
    return `${valuePrefix}${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}${valueSuffix}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Chart container */}
      <div className="relative pt-6 pb-2" style={{ height }}>
        {/* Grid Guidelines (25%, 50%, 75%, 100%) */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
          {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
            <div key={ratio} className="w-full flex items-center gap-2">
              <span className={`text-[8px] font-mono-data w-12 text-right shrink-0 ${dark ? 'text-white/40' : 'text-[#6B6B6B]'}`}>
                {ratio === 0 ? '0' : formatVal(maxValue * ratio)}
              </span>
              <div className={`flex-1 h-px ${dark ? 'bg-white/10' : 'bg-[#E2E2DC]'}`} />
            </div>
          ))}
        </div>

        {/* Bars Columns */}
        <div className="relative h-full ml-14 flex items-end justify-around gap-2 sm:gap-4 px-2">
          {data.map((item, idx) => {
            const heightPct = Math.max(4, (item.value / maxValue) * 100);
            const secondaryHeightPct = item.secondaryValue !== undefined ? Math.max(4, (item.secondaryValue / maxValue) * 100) : null;
            const isHovered = hoveredIdx === idx;
            const barColor = item.color || '#C9793A';

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer relative"
              >
                {/* Tooltip on Hover */}
                {isHovered && (
                  <div className="absolute -top-7 z-20 px-2.5 py-1 rounded-lg bg-[#111111] text-white text-[10px] font-mono-data whitespace-nowrap shadow-md pointer-events-none animate-in fade-in zoom-in-95">
                    <span className="font-bold">{formatVal(item.value)}</span>
                    {item.secondaryValue !== undefined && (
                      <span className="text-[#3F7657] block text-[9px]">
                        {item.secondaryLabel || 'Net'}: {formatVal(item.secondaryValue)}
                      </span>
                    )}
                  </div>
                )}

                {/* Bars group */}
                <div className="w-full max-w-[48px] flex items-end justify-center gap-1 h-full">
                  {/* Primary Bar */}
                  <div className="flex-1 h-full flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className={`w-full rounded-t-xl transition-all duration-200 ${
                        isHovered ? 'brightness-110 shadow-lg' : 'opacity-90'
                      }`}
                      style={{ backgroundColor: barColor }}
                    />
                  </div>

                  {/* Optional Secondary Bar (e.g. Net Surplus) */}
                  {secondaryHeightPct !== null && (
                    <div className="flex-1 h-full flex items-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${secondaryHeightPct}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.1 + 0.05, ease: [0.16, 1, 0.3, 1] }}
                        className={`w-full rounded-t-xl transition-all duration-200 ${
                          isHovered ? 'brightness-110 shadow-lg' : 'opacity-85'
                        }`}
                        style={{ backgroundColor: '#3F7657' }}
                      />
                    </div>
                  )}
                </div>

                {/* Bar Label */}
                <div className="mt-2 text-center w-full truncate">
                  <span
                    className={`text-[10px] font-mono-data block truncate transition-colors ${
                      isHovered ? 'font-bold text-[#C9793A]' : dark ? 'text-white/70' : 'text-[#6B6B6B]'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend / Metrics Footer */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E2E2DC]/60">
        {data.map((item, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
              hoveredIdx === idx
                ? 'bg-[#111111] text-white border-[#111111]'
                : dark
                ? 'bg-white/5 border-white/10 text-white'
                : 'bg-[#F5F5F3] border-[#E2E2DC] text-[#111111] hover:border-[#C9793A]'
            }`}
          >
            <span className="text-[9px] font-mono-data text-[#6B6B6B] block uppercase truncate">{item.label}</span>
            <span className="text-xs font-mono-data font-bold block">{formatVal(item.value)}</span>
            {item.subtext && <span className="text-[9px] font-mono-data text-[#3F7657] block truncate">{item.subtext}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
