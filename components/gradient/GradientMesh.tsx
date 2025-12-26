import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface GradientMeshProps {
  /** Mesh variant */
  variant?: 'hero' | 'subtle' | 'waves';
  /** Animated mesh (subtle pulsing effect) */
  animated?: boolean;
  /** Base background color */
  baseColor?: string;
  /** Overlay opacity (0-1) */
  overlayOpacity?: number;
  /** Additional className */
  className?: string;
  /** Children elements */
  children?: React.ReactNode;
}

/**
 * GradientMesh - Animated mesh gradient background
 *
 * @example
 * ```tsx
 * <GradientMesh variant="hero" animated>
 *   <div className="relative z-10">
 *     <h1>Your content here</h1>
 *   </div>
 * </GradientMesh>
 * ```
 */
export const GradientMesh: React.FC<GradientMeshProps> = ({
  variant = 'subtle',
  animated = false,
  baseColor = '#F8FAFC',
  overlayOpacity = 1,
  className,
  children,
}) => {
  const meshClasses = {
    hero: 'bg-mesh-hero',
    subtle: 'bg-mesh-subtle',
    waves: 'bg-mesh-waves',
  };

  return (
    <div className={cn('relative w-full h-full', className)}>
      {/* Base background */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: baseColor }}
      />

      {/* Mesh gradient overlay */}
      <motion.div
        className={cn(
          'absolute inset-0',
          meshClasses[variant]
        )}
        style={{ opacity: overlayOpacity }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: overlayOpacity,
          scale: animated ? [1, 1.05, 1] : 1,
        }}
        transition={{
          opacity: { duration: 1 },
          scale: animated
            ? {
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : undefined,
        }}
      />

      {/* Noise texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '150px',
        }}
      />

      {/* Content */}
      {children && (
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      )}
    </div>
  );
};

GradientMesh.displayName = 'GradientMesh';
