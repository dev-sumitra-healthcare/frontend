'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

export interface FadeInProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  /** Children to animate */
  children: React.ReactNode;
  /** Animation delay in seconds */
  delay?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Vertical offset for fade in effect */
  yOffset?: number;
  /** Only animate once */
  once?: boolean;
  /** Threshold for triggering animation (0-1) */
  threshold?: number;
  /** Additional className */
  className?: string;
}

/**
 * FadeIn - Scroll-triggered fade in animation
 *
 * @example
 * ```tsx
 * <FadeIn delay={0.2} yOffset={20}>
 *   <h2>This will fade in when scrolled into view</h2>
 * </FadeIn>
 * ```
 */
export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  yOffset = 20,
  once = true,
  threshold = 0.1,
  className,
  ...motionProps
}) => {
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold,
  });

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, y: yOffset }}
      animate={
        inView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: yOffset }
      }
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

FadeIn.displayName = 'FadeIn';
