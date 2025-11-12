/**
 * MedMitra Style Utilities
 * Helper functions for applying design system styles
 */

import { type CSSProperties } from 'react';
import { glassEffects, gradients, shadows, type GlassEffectType } from './design-tokens';

// ============================================================================
// GLASS EFFECT UTILITIES
// ============================================================================

/**
 * Generate glass effect styles
 * @param variant - Glass effect variant (subtle, default, strong, opaque)
 * @param mobile - Use mobile-optimized blur values
 * @returns CSS properties for glass effect
 */
export function getGlassStyles(
  variant: 'subtle' | 'default' | 'strong' | 'opaque' = 'default',
  mobile = false
): CSSProperties {
  const effect = mobile
    ? glassEffects.mobile[variant] || glassEffects.mobile.default
    : glassEffects[variant];

  return {
    background: effect.background,
    backdropFilter: `blur(${effect.backdropBlur})`,
    WebkitBackdropFilter: `blur(${effect.backdropBlur})`, // Safari support
    border: effect.border,
    boxShadow: effect.boxShadow,
  };
}

/**
 * Generate tinted glass styles
 * @param color - Tint color (blue, teal, lavender, red)
 * @param mobile - Use mobile-optimized blur values
 * @returns CSS properties for tinted glass
 */
export function getTintedGlassStyles(
  color: 'blue' | 'teal' | 'lavender' | 'red',
  mobile = false
): CSSProperties {
  const effect = glassEffects.tinted[color];
  const blur = mobile ? '8px' : effect.backdropBlur;

  return {
    background: effect.background,
    backdropFilter: `blur(${blur})`,
    WebkitBackdropFilter: `blur(${blur})`,
    border: effect.border,
    boxShadow: effect.boxShadow,
  };
}

/**
 * Get glass CSS classes for Tailwind (utility class approach)
 */
export const glassClasses = {
  subtle: 'glass-subtle',
  default: 'glass-default',
  strong: 'glass-strong',
  opaque: 'glass-opaque',
  mobile: {
    subtle: 'glass-mobile-subtle',
    default: 'glass-mobile-default',
    strong: 'glass-mobile-strong',
  },
} as const;

// ============================================================================
// GRADIENT UTILITIES
// ============================================================================

/**
 * Get gradient style
 * @param type - Gradient category
 * @param variant - Gradient variant within category
 * @returns CSS gradient string
 */
export function getGradient(
  type: keyof typeof gradients,
  variant?: string
): string {
  const gradientGroup = gradients[type];
  if (typeof gradientGroup === 'string') return gradientGroup;

  if (variant && variant in gradientGroup) {
    return gradientGroup[variant as keyof typeof gradientGroup] as string;
  }

  return gradientGroup.default || Object.values(gradientGroup)[0];
}

/**
 * Create gradient text styles
 * @param gradient - Gradient string or preset name
 * @returns CSS properties for gradient text
 */
export function getGradientTextStyles(
  gradient: string = gradients.text.primary
): CSSProperties {
  return {
    background: gradient,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
  };
}

/**
 * Get gradient CSS classes for Tailwind
 */
export const gradientClasses = {
  primary: 'bg-gradient-primary',
  sky: {
    light: 'bg-gradient-sky-light',
    medium: 'bg-gradient-sky-medium',
    bold: 'bg-gradient-sky-bold',
  },
  teal: 'bg-gradient-teal',
  lavender: 'bg-gradient-lavender',
  ocean: 'bg-gradient-ocean',
  text: {
    primary: 'text-gradient-primary',
    teal: 'text-gradient-teal',
    lavender: 'text-gradient-lavender',
    ocean: 'text-gradient-ocean',
  },
} as const;

// ============================================================================
// SHADOW UTILITIES
// ============================================================================

/**
 * Get shadow styles
 * @param type - Shadow category (glass, glow, innerGlow)
 * @param variant - Shadow variant
 * @returns CSS box-shadow string
 */
export function getShadow(
  type: 'glass' | 'glow' | 'innerGlow',
  variant: string
): string {
  const shadowGroup = shadows[type];
  return shadowGroup[variant as keyof typeof shadowGroup] || shadowGroup.md || '';
}

// ============================================================================
// ANIMATION UTILITIES
// ============================================================================

/**
 * Generate stagger delay styles for child animations
 * @param index - Child index
 * @param baseDelay - Base delay in ms (default: 100)
 * @returns CSS properties with animation delay
 */
export function getStaggerDelay(index: number, baseDelay = 100): CSSProperties {
  return {
    animationDelay: `${index * baseDelay}ms`,
  };
}

/**
 * Get transition styles
 * @param properties - CSS properties to transition
 * @param duration - Duration in ms (default: 250)
 * @param easing - Easing function (default: ease-out)
 * @returns CSS transition string
 */
