import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  /** Glass effect variant */
  variant?: 'subtle' | 'default' | 'strong' | 'opaque';
  /** Tinted glass color */
  tint?: 'blue' | 'teal' | 'lavender' | 'red' | 'none';
  /** Enable hover lift effect */
  hover?: boolean;
  /** Enable glow effect */
  glow?: boolean;
  /** Border radius size */
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Use mobile-optimized glass on small screens */
  mobileOptimized?: boolean;
  /** Additional className */
  className?: string;
  /** Children elements */
  children?: React.ReactNode;
}

/**
 * GlassCard - Versatile glass morphism card component
 *
 * @example
 * ```tsx
 * <GlassCard variant="default" hover glow="blue">
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </GlassCard>
 * ```
 */
export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      variant = 'default',
      tint = 'none',
      hover = false,
      glow = false,
      rounded = 'lg',
      padding = 'md',
      mobileOptimized = true,
      className,
      children,
      ...motionProps
    },
    ref
  ) => {
    // Build glass classes
    const glassClass = tint !== 'none'
      ? `glass-${tint}`
      : mobileOptimized
        ? `glass-${variant} md:glass-${variant}`
        : `glass-${variant}`;

    // Build utility classes
    const utilityClasses = cn(
      glassClass,
      // Rounded corners
      rounded === 'sm' && 'rounded-lg',
      rounded === 'md' && 'rounded-xl',
      rounded === 'lg' && 'rounded-2xl',
      rounded === 'xl' && 'rounded-3xl',
      rounded === '2xl' && 'rounded-[1.5rem]',
      rounded === '3xl' && 'rounded-[2rem]',
      // Padding
      padding === 'none' && 'p-0',
      padding === 'sm' && 'p-4',
      padding === 'md' && 'p-6',
      padding === 'lg' && 'p-8',
      padding === 'xl' && 'p-10',
      // Hover effect
      hover && 'hover-lift cursor-pointer',
      // Glow
      glow && `glow-${typeof glow === 'string' ? glow : 'blue'}`,
      // GPU acceleration for smooth animations
      'gpu-accelerated',
      className
    );

    return (
      <motion.div
        ref={ref}
        className={utilityClasses}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
