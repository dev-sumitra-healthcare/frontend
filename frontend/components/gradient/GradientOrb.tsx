import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface GradientOrbProps {
  /** Orb size in pixels */
  size?: number;
  /** Gradient color scheme */
  gradient?: 'sky' | 'teal' | 'lavender';
  /** Blur amount */
  blur?: number;
  /** Opacity (0-1) */
  opacity?: number;
  /** Enable mouse follow effect */
  mouseFollow?: boolean;
  /** Enable floating animation */
  floating?: boolean;
  /** Floating animation duration in seconds */
  floatDuration?: number;
  /** Initial position */
  position?: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
  /** Z-index */
  zIndex?: number;
  /** Additional className */
  className?: string;
}

/**
 * GradientOrb - Floating gradient sphere with parallax and mouse-follow effects
 *
 * @example
 * ```tsx
 * <GradientOrb
 *   size={400}
 *   gradient="sky"
 *   blur={100}
 *   mouseFollow
 *   position={{ top: '10%', left: '20%' }}
 * />
 * ```
 */
export const GradientOrb: React.FC<GradientOrbProps> = ({
  size = 300,
  gradient = 'sky',
  blur = 80,
  opacity = 0.6,
  mouseFollow = false,
  floating = true,
  floatDuration = 6,
  position = {},
  zIndex = -1,
  className,
}) => {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 100 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);

    if (!mouseFollow) return;

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;

      // Convert mouse position to -1 to 1 range
      const xPct = (clientX / innerWidth - 0.5) * 2;
      const yPct = (clientY / innerHeight - 0.5) * 2;

      // Move orb (parallax effect with reduced movement)
      mouseX.set(xPct * 50);
      mouseY.set(yPct * 50);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseFollow, mouseX, mouseY]);

  if (!mounted) return null;

  // Gradient classes
  const gradientClasses = {
    sky: 'bg-radial-sky',
    teal: 'bg-radial-teal',
    lavender: 'bg-gradient-lavender',
  };

  const floatAnimation = floating
    ? {
        y: [0, -20, 0],
        x: [0, 10, 0],
        scale: [1, 1.1, 1],
      }
    : {};

  return (
    <motion.div
      className={cn(
        'absolute rounded-full pointer-events-none',
        gradientClasses[gradient],
        className
      )}
      style={{
        width: size,
        height: size,
        filter: `blur(${blur}px)`,
        opacity,
        zIndex,
        ...position,
        x: mouseFollow ? x : undefined,
        y: mouseFollow ? y : undefined,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity,
        scale: 1,
        ...floatAnimation,
      }}
      transition={{
        opacity: { duration: 1 },
        scale: { duration: 1 },
        y: floating
          ? {
              duration: floatDuration,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          : undefined,
        x: floating
          ? {
              duration: floatDuration * 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          : undefined,
      }}
    />
  );
};

GradientOrb.displayName = 'GradientOrb';
