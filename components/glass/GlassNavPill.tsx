import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface GlassNavPillProps extends Omit<HTMLMotionProps<'a'>, 'ref' | 'href'> {
  /** Navigation href */
  href: string;
  /** Active state */
  active?: boolean;
  /** Icon element */
  icon?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
  /** Children (link text) */
  children?: React.ReactNode;
}

/**
 * GlassNavPill - Glassmorphism navigation pill with active state
 *
 * @example
 * ```tsx
 * <GlassNavPill href="/about" active={pathname === '/about'}>
 *   About
 * </GlassNavPill>
 * ```
 */
export const GlassNavPill = React.forwardRef<HTMLAnchorElement, GlassNavPillProps>(
  (
    {
      href,
      active = false,
      icon,
      disabled = false,
      size = 'md',
      className,
      children,
      ...motionProps
    },
    ref
  ) => {
    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
      md: 'px-4 py-2 text-base rounded-xl gap-2',
      lg: 'px-6 py-3 text-lg rounded-2xl gap-2.5',
    };

    const pillClasses = cn(
      // Base styles
      'relative inline-flex items-center justify-center',
      'font-medium transition-all duration-250',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2',
      // Size
      sizeClasses[size],
      // Active state
      active
        ? 'bg-gradient-primary text-white shadow-glow-blue'
        : 'glass-subtle text-ocean-mid dark:text-white hover:glass-default',
      // Hover effect
      !active && 'hover:scale-105 hover:shadow-glass-md',
      // Disabled state
      disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
      // GPU acceleration
      'gpu-accelerated',
      className
    );

    const MotionLink = motion(Link);

    return (
      <MotionLink
        ref={ref}
        href={href}
        className={pillClasses}
        whileHover={!active && !disabled ? { scale: 1.05 } : {}}
        whileTap={!active && !disabled ? { scale: 0.95 } : {}}
        transition={{ duration: 0.15 }}
        {...motionProps}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
        {active && (
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '80%' }}
            transition={{ duration: 0.3 }}
          />
        )}
      </MotionLink>
    );
  }
);

GlassNavPill.displayName = 'GlassNavPill';
