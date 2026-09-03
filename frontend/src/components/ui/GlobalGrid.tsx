import React from 'react';
import { cn } from '@/lib/utils';

interface GlobalGridProps {
  className?: string;
}

export const GlobalGrid: React.FC<GlobalGridProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 pointer-events-none z-0 global-grid-pattern transition-opacity duration-300",
        className
      )}
      aria-hidden="true"
    />
  );
};
