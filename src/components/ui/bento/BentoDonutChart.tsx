import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
  sublabel?: string;
}

export interface BentoDonutChartProps {
  segments: DonutSegment[];
  totalLabel?: string;
  totalValue?: string;
  size?: number;
  thickness?: number;
  className?: string;
  dark?: boolean;
}

export const BentoDonutChart: React.FC<BentoDonutChartProps> = ({
  segments,
  totalLabel = 'TOTAL',
  totalValue,
  size = 200,
  thickness = 24,
  className = '',
  dark = false,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0);

  if (total <= 0) {
    return (
      <div className="flex items-center justify-center p-6 text-xs text-[#6B6B6B] font-mono-data">
        No composition data available
      </div>
    );
  }

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  const displayTotal = totalValue || `₹${total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-6 ${className}`}>
      {/* Donut SVG */}
      <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90 transform overflow-visible">
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={dark ? 'rgba(255, 255, 255, 0.06)' : '#E2E2DC'}
            strokeWidth={thickness}
          />

          {/* Animated Donut Segments */}
          {segments.map((segment, i) => {
            const percent = total > 0 ? segment.value / total : 0;
            const strokeDasharray = `${percent * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedPercent * circumference;
            accumulatedPercent += percent;
            const isHovered = hoveredIdx === i;

            return (
              <motion.circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={isHovered ? thickness + 4 : thickness}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer transition-all duration-200"
              />
            );
          })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-3">
          <span className={`text-[9px] font-mono-data uppercase tracking-wider ${dark ? 'text-white/50' : 'text-[#6B6B6B]'}`}>
            {hoveredIdx !== null ? segments[hoveredIdx].label : totalLabel}
          </span>
          <span
            className={`font-mono-data font-bold leading-tight ${
              displayTotal.length > 12 ? 'text-xs' : 'text-sm sm:text-base'
            } ${dark ? 'text-white' : 'text-[#111111]'}`}
          >
            {hoveredIdx !== null
              ? `₹${segments[hoveredIdx].value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
              : displayTotal}
          </span>
          {hoveredIdx !== null && (
            <span className="text-[10px] font-mono-data text-[#C9793A] font-bold">
              {((segments[hoveredIdx].value / total) * 100).toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      {/* Accessible Interactive Legend */}
      <div className="flex-1 space-y-2 w-full min-w-0">
        {segments.map((segment, i) => {
          const pct = ((segment.value / total) * 100).toFixed(1);
          const isHovered = hoveredIdx === i;
          return (
            <div
              key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isHovered
                  ? 'bg-[#111111] text-white border-[#111111] shadow-sm'
                  : dark
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-[#F5F5F3]/70 border-[#E2E2DC] text-[#111111] hover:border-[#C9793A]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: segment.color }} />
                <div className="truncate">
                  <div className="text-xs font-bold truncate">{segment.label}</div>
                  {segment.sublabel && (
                    <div className={`text-[10px] font-mono-data truncate ${isHovered ? 'text-white/70' : 'text-[#6B6B6B]'}`}>
                      {segment.sublabel}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-mono-data font-bold">
                  ₹{segment.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
                <div className={`text-[10px] font-mono-data ${isHovered ? 'text-[#C9793A]' : 'text-[#6B6B6B]'}`}>{pct}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
