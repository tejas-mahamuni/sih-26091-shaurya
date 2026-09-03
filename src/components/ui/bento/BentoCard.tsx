import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BentoCardProps {
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  onClick?: () => void;
  headerAction?: React.ReactNode;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  title,
  subtitle,
  badge,
  icon,
  children,
  className,
  dark = false,
  onClick,
  headerAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={cn(
        'relative rounded-3xl p-5 sm:p-6 transition-all duration-300 overflow-hidden flex flex-col justify-between',
        dark
          ? 'bg-[#0E1116] text-[#F5F5F3] border border-white/10 shadow-2xl global-grid-pattern-dark'
          : 'bg-white/95 text-[#111111] border border-[#E2E2DC] shadow-sm hover:shadow-md hover:border-[#C9793A]/40 backdrop-blur-md',
        className
      )}
    >
      {(title || badge || icon || headerAction) && (
        <div className="flex items-start justify-between gap-3 mb-4 shrink-0">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              {icon && (
                <div
                  className={cn(
                    'w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0',
                    dark ? 'bg-white/10 text-[#C9793A]' : 'bg-[#C9793A]/10 text-[#C9793A]'
                  )}
                >
                  {icon}
                </div>
              )}
              {title && (
                <h3
                  className={cn(
                    'font-display font-bold text-sm sm:text-base tracking-tight truncate',
                    dark ? 'text-white' : 'text-[#111111]'
                  )}
                >
                  {title}
                </h3>
              )}
            </div>
            {subtitle && (
              <p
                className={cn(
                  'text-xs font-mono-data',
                  dark ? 'text-white/50' : 'text-[#6B6B6B]'
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {badge}
            {headerAction}
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0">{children}</div>
    </motion.div>
  );
};
