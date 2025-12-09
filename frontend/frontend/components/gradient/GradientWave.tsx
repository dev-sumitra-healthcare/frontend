import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface GradientWaveProps {
  /** Wave position */
  position?: 'top' | 'bottom';
  /** Wave height as percentage of container */
  height?: number;
  /** Gradient colors (start to end) */
  colors?: {
    start: string;
    middle?: string;
    end: string;
  };
  /** Animated wave */
  animated?: boolean;
  /** Flip wave vertically */
  flip?: boolean;
  /** Opacity (0-1) */
  opacity?: number;
  /** Additional className */
  className?: string;
}

/**
 * GradientWave - SVG wave background with gradient fill
 *
 * @example
 * ```tsx
 * <GradientWave
 *   position="bottom"
 *   colors={{ start: '#3B82F6', end: '#60A5FA' }}
 *   animated
 * />
 * ```
 */
export const GradientWave: React.FC<GradientWaveProps> = ({
  position = 'bottom',
  height = 25,
  colors = {
    start: '#3B82F6',
    middle: '#60A5FA',
    end: '#93C5FD',
  },
  animated = false,
  flip = false,
  opacity = 1,
  className,
}) => {
  const waveId = `wave-${Math.random().toString(36).substr(2, 9)}`;
  const gradientId = `gradient-${waveId}`;

  const positionClasses = {
    top: 'top-0',
    bottom: 'bottom-0',
  };

  return (
    <div
      className={cn(
        'absolute left-0 w-full overflow-hidden pointer-events-none',
        positionClasses[position],
        flip && 'rotate-180',
        className
      )}
      style={{ height: `${height}%`, opacity }}
    >
      <motion.svg
        className="absolute bottom-0 w-full h-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        initial={{ x: 0 }}
        animate={
          animated
            ? {
                x: [0, -50, 0],
              }
            : {}
        }
        transition={
          animated
            ? {
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : undefined
        }
      >
        {/* Define gradient */}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.start} />
            {colors.middle && (
              <stop offset="50%" stopColor={colors.middle} />
            )}
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
        </defs>

        {/* Wave paths - layered for depth */}
        <motion.path
          fill={`url(#${gradientId})`}
          fillOpacity="0.3"
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,128C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          initial={{ y: 10 }}
          animate={
            animated
              ? {
                  y: [10, 0, 10],
                }
              : {}
          }
          transition={
            animated
              ? {
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : undefined
          }
        />

        <motion.path
          fill={`url(#${gradientId})`}
          fillOpacity="0.5"
          d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,149.3C672,139,768,149,864,154.7C960,160,1056,160,1152,149.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          initial={{ y: 5 }}
          animate={
            animated
              ? {
                  y: [5, -5, 5],
                }
              : {}
          }
          transition={
            animated
              ? {
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : undefined
          }
        />

        <motion.path
          fill={`url(#${gradientId})`}
          fillOpacity="1"
          d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,208C672,213,768,203,864,186.7C960,171,1056,149,1152,154.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          initial={{ y: 0 }}
          animate={
            animated
              ? {
                  y: [0, -10, 0],
                }
              : {}
          }
          transition={
            animated
              ? {
                  duration: 10,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : undefined
          }
        />
      </motion.svg>

      {/* Second wave layer (offset for animation) */}
      {animated && (
        <motion.svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ opacity: 0.5 }}
          initial={{ x: 100 }}
          animate={{
            x: [100, 50, 100],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <path
            fill={`url(#${gradientId})`}
            fillOpacity="0.3"
            d="M0,160L48,149.3C96,139,192,117,288,128C384,139,480,181,576,181.3C672,181,768,139,864,122.7C960,107,1056,117,1152,138.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </motion.svg>
      )}
    </div>
  );
};

GradientWave.displayName = 'GradientWave';
