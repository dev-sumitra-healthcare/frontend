/**
 * MedMitra Design Tokens
 * Complete design system for glassmorphism and gradient aesthetics
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const colors = {
  // Deep Ocean - Dark navigation elements
  ocean: {
    deep: '#0A2540',
    mid: '#1E3A5F',
    light: '#2D4A75',
  },

  // Sky Gradient - Primary CTAs
  sky: {
    deep: '#3B82F6',
    DEFAULT: '#60A5FA',
    light: '#93C5FD',
    pale: '#BFDBFE',
  },

  // Arctic Blue - Background gradients
  arctic: {
    deep: '#DBEAFE',
    DEFAULT: '#EFF6FF',
    light: '#F0F9FF',
  },

  // Glass White - Glassmorphism layers
  glass: {
    '100': 'rgba(255, 255, 255, 0.1)',
    '200': 'rgba(255, 255, 255, 0.15)',
    '250': 'rgba(255, 255, 255, 0.25)',
    '300': 'rgba(255, 255, 255, 0.3)',
    '400': 'rgba(255, 255, 255, 0.4)',
    '500': 'rgba(255, 255, 255, 0.5)',
    '600': 'rgba(255, 255, 255, 0.6)',
    '700': 'rgba(255, 255, 255, 0.7)',
    '800': 'rgba(255, 255, 255, 0.8)',
    '900': 'rgba(255, 255, 255, 0.9)',
    '950': 'rgba(255, 255, 255, 0.95)',
  },

  // Teal Accent - Success states
  teal: {
    deep: '#06B6D4',
    DEFAULT: '#22D3EE',
    light: '#67E8F9',
  },

  // Lavender Blue - Hover effects
  lavender: {
    deep: '#818CF8',
    DEFAULT: '#A5B4FC',
    light: '#C7D2FE',
  },

  // Pearl White - Base backgrounds
  pearl: '#F8FAFC',

  // Gradient overlays (for mesh backgrounds)
  mesh: {
    blue: 'rgba(59, 130, 246, 0.4)',
    cyan: 'rgba(34, 211, 238, 0.3)',
    lavender: 'rgba(129, 140, 248, 0.3)',
    white: 'rgba(255, 255, 255, 0.5)',
  },
} as const;

// ============================================================================
// GRADIENT PRESETS
// ============================================================================

export const gradients = {
  // Primary gradients for buttons and CTAs
  primary: {
    default: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
    hover: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
    vertical: 'linear-gradient(180deg, #3B82F6 0%, #60A5FA 100%)',
  },

  // Sky gradients for backgrounds
  sky: {
    light: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #BFDBFE 100%)',
    medium: 'linear-gradient(135deg, #BFDBFE 0%, #93C5FD 50%, #60A5FA 100%)',
    bold: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
  },

  // Teal accent gradients
  teal: {
    default: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)',
    light: 'linear-gradient(135deg, #22D3EE 0%, #67E8F9 100%)',
  },

  // Lavender gradients for hover states
  lavender: {
    default: 'linear-gradient(135deg, #818CF8 0%, #A5B4FC 100%)',
    light: 'linear-gradient(135deg, #A5B4FC 0%, #C7D2FE 100%)',
  },

  // Ocean gradients for dark elements
  ocean: {
    deep: 'linear-gradient(135deg, #0A2540 0%, #1E3A5F 100%)',
    medium: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A75 100%)',
  },

  // Radial gradients for backgrounds
  radial: {
    sky: 'radial-gradient(circle at 50% 50%, #60A5FA 0%, #3B82F6 50%, #2563EB 100%)',
    teal: 'radial-gradient(circle at 50% 50%, #67E8F9 0%, #22D3EE 50%, #06B6D4 100%)',
    lavender: 'radial-gradient(circle at 50% 50%, #C7D2FE 0%, #A5B4FC 50%, #818CF8 100%)',
    mesh: 'radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(34, 211, 238, 0.2) 0%, transparent 50%)',
  },

  // Mesh gradients for hero sections
  mesh: {
    hero: `
      radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.3) 0px, transparent 50%),
      radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 0.1) 0px, transparent 50%),
      radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 0.1) 0px, transparent 50%),
      radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 0.2) 0px, transparent 50%),
      radial-gradient(at 97% 96%, hsla(38, 60%, 74%, 0.1) 0px, transparent 50%),
      radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 0.3) 0px, transparent 50%),
      radial-gradient(at 79% 53%, hsla(343, 68%, 79%, 0.1) 0px, transparent 50%)
    `,
    subtle: `
      radial-gradient(at 40% 20%, hsla(215, 98%, 61%, 0.15) 0px, transparent 50%),
      radial-gradient(at 80% 0%, hsla(189, 100%, 56%, 0.15) 0px, transparent 50%),
      radial-gradient(at 0% 50%, hsla(256, 96%, 67%, 0.1) 0px, transparent 50%),
      radial-gradient(at 80% 50%, hsla(215, 98%, 61%, 0.1) 0px, transparent 50%),
      radial-gradient(at 0% 100%, hsla(256, 96%, 67%, 0.05) 0px, transparent 50%)
    `,
    waves: `
      radial-gradient(at 50% 0%, hsla(215, 98%, 61%, 0.2) 0px, transparent 50%),
      radial-gradient(at 80% 100%, hsla(189, 100%, 56%, 0.15) 0px, transparent 50%),
      radial-gradient(at 20% 100%, hsla(256, 96%, 67%, 0.1) 0px, transparent 50%)
    `,
  },

  // Text gradients
  text: {
    primary: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
    teal: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)',
    lavender: 'linear-gradient(135deg, #818CF8 0%, #A5B4FC 100%)',
    ocean: 'linear-gradient(135deg, #1E3A5F 0%, #3B82F6 100%)',
  },
} as const;

// ============================================================================
// GLASS EFFECT CONFIGURATIONS
// ============================================================================

export const glassEffects = {
  // Subtle glass - for background layers
  subtle: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropBlur: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 16px rgba(31, 38, 135, 0.1)',
  },

  // Default glass - most common use
  default: {
    background: 'rgba(255, 255, 255, 0.25)',
    backdropBlur: '16px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
  },

  // Strong glass - for elevated cards
  strong: {
    background: 'rgba(255, 255, 255, 0.4)',
    backdropBlur: '24px',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    boxShadow: '0 12px 40px rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
  },

  // Opaque glass - for navbars and footers
  opaque: {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropBlur: '20px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.12)',
  },

  // Tinted glass - for colored sections
  tinted: {
    blue: {
      background: 'rgba(59, 130, 246, 0.15)',
      backdropBlur: '16px',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15)',
    },
    teal: {
      background: 'rgba(6, 182, 212, 0.15)',
      backdropBlur: '16px',
      border: '1px solid rgba(6, 182, 212, 0.2)',
      boxShadow: '0 8px 32px rgba(6, 182, 212, 0.15)',
    },
    lavender: {
      background: 'rgba(129, 140, 248, 0.15)',
      backdropBlur: '16px',
      border: '1px solid rgba(129, 140, 248, 0.2)',
      boxShadow: '0 8px 32px rgba(129, 140, 248, 0.15)',
    },
    red: {
      background: 'rgba(239, 68, 68, 0.15)',
      backdropBlur: '16px',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15)',
    },
  },

  // Mobile-optimized (reduced blur)
  mobile: {
    subtle: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropBlur: '4px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 2px 8px rgba(31, 38, 135, 0.08)',
    },
    default: {
      background: 'rgba(255, 255, 255, 0.25)',
      backdropBlur: '8px',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      boxShadow: '0 4px 16px rgba(31, 38, 135, 0.12)',
    },
    strong: {
      background: 'rgba(255, 255, 255, 0.4)',
      backdropBlur: '12px',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      boxShadow: '0 6px 20px rgba(31, 38, 135, 0.15)',
    },
  },
} as const;

// ============================================================================
// ANIMATION TIMINGS
// ============================================================================

export const animations = {
  // Duration
  duration: {
    instant: '100ms',
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
    slowest: '700ms',
  },

  // Easing functions
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Common transition presets
  transition: {
    default: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'all 350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    colors: 'color 250ms cubic-bezier(0.4, 0, 0.2, 1), background-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 250ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// ============================================================================
// SHADOW SYSTEM
// ============================================================================

export const shadows = {
  // Glass shadows
  glass: {
    sm: '0 4px 16px rgba(31, 38, 135, 0.1)',
    md: '0 8px 32px rgba(31, 38, 135, 0.15)',
    lg: '0 12px 40px rgba(31, 38, 135, 0.2)',
    xl: '0 20px 60px rgba(31, 38, 135, 0.25)',
  },

  // Glow effects
  glow: {
    blue: '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)',
    teal: '0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(6, 182, 212, 0.2)',
    lavender: '0 0 20px rgba(129, 140, 248, 0.4), 0 0 40px rgba(129, 140, 248, 0.2)',
    white: '0 0 20px rgba(255, 255, 255, 0.6), 0 0 40px rgba(255, 255, 255, 0.3)',
  },

  // Inner glow (for borders)
  innerGlow: {
    subtle: 'inset 0 1px 0 rgba(255, 255, 255, 0.5)',
    strong: 'inset 0 2px 0 rgba(255, 255, 255, 0.7)',
  },
} as const;

// ============================================================================
// BORDER RADIUS SYSTEM
// ============================================================================

export const radius = {
  sm: '0.5rem', // 8px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.25rem', // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '2rem', // 32px
  full: '9999px',
} as const;

// ============================================================================
// SPACING SYSTEM
// ============================================================================

export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
  '4xl': '6rem', // 96px
  '5xl': '8rem', // 128px
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// Z-INDEX SYSTEM
// ============================================================================

export const zIndex = {
  background: -1,
  base: 0,
  content: 1,
  floating: 10,
  overlay: 20,
  dropdown: 30,
  sticky: 40,
  modal: 50,
  toast: 60,
  tooltip: 70,
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type GlassEffectType = keyof typeof glassEffects;
export type GradientType = keyof typeof gradients;
export type ColorType = keyof typeof colors;
