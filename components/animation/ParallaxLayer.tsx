'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ParallaxLayerProps {
  /** Children to apply parallax effect to */
  children: React.ReactNode;
  /** Parallax speed multiplier (negative for reverse scroll) */
  speed?: number;
  /** Horizontal parallax offset multiplier */
  xOffset?: number;
  /** Enable smooth spring animation */
  spring?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * ParallaxLayer - Scroll-based parallax effect
 *
 * @example
 * ```tsx
 * <ParallaxLayer speed={0.5}>
 *   <img src="/background.jpg" alt="Background" />
 * </ParallaxLayer>
 * ```
 */
export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  speed = 0.5,
  xOffset = 0,
  spring = true,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Calculate parallax values
  const yRange = [-100 * speed, 100 * speed];
  const xRange = xOffset !== 0 ? [-50 * xOffset, 50 * xOffset] : [0, 0];

  const y = useTransform(scrollYProgress, [0, 1], yRange);
  const x = useTransform(scrollYProgress, [0, 1], xRange);

  // Apply spring animation if enabled
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const ySpring = spring ? useSpring(y, springConfig) : y;
  const xSpring = spring ? useSpring(x, springConfig) : x;

  if (!mounted) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={cn('will-change-transform', className)}
      style={{
        y: ySpring,
        x: xOffset !== 0 ? xSpring : undefined,
      }}
    >
      {children}
    </motion.div>
  );
};

ParallaxLayer.displayName = 'ParallaxLayer';
