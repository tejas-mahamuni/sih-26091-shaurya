import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { defaultDemoAnalysis } from '@/data/demoData';

interface HeroVisualizationProps {
  onHoverStateChange?: (hoveredNodeId: string | null) => void;
}

export const HeroVisualization: React.FC<HeroVisualizationProps> = ({
  onHoverStateChange
}) => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const nodes = defaultDemoAnalysis.locationNodes;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleNodeHover = (nodeId: string | null) => {
    setActiveNode(nodeId);
    if (onHoverStateChange) {
      onHoverStateChange(nodeId);
    }
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-auto select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => handleNodeHover(null)}
    >
      {/* Dark Gradient Overlay for optimal text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1B2E4A]/95 via-[#1B2E4A]/80 to-[#20242B]/95 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-40 z-10 pointer-events-none" />

      {/* Topographic Contour Lines SVG */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 z-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="contourGlow" cx={`${mousePos.x}%`} cy={`${mousePos.y}%`} r="40%">
            <stop offset="0%" stopColor="#D98E2C" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#1B2E4A" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#20242B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Dynamic Highlight Radial Light */}
        <rect width="100%" height="100%" fill="url(#contourGlow)" />

        {/* Contour Paths */}
        <path
          d="M -100 200 C 300 100, 600 400, 1200 250 C 1500 180, 1800 350, 2200 200"
          fill="none"
          stroke="#E4E9F0"
          strokeWidth="1"
          strokeDasharray="4 8"
          className="animate-grid-pulse"
        />
        <path
          d="M -100 450 C 400 350, 700 650, 1300 500 C 1600 420, 1900 600, 2300 450"
          fill="none"
          stroke="#D98E2C"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
        <path
          d="M -100 700 C 250 600, 800 850, 1400 700 C 1700 600, 2000 800, 2400 650"
          fill="none"
          stroke="#2E6B4F"
          strokeWidth="1"
          strokeDasharray="6 12"
          strokeOpacity="0.25"
        />
      </svg>

      {/* Grid Coordinates Telemetry */}
      <div className="absolute top-12 left-10 z-20 hidden lg:flex flex-col gap-1 text-[10px] font-mono-data text-[#94A3B8]/60">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D98E2C]" />
          <span>GEO-CATCHMENT: KANNAUJ_DISTRICT_N4</span>
        </div>
        <div>GRID_REF: 26.8500° N, 79.9167° E</div>
        <div>CENSUS_TOWN_FEASIBILITY_ENGINE v2.4</div>
      </div>

      {/* Connecting Routes & Signal Vectors */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
        {/* Draw lines between nodes */}
        {nodes.map((node: typeof defaultDemoAnalysis.locationNodes[0], index: number) => {
          const nextNode = nodes[(index + 1) % nodes.length];
          const isConnectedToActive = activeNode === node.id || activeNode === nextNode.id;

          return (
            <g key={`line-${node.id}-${nextNode.id}`}>
              <line
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${nextNode.x}%`}
                y2={`${nextNode.y}%`}
                stroke={isConnectedToActive ? '#D98E2C' : '#E4E9F0'}
                strokeWidth={isConnectedToActive ? '2' : '1'}
                strokeOpacity={isConnectedToActive ? '0.8' : '0.15'}
                strokeDasharray="4 6"
              />
              {/* Moving Pulse Dot along line */}
              <circle r={isConnectedToActive ? '4' : '2'} fill={isConnectedToActive ? '#D98E2C' : '#2E6B4F'}>
                <animateMotion
                  dur={`${4 + index * 2}s`}
                  repeatCount="indefinite"
                  path={`M ${node.x * 10} ${node.y * 5} L ${nextNode.x * 10} ${nextNode.y * 5}`}
                />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Interactive Location Nodes */}
      <div className="absolute inset-0 z-20">
        {nodes.map((node: typeof defaultDemoAnalysis.locationNodes[0]) => {
          const isActive = activeNode === node.id;

          return (
            <div
              key={node.id}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              onMouseEnter={() => handleNodeHover(node.id)}
              onMouseLeave={() => handleNodeHover(null)}
            >
              {/* Radar pulse ring */}
              <div className="relative flex items-center justify-center">
                <span className={`absolute w-8 h-8 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-[#D98E2C]/40 animate-ping' : 'bg-[#E4E9F0]/10 animate-radar'
                }`} />

                {/* Node Center Dot */}
                <div className={`relative w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  node.type === 'hub' ? 'bg-[#D98E2C] border-[#F6F5F1] shadow-[0_0_12px_#D98E2C]' :
                  node.type === 'competitor' ? 'bg-[#B5502F] border-[#F6F5F1]' :
                  node.type === 'financial' ? 'bg-[#2E6B4F] border-[#F6F5F1]' :
                  'bg-[#1B2E4A] border-[#D98E2C]'
                }`}>
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>

                {/* Always visible minimal node tag */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1B2E4A]/90 border border-[#E4E9F0]/20 px-2 py-0.5 rounded-full text-[10px] font-mono-data text-[#E4E9F0] opacity-80 group-hover:opacity-100 transition-opacity">
                  {node.name}
                </div>

                {/* Hover Reveal Card */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 bg-[#1B2E4A]/95 border border-[#D98E2C] p-3 rounded-xl shadow-2xl z-30 pointer-events-none"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono-data text-[#D98E2C] font-semibold mb-1">
                      <span className="uppercase">{node.type} SIGNAL</span>
                      <span>{(node.intensity * 100).toFixed(0)}% CONFIDENCE</span>
                    </div>
                    <div className="text-xs font-bold text-[#F6F5F1] mb-1">{node.name}</div>
                    <div className="text-[11px] text-[#94A3B8]">{node.signal}</div>
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
