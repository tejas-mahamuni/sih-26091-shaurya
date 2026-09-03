import React from 'react';
import { cn } from '@/lib/utils';

export type ConfidenceType = 'official' | 'local' | 'estimated';

interface ConfidenceBadgeProps {
  type: ConfidenceType;
  size?: 'sm' | 'md';
  className?: string;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ type, size = 'sm', className }) => {
  const configs = {
    official: {
      label: 'Official data',
      styles: 'bg-[#3F7657]/10 text-[#3F7657] border-[#3F7657]/20',
      dot: 'bg-[#3F7657]',
    },
    local: {
      label: 'Confirmed locally',
      styles: 'bg-[#C9793A]/10 text-[#C9793A] border-[#C9793A]/20',
      dot: 'bg-[#C9793A]',
    },
    estimated: {
      label: 'Estimated',
      styles: 'bg-[#111111]/5 text-[#6B6B6B] border-[#111111]/10',
      dot: 'bg-[#6B6B6B]',
    },
  };

  const config = configs[type] || configs.estimated;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-mono-data border transition-colors",
        config.styles,
        size === 'md' ? "px-3 py-1 text-xs" : "px-2.5 py-0.5 text-[11px]",
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)} />
      <span>{config.label}</span>
    </span>
  );
};
