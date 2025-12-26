import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface GlassInputProps
  extends Omit<HTMLMotionProps<'input'>, 'ref' | 'type' | 'size'> {
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number';
  /** Input variant */
  variant?: 'subtle' | 'default' | 'strong';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Error state */
  error?: boolean;
  /** Success state */
  success?: boolean;
  /** Icon before input (alias: icon) */
  iconBefore?: React.ReactNode;
  /** Icon (alias for iconBefore) */
  icon?: React.ReactNode;
  /** Icon after input */
  iconAfter?: React.ReactNode;
  /** Full width */
  fullWidth?: boolean;
  /** Label text */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  errorMessage?: string;
  /** Additional className */
  className?: string;
}

/**
 * GlassInput - Glassmorphism input field with states
 *
 * @example
 * ```tsx
 * <GlassInput
 *   label="Email"
 *   type="email"
 *   placeholder="you@example.com"
 *   variant="default"
 * />
 * ```
 */
export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  (
    {
      type = 'text',
      variant = 'default',
      size = 'md',
      error = false,
      success = false,
      iconBefore,
      icon,
      iconAfter,
      fullWidth = false,
      label,
      helperText,
      errorMessage,
      className,
      ...inputProps
    },
    ref
  ) => {
    const hasError = error || !!errorMessage;
    // Support `icon` as alias for `iconBefore`
    // Handle both ReactNode and component types
    const rawIcon = iconBefore || icon;
    const leadingIcon = React.useMemo(() => {
      if (!rawIcon) return null;
      
      // If it's already a react element, return it
      if (React.isValidElement(rawIcon)) {
        return rawIcon;
      }
      
      // Otherwise treat it as a component (function or forwardRef) and render it
      return React.createElement(rawIcon as unknown as React.ComponentType<{ className?: string }>, { 
        className: 'w-full h-full' 
      });
    }, [rawIcon]);
    const hasIcon = leadingIcon || iconAfter;

    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm rounded-lg',
      md: 'px-4 py-3 text-base rounded-xl',
      lg: 'px-6 py-4 text-lg rounded-2xl',
    };

    // Icon size classes
    const iconSizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    // Input container classes
    const containerClasses = cn(
      'relative flex items-center',
      fullWidth && 'w-full'
    );

    // Glass input classes
    const inputClasses = cn(
      // Base styles
      'w-full bg-transparent outline-none',
      'font-medium placeholder:text-ocean-mid/50 dark:placeholder:text-white/50',
      'transition-all duration-250',
      // Remove default focus ring (we'll use parent border)
      'focus:outline-none',
      // Padding adjustments for icons
      leadingIcon && 'pl-10',
      iconAfter && 'pr-10',
      className
    );

    // Wrapper classes (glass effect)
    const wrapperClasses = cn(
      // Glass effect
      `glass-${variant}`,
      // Size
      sizeClasses[size],
      // States
      hasError && 'glass-red ring-2 ring-red-500/50',
      success && 'glass-teal ring-2 ring-teal-500/50',
      !hasError &&
        !success &&
        'focus-within:ring-2 focus-within:ring-sky/50',
      // Full width
      fullWidth && 'w-full',
      // Hover effect
      'hover:shadow-glass-md',
      // GPU acceleration
      'gpu-accelerated'
    );

    return (
      <div className={cn('flex flex-col gap-2', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-ocean-deep dark:text-white pl-1">
            {label}
          </label>
        )}

        {/* Input wrapper with glass effect */}
        <motion.div
          className={wrapperClasses}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={containerClasses}>
            {/* Icon before */}
            {leadingIcon && (
              <div
                className={cn(
                  'absolute left-3 flex items-center pointer-events-none',
                  iconSizeClasses[size],
                  hasError
                    ? 'text-red-500'
                    : success
                      ? 'text-teal-500'
                      : 'text-ocean-mid dark:text-white/70'
                )}
              >
                {leadingIcon}
              </div>
            )}

            {/* Input field */}
            <motion.input
              ref={ref}
              type={type}
              className={inputClasses}
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.15 }}
              {...inputProps}
            />

            {/* Icon after */}
            {iconAfter && (
              <div
                className={cn(
                  'absolute right-3 flex items-center pointer-events-none',
                  iconSizeClasses[size],
                  hasError
                    ? 'text-red-500'
                    : success
                      ? 'text-teal-500'
                      : 'text-ocean-mid dark:text-white/70'
                )}
              >
                {iconAfter}
              </div>
            )}
          </div>
        </motion.div>

        {/* Helper text or error message */}
        {(helperText || errorMessage) && (
          <p
            className={cn(
              'text-xs pl-1',
              hasError
                ? 'text-red-500'
                : success
                  ? 'text-teal-500'
                  : 'text-ocean-mid/70 dark:text-white/70'
            )}
          >
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';
