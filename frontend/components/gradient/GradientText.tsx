import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface GradientTextProps
  extends Omit<HTMLMotionProps<'span'>, 'ref'> {
  /** Text content */
  children: React.ReactNode;
  /** Gradient preset */
  gradient?: 'primary' | 'teal' | 'lavender' | 'ocean';
  /** Heading size */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  /** Animated gradient rotation */
  animated?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * GradientText - Animated gradient text component
 *
 * @example
 * ```tsx
 * <GradientText gradient="primary" as="h1" animated>
 *   Welcome to MedMitra
 * </GradientText>
 * ```
 */
export const GradientText = React.forwardRef<
  HTMLElement,
  GradientTextProps
>(
  (
    {
      children,
      gradient = 'primary',
      as = 'span',
      animated = false,
      className,
      ...motionProps
    },
    ref
  ) => {
    const Component = motion[as] as any;

    const textClasses = cn(
      // Gradient text effect
      `text-gradient-${gradient}`,
      // Animated gradient
      animated && 'animate-gradient-rotate',
      // Use block for headings to prevent word-breaking, inline-block for spans
      as === 'span' || as === 'p' ? 'inline' : 'block',
      className
    );

    return (
      <Component
        ref={ref}
        className={textClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        {...motionProps}
      >
        {children}
      </Component>
    );
  }
);

GradientText.displayName = 'GradientText';
