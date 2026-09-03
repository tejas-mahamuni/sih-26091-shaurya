import React from 'react';
import { cn } from '@/lib/utils';

export interface BentoMetricProps {
  label: string;
  value: string | number;
  subtext?: string;
  badge?: string;
  badgeType?: 'positive' | 'warning' | 'neutral' | 'accent' | 'negative';
  trend?: {
    value: string;
    positive?: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export const BentoMetric: React.FC<BentoMetricProps> = ({
  label,
  value,
  subtext,
  badge,
  badgeType = 'neutral',
  trend,
  icon,
  className,
  dark = false,
}) => {
  const badgeStyles = {
    positive: 'bg-[#3F7657]/10 text-[#3F7657] border-[#3F7657]/20',
    warning: 'bg-[#C9793A]/10 text-[#C9793A] border-[#C9793A]/20',
    negative: 'bg-red-50 text-red-600 border-red-200',
    accent: 'bg-[#C9793A] text-white border-[#C9793A]',
    neutral: dark ? 'bg-white/10 text-white/70 border-white/10' : 'bg-[#F5F5F3] text-[#6B6B6B] border-[#E2E2DC]',
  };

  return (
    <div
      className={cn(
        'p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between',
        dark
          ? 'bg-white/5 border-white/10 text-white hover:border-white/20'
          : 'bg-[#F5F5F3]/80 border-[#E2E2DC] text-[#111111] hover:border-[#C9793A]/40',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className={cn('text-[10px] font-mono-data uppercase tracking-wider', dark ? 'text-white/50' : 'text-[#6B6B6B]')}>
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          {icon && <span className={cn('text-xs', dark ? 'text-white/60' : 'text-[#C9793A]')}>{icon}</span>}
          {badge && (
            <span className={cn('px-2 py-0.5 rounded-md text-[9px] font-mono-data font-bold border', badgeStyles[badgeType])}>
              {badge}
            </span>
          )}
        </div>
      </div>

      <div className="my-1">
        <span className={cn('font-mono-data text-2xl font-bold tracking-tight', dark ? 'text-white' : 'text-[#111111]')}>
          {value}
        </span>
      </div>

      {(subtext || trend) && (
        <div className="flex items-center justify-between text-[10px] font-mono-data pt-1 border-t border-current/10">
          {subtext && <span className={cn('truncate', dark ? 'text-white/50' : 'text-[#6B6B6B]')}>{subtext}</span>}
          {trend && (
            <span className={cn('font-bold ml-auto shrink-0', trend.positive ? 'text-[#3F7657]' : 'text-[#C9793A]')}>
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