export function getTransition(
  properties: string[] = ['all'],
  duration = 250,
  easing = 'cubic-bezier(0.4, 0, 0.2, 1)'
): string {
  return properties
    .map((prop) => `${prop} ${duration}ms ${easing}`)
    .join(', ');
}

// ============================================================================
// RESPONSIVE UTILITIES
// ============================================================================

/**
 * Check if device is mobile (client-side only)
 * @returns Boolean indicating if device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Check if user prefers reduced motion
 * @returns Boolean indicating if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if device supports backdrop-filter
 * @returns Boolean indicating backdrop-filter support
 */
export function supportsBackdropFilter(): boolean {
  if (typeof window === 'undefined') return true;
  return (
    CSS.supports('backdrop-filter', 'blur(1px)') ||
    CSS.supports('-webkit-backdrop-filter', 'blur(1px)')
  );
}

/**
 * Get optimized glass variant based on device capabilities
 * @param preferredVariant - Preferred glass variant
 * @returns Optimized glass variant
 */
export function getOptimizedGlassVariant(
  preferredVariant: 'subtle' | 'default' | 'strong' | 'opaque' = 'default'
): { variant: string; mobile: boolean } {
  const isMobile = isMobileDevice();
  const reducedMotion = prefersReducedMotion();
  const hasBackdropFilter = supportsBackdropFilter();

  // If no backdrop filter support, use solid backgrounds
  if (!hasBackdropFilter) {
    return { variant: 'opaque', mobile: true };
  }

  // If reduced motion, use simpler effects
  if (reducedMotion) {
    return { variant: 'subtle', mobile: true };
  }

  // If mobile, use mobile-optimized variant
  if (isMobile) {
    return { variant: preferredVariant, mobile: true };
  }

  return { variant: preferredVariant, mobile: false };
}

// ============================================================================
// HOVER STATE UTILITIES
// ============================================================================

/**
 * Get hover lift styles
 * @param scale - Scale amount (default: 1.02)
 * @param translateY - Y translation in px (default: -2)
 * @returns CSS properties for hover lift effect
 */
export function getHoverLiftStyles(
  scale = 1.02,
  translateY = -2
): { hover: CSSProperties; active: CSSProperties } {
  return {
    hover: {
      transform: `scale(${scale}) translateY(${translateY}px)`,
      transition: getTransition(['transform', 'box-shadow']),
    },
    active: {
      transform: `scale(${scale - 0.01}) translateY(${translateY + 1}px)`,
    },
  };
}

/**
 * Get gradient rotation hover effect
 * @param baseGradient - Base gradient string
 * @returns Object with base and hover gradient values
 */
export function getGradientHoverRotation(baseGradient: string): {
  base: string;
  hover: string;
} {
  // Extract angle from gradient and rotate by 45deg on hover
  const angleMatch = baseGradient.match(/(\d+)deg/);
  if (!angleMatch) return { base: baseGradient, hover: baseGradient };

  const baseAngle = parseInt(angleMatch[1]);
  const hoverAngle = (baseAngle + 45) % 360;
  const hoverGradient = baseGradient.replace(
    `${baseAngle}deg`,
    `${hoverAngle}deg`
  );

  return { base: baseGradient, hover: hoverGradient };
}

// ============================================================================
// FRAMER MOTION VARIANTS
// ============================================================================

/**
 * Common Framer Motion variants for animations
 */
export const motionVariants = {
  // Fade in from bottom
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },

  // Fade in from top
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },

  // Fade in with scale
  fadeInScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },

  // Slide in from left
  slideInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  },

  // Slide in from right
  slideInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
  },

  // Glass card hover
  glassCardHover: {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.02,
      y: -4,
      transition: { duration: 0.25, ease: 'easeOut' },
    },
    tap: { scale: 0.98, y: 0 },
  },

  // Stagger children
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  },

  // Parallax layer
  parallax: (offset: number) => ({
    initial: { y: 0 },
    animate: { y: offset },
  }),
} as const;

/**
 * Get spring transition config
 * @param stiffness - Spring stiffness (default: 300)
 * @param damping - Spring damping (default: 30)
 * @returns Framer Motion spring config
 */
export function getSpringTransition(stiffness = 300, damping = 30) {
  return {
    type: 'spring',
    stiffness,
    damping,
  };
}

// ============================================================================
// UTILITY TYPE GUARDS
// ============================================================================

/**
 * Check if a string is a valid gradient
 */
export function isValidGradient(value: string): boolean {
  return value.includes('gradient(');
}

/**
 * Check if a string is a valid color
 */
export function isValidColor(value: string): boolean {
  return (
    value.startsWith('#') ||
    value.startsWith('rgb') ||
    value.startsWith('hsl') ||
    CSS.supports('color', value)
  );
}
