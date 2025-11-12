import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface GlassPanelProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  /** Panel variant */
  variant?: 'subtle' | 'default' | 'strong' | 'opaque';
  /** Floating effect with offset */
  floating?: boolean;
  /** Floating offset in pixels */
  floatingOffset?: number;
  /** Border radius */
  rounded?: 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  /** Padding */
  padding?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Shadow intensity */
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  /** Position (for floating panels) */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  /** Z-index layer */
  layer?: 'base' | 'floating' | 'overlay';
  /** Additional className */
  className?: string;
  /** Children */
  children?: React.ReactNode;
}

/**
 * GlassPanel - Floating glass panel for overlays and modals
 *
 * @example
 * ```tsx
 * <GlassPanel floating variant="strong" position="center">
 *   <h2>Welcome</h2>
 *   <p>Content goes here</p>
 * </GlassPanel>
 * ```
 */
export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      variant = 'default',
      floating = false,
      floatingOffset = 20,
      rounded = 'xl',
      padding = 'lg',
      shadow = 'lg',
      position = 'center',
      layer = 'floating',
      className,
      children,
      ...motionProps
    },
    ref
  ) => {
    // Position classes for floating panels
    const positionClasses = {
      'top-left': 'top-0 left-0',
      'top-right': 'top-0 right-0',
      'bottom-left': 'bottom-0 left-0',
      'bottom-right': 'bottom-0 right-0',
      center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    };

    // Z-index layers
    const layerClasses = {
      base: 'z-0',
      floating: 'z-10',
      overlay: 'z-20',
    };

    // Shadow classes
    const shadowClasses = {
      sm: 'shadow-glass-sm',
      md: 'shadow-glass-md',
      lg: 'shadow-glass-lg',
      xl: 'shadow-glass-xl',
    };

    const panelClasses = cn(
      // Glass effect
      `glass-${variant}`,
      // Rounded corners
      rounded === 'md' && 'rounded-xl',
      rounded === 'lg' && 'rounded-2xl',
      rounded === 'xl' && 'rounded-3xl',
      rounded === '2xl' && 'rounded-[1.5rem]',
      rounded === '3xl' && 'rounded-[2rem]',
      // Padding
      padding === 'sm' && 'p-4',
      padding === 'md' && 'p-6',
      padding === 'lg' && 'p-8',
      padding === 'xl' && 'p-10',
      padding === '2xl' && 'p-12',
      // Shadow
      shadowClasses[shadow],
      // Floating
      floating && 'fixed',
      floating && positionClasses[position],
      floating && `m-[${floatingOffset}px]`,
      // Z-index
      layerClasses[layer],
      // GPU acceleration
      'gpu-accelerated',
      className
    );

    const floatAnimation = floating
      ? {
          y: [0, -10, 0],
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }
      : {};

    return (
      <motion.div
        ref={ref}
        className={panelClasses}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          ...floatAnimation,
        }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';
