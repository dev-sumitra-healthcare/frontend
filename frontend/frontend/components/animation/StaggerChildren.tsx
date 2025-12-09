'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

export interface StaggerChildrenProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  /** Children to animate */
  children: React.ReactNode;
  /** Stagger delay between children in seconds */
  staggerDelay?: number;
  /** Initial delay before first child animates */
  initialDelay?: number;
  /** Animation variant */
  variant?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale';
  /** Animation duration for each child */
  duration?: number;
  /** Distance for slide variants */
  distance?: number;
  /** Only animate once */
  once?: boolean;
  /** Threshold for triggering animation (0-1) */
  threshold?: number;
  /** Additional className */
  className?: string;
}

/**
 * StaggerChildren - Animate children sequentially with stagger effect
 *
 * @example
 * ```tsx
 * <StaggerChildren variant="slide-up" staggerDelay={0.1}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </StaggerChildren>
 * ```
 */
export const StaggerChildren: React.FC<StaggerChildrenProps> = ({
  children,
  staggerDelay = 0.1,
  initialDelay = 0,
  variant = 'fade',
  duration = 0.5,
  distance = 20,
  once = true,
  threshold = 0.1,
  className,
  ...motionProps
}) => {
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold,
  });

  // Define animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };

  const getChildVariants = () => {
    switch (variant) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration },
          },
        };
      case 'slide-up':
        return {
          hidden: { opacity: 0, y: distance },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration },
          },
        };
      case 'slide-down':
        return {
          hidden: { opacity: 0, y: -distance },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration },
          },
        };
      case 'slide-left':
        return {
          hidden: { opacity: 0, x: distance },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration },
          },
        };
      case 'slide-right':
        return {
          hidden: { opacity: 0, x: -distance },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration },
          },
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { duration },
          },
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration },
          },
        };
    }
  };

  const childVariants = getChildVariants();

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      {...motionProps}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={childVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

StaggerChildren.displayName = 'StaggerChildren';
