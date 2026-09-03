import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  dark?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className,
  dark = true,
}) => {
  const alignments = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <div className={cn("flex flex-col max-w-3xl mb-12", alignments[align], className)}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D98E2C]/10 border border-[#D98E2C]/20 text-[#D98E2C] text-[11px] font-mono-data uppercase tracking-widest mb-4 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D98E2C]" />
          {eyebrow}
        </span>
      )}
      
      <h2 className={cn(
        "font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.15]",
        dark ? "text-[#F6F5F1]" : "text-[#20242B]"
      )}>
        {title}
      </h2>

      {subtitle && (
        <p className={cn(
          "mt-4 text-base sm:text-lg leading-relaxed font-normal max-w-2xl",
          dark ? "text-[#94A3B8]" : "text-[#5C6470]"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
