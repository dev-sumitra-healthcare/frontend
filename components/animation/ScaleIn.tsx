'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

export interface ScaleInProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  /** Children to animate */
  children: React.ReactNode;
  /** Animation delay in seconds */
  delay?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Initial scale (0-1) */
  initialScale?: number;
  /** Only animate once */
  once?: boolean;
  /** Threshold for triggering animation (0-1) */
  threshold?: number;
  /** Spring animation */
  spring?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * ScaleIn - Scroll-triggered scale in animation
 *
 * @example
 * ```tsx
 * <ScaleIn delay={0.2} spring>
 *   <img src="/hero.png" alt="Hero" />
 * </ScaleIn>
 * ```
 */
export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  initialScale = 0.8,
  once = true,
  threshold = 0.1,
  spring = false,
  className,
  ...motionProps
}) => {
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold,
  });

  const springTransition = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    delay,
  };

  const normalTransition = {
    duration,
    delay,
    ease: [0.4, 0, 0.2, 1] as const,
  };

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, scale: initialScale }}
      animate={
        inView
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: initialScale }
      }
      transition={spring ? springTransition : normalTransition}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

ScaleIn.displayName = 'ScaleIn';
