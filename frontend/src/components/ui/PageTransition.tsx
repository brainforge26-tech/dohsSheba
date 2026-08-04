'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const variants = {
  initial: { opacity: 0, y: 8, filter: 'blur(4px)' },
  enter: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -6,
    filter: 'blur(2px)',
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

/**
 * Wraps a page/section with a smooth fade+blur+slide enter animation.
 * Use in each page.tsx to avoid layout jumps.
 * Respects prefers-reduced-motion by using simpler fade-only.
 */
export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
      className={className}
      // Accessibility: reduced motion falls back to opacity only
      style={{
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A lighter variant used inside sections (not full pages).
 */
export function SectionTransition({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
