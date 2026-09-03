import React from 'react';
import { ConfidenceBadge, type ConfidenceType } from './ConfidenceBadge';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  confidence?: ConfidenceType;
  level?: 'HIGH' | 'MEDIUM' | 'LOW' | 'GOOD' | 'CAUTION';
  progress?: number; // 0 to 100
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  confidence,
  level,
  progress,
  icon,
  className,
}) => {
  const getLevelColor = (lvl?: string) => {
    switch (lvl) {
      case 'HIGH':
      case 'GOOD':
        return 'text-[#2E6B4F] bg-[#2E6B4F]/10 border-[#2E6B4F]/20';
      case 'MEDIUM':
        return 'text-[#D98E2C] bg-[#D98E2C]/10 border-[#D98E2C]/20';
      case 'LOW':
      case 'CAUTION':
        return 'text-[#B5502F] bg-[#B5502F]/10 border-[#B5502F]/20';
      default:
        return 'text-[#E4E9F0] bg-[#E4E9F0]/10 border-[#E4E9F0]/10';
    }
  };

  return (
    <div
      className={cn(
        "p-5 rounded-2xl bg-[#1B2E4A]/80 border border-[#E4E9F0]/10 hover:border-[#D98E2C]/40 transition-all duration-300 group shadow-lg backdrop-blur-md",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {icon && <div className="text-[#D98E2C] opacity-80 group-hover:opacity-100 transition-opacity">{icon}</div>}
          <span className="text-xs font-medium uppercase tracking-wider text-[#94A3B8]">{label}</span>
        </div>
        {confidence && <ConfidenceBadge type={confidence} size="sm" />}
      </div>

      <div className="flex items-baseline justify-between gap-2 my-1">
        <div className="font-mono-data text-2xl lg:text-3xl font-bold text-[#F6F5F1] tracking-tight">
          {value}
        </div>
        {level && (
          <span className={cn("px-2 py-0.5 text-[10px] font-mono-data font-semibold rounded-md border", getLevelColor(level))}>
            {level}
          </span>
        )}
      </div>

      {subValue && (
        <p className="text-xs text-[#94A3B8] mt-1">{subValue}</p>
      )}

      {progress !== undefined && (
        <div className="w-full bg-[#20242B]/60 h-1.5 rounded-full overflow-hidden mt-3">
          <div
            className="h-full bg-gradient-to-r from-[#D98E2C] to-[#2E6B4F] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
};
