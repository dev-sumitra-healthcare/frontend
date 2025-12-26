import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface GlassButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  /** Button variant */
  variant?: 'glass' | 'gradient' | 'outline';
  /** Button size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Gradient color scheme (for gradient variant) */
  gradient?: 'primary' | 'teal' | 'lavender' | 'ocean';
  /** Glass tint color (for glass variant) */
  tint?: 'blue' | 'teal' | 'lavender' | 'none';
  /** Full width button */
  fullWidth?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Icon before text */
  iconBefore?: React.ReactNode;
  /** Icon after text */
  iconAfter?: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Children (button text) */
  children?: React.ReactNode;
}

/**
 * GlassButton - Glassmorphism button with multiple variants
 *
 * @example
 * ```tsx
 * <GlassButton variant="gradient" gradient="primary" size="lg">
 *   Get Started
 * </GlassButton>
 * ```
 */
export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      variant = 'glass',
      size = 'md',
      gradient = 'primary',
      tint = 'none',
      fullWidth = false,
      loading = false,
      disabled = false,
      iconBefore,
      iconAfter,
      className,
      children,
      ...motionProps
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    // Base classes
    const baseClasses = cn(
      'relative inline-flex items-center justify-center gap-2',
      'font-semibold transition-all duration-250',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'gpu-accelerated'
    );

    // Size classes
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm rounded-lg',
      md: 'px-6 py-3 text-base rounded-xl',
      lg: 'px-8 py-4 text-lg rounded-2xl',
      xl: 'px-10 py-5 text-xl rounded-2xl',
    };

    // Variant classes
    const variantClasses = {
      glass: cn(
        tint !== 'none' ? `glass-${tint}` : 'glass-default',
        'hover:scale-105 hover:shadow-lg active:scale-95',
        'text-ocean-deep dark:text-white'
      ),
      gradient: cn(
        `bg-gradient-${gradient}`,
        'text-white hover:opacity-90 hover:scale-105 active:scale-95',
        'shadow-glass-md hover:shadow-glass-lg',
        'animate-gradient-rotate'
      ),
      outline: cn(
        'bg-transparent border-2 border-sky',
        'text-sky hover:bg-sky hover:text-white',
        'hover:scale-105 active:scale-95'
      ),
    };

    const buttonClasses = cn(
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      fullWidth && 'w-full',
      className
    );

    return (
      <motion.button
        ref={ref}
        className={buttonClasses}
        disabled={isDisabled}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        {...motionProps}
      >
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
        {!loading && iconBefore}
        {children}
        {!loading && iconAfter}
      </motion.button>
    );
  }
);

GlassButton.displayName = 'GlassButton';
