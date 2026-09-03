import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WordsPullUpProps {
  text: string;
  className?: string;
  delay?: number;
  showIndicator?: boolean;
}

export const WordsPullUp: React.FC<WordsPullUpProps> = ({
  text,
  className,
  delay = 0,
  showIndicator = false,
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: { y: 36, opacity: 0, filter: 'blur(8px)' },
    show: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 24,
        stiffness: 140,
      },
    },
  };

  const words = text.split(' ');

  return (
    <motion.h1
      className={cn(
        "font-display tracking-tight font-bold leading-[1.05] text-[#F6F5F1] inline-flex flex-wrap items-center gap-x-[0.25em] gap-y-1",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          variants={wordVariants}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}

      {showIndicator && (
        <motion.span
          variants={wordVariants}
          className="inline-flex items-center justify-center ml-2 relative"
        >
          <span className="w-3 h-3 rounded-full bg-[#D98E2C] inline-block shadow-[0_0_12px_#D98E2C]" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#2E6B4F] animate-ping opacity-75" />
        </motion.span>
      )}
    </motion.h1>
  );
};
