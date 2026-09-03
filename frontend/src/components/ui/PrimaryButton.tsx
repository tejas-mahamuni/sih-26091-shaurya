import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'accent' | 'dark' | 'outline' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  showArrow?: boolean;
  className?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  variant = 'accent',
  size = 'md',
  showArrow = true,
  className,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium tracking-tight rounded-full transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const effectiveVariant = variant === 'amber' ? 'accent' : variant;

  const variants = {
    accent: "bg-[#C9793A] hover:bg-[#b56b30] text-white focus:ring-[#C9793A] shadow-sm",
    dark: "bg-[#111111] hover:bg-[#222222] text-[#F5F5F3] focus:ring-[#111111]",
    outline: "bg-transparent border border-[#111111]/20 hover:border-[#111111] text-[#111111] focus:ring-[#111111]"
  };

  const sizes = {
    sm: "px-4 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5 font-semibold"
  };

  return (
    <button
      className={cn(baseStyles, variants[effectiveVariant], sizes[size], className)}
      {...props}
    >
      <span>{children}</span>
      {showArrow && <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />}
    </button>
  );
};
