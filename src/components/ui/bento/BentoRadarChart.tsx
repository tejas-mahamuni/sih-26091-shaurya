import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface RadarAxis {
  label: string;
  score: number; // 0 - 100
  weight?: string; // e.g. "25%"
  status?: string;
}

export interface BentoRadarChartProps {
  axes: RadarAxis[];
  size?: number;
  className?: string;
  dark?: boolean;
}

export const BentoRadarChart: React.FC<BentoRadarChartProps> = ({
  axes,
  size = 280,
  className = '',
  dark = false,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!axes || axes.length < 3) {
    return (
      <div className="flex items-center justify-center p-6 text-xs text-[#6B6B6B] font-mono-data">
        Insufficient data for radar visualization (minimum 3 dimensions required)
      </div>
    );
  }

  const cx = 140;
  const cy = 140;
  const r = 90;
  const total = axes.length;
  const levels = [0.25, 0.5, 0.75, 1.0];

  // Helper to compute (x, y) on radar at a given normalized distance (0-1) and index
  const getCoordinates = (index: number, normalizedValue: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const x = cx + r * normalizedValue * Math.cos(angle);
    const y = cy + r * normalizedValue * Math.sin(angle);
    return { x, y };
  };

  // Build polygon path for the data
  const dataPoints = axes.map((axis, i) => {
    const norm = Math.max(0, Math.min(100, axis.score)) / 100;
    return getCoordinates(i, norm);
  });

  const polygonPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ') + ' Z';

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <div className="relative w-full max-w-[300px] aspect-square flex items-center justify-center">
        <svg viewBox="0 0 280 280" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C9793A" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#3F7657" stopOpacity="0.25" />
            </linearGradient>
            <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#C9793A" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Concentric Grid Polygons */}
          {levels.map((lvl) => {
            const gridPoints = Array.from({ length: total }, (_, i) => getCoordinates(i, lvl));
            const gridPath = gridPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ') + ' Z';
            return (
              <path
                key={lvl}
                d={gridPath}
                fill="none"
                stroke={dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(17, 17, 17, 0.08)'}
                strokeWidth={lvl === 1.0 ? '1.2' : '0.8'}
                strokeDasharray={lvl === 1.0 ? 'none' : '3 3'}
              />
            );
          })}

          {/* Radial Axis Lines */}
          {axes.map((_, i) => {
            const edge = getCoordinates(i, 1.0);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={edge.x}
                y2={edge.y}
                stroke={dark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(17, 17, 17, 0.1)'}
                strokeWidth="1"
              />
            );
          })}

          {/* Animated Filled Data Polygon */}
          <motion.path
            d={polygonPath}
            fill="url(#radarGradient)"
            stroke="#C9793A"
            strokeWidth="2.5"
            filter="url(#radarGlow)"
            initial={{ pathLength: 0, opacity: 0, scale: 0.8 }}
            animate={{ pathLength: 1, opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Data Vertex Points & Interactive Targets */}
          {dataPoints.map((p, i) => {
            const axis = axes[i];
            const isHovered = hoveredIdx === i;
            return (
              <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 4}
                  fill={isHovered ? '#111111' : '#C9793A'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
              </g>
            );
          })}

          {/* Axis Labels (Positioned outside outermost polygon) */}
          {axes.map((axis, i) => {
            const labelPos = getCoordinates(i, 1.25);
            const isHovered = hoveredIdx === i;
            return (
              <text
                key={i}
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                className={`text-[10px] font-mono-data transition-colors duration-200 ${
                  isHovered
                    ? 'font-bold fill-[#C9793A]'
                    : dark
                    ? 'fill-white/70 font-medium'
                    : 'fill-[#111111]/80 font-medium'
                }`}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {axis.label}
              </text>
            );
          })}
        </svg>

        {/* Dynamic Center/Tooltip Overlay on Hover */}
        {hoveredIdx !== null && (
          <div className="absolute pointer-events-none px-3 py-1.5 rounded-xl bg-[#111111] text-white text-[11px] font-mono-data shadow-lg border border-white/20 animate-in fade-in zoom-in-95 duration-150">
            <span className="text-[#C9793A] font-bold">{axes[hoveredIdx].label}: </span>
            <span className="font-bold">{axes[hoveredIdx].score.toFixed(0)}/100</span>
            {axes[hoveredIdx].weight && (
              <span className="text-white/60 text-[9px] block">Weight: {axes[hoveredIdx].weight}</span>
            )}
          </div>
        )}
      </div>

      {/* Compact Dimension Pills */}
      <div className="grid grid-cols-3 gap-2 w-full pt-3 border-t border-[#E2E2DC]/60 mt-1">
        {axes.map((axis, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
              hoveredIdx === i
                ? 'bg-[#111111] text-white border-[#111111]'
                : dark
                ? 'bg-white/5 border-white/10 text-white'
                : 'bg-[#F5F5F3] border-[#E2E2DC] text-[#111111] hover:border-[#C9793A]'
            }`}
          >
            <div className="text-[9px] font-mono-data text-[#6B6B6B] truncate">{axis.label}</div>
            <div className="text-xs font-mono-data font-bold">{axis.score.toFixed(0)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
