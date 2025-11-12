'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

export interface SlideInProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  /** Children to animate */
  children: React.ReactNode;
  /** Slide direction */
  direction?: 'left' | 'right' | 'up' | 'down';
  /** Animation delay in seconds */
  delay?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Slide distance in pixels */
  distance?: number;
  /** Only animate once */
  once?: boolean;
  /** Threshold for triggering animation (0-1) */
  threshold?: number;
  /** Additional className */
  className?: string;
}

/**
 * SlideIn - Scroll-triggered slide in animation
 *
 * @example
 * ```tsx
 * <SlideIn direction="left" delay={0.3}>
 *   <div>This will slide in from the left</div>
 * </SlideIn>
 * ```
 */
export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 40,
  once = true,
  threshold = 0.1,
  className,
  ...motionProps
}) => {
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold,
  });

  // Calculate initial position based on direction
  const getInitialPosition = () => {
    switch (direction) {
      case 'left':
        return { opacity: 0, x: -distance };
      case 'right':
        return { opacity: 0, x: distance };
      case 'up':
        return { opacity: 0, y: distance };
      case 'down':
        return { opacity: 0, y: -distance };
      default:
        return { opacity: 0, y: distance };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={getInitialPosition()}
      animate={
        inView
          ? { opacity: 1, x: 0, y: 0 }
          : getInitialPosition()
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

SlideIn.displayName = 'SlideIn';
