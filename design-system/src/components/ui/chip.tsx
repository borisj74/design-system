'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// CHIP / TAG
// ============================================================================

const chipVariants = cva(
  'inline-flex items-center gap-1.5 font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        solid: '',
        outline: 'border bg-transparent',
        subtle: '',
      },
      color: {
        primary: '',
        secondary: '',
        accent: '',
        neutral: '',
        success: '',
        warning: '',
        error: '',
        info: '',
      },
      size: {
        sm: 'h-6 px-2 text-xs rounded-md',
        md: 'h-7 px-2.5 text-sm rounded-lg',
        lg: 'h-8 px-3 text-sm rounded-lg',
      },
      interactive: {
        true: 'cursor-pointer',
        false: '',
      },
    },
    compoundVariants: [
      // Solid variants
      { variant: 'solid', color: 'primary', className: 'bg-primary-500 text-white hover:bg-primary-600' },
      { variant: 'solid', color: 'secondary', className: 'bg-secondary-500 text-white hover:bg-secondary-600' },
      { variant: 'solid', color: 'accent', className: 'bg-accent-500 text-white hover:bg-accent-600' },
      { variant: 'solid', color: 'neutral', className: 'bg-neutral-500 text-white hover:bg-neutral-600' },
      { variant: 'solid', color: 'success', className: 'bg-success-500 text-white hover:bg-success-600' },
      { variant: 'solid', color: 'warning', className: 'bg-warning-500 text-white hover:bg-warning-600' },
      { variant: 'solid', color: 'error', className: 'bg-error-500 text-white hover:bg-error-600' },
      { variant: 'solid', color: 'info', className: 'bg-info-500 text-white hover:bg-info-600' },
      
      // Outline variants
      { variant: 'outline', color: 'primary', className: 'border-primary-500 text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-950' },
      { variant: 'outline', color: 'secondary', className: 'border-secondary-500 text-secondary-600 hover:bg-secondary-50 dark:text-secondary-400 dark:hover:bg-secondary-950' },
      { variant: 'outline', color: 'accent', className: 'border-accent-500 text-accent-600 hover:bg-accent-50 dark:text-accent-400 dark:hover:bg-accent-950' },
      { variant: 'outline', color: 'neutral', className: 'border-neutral-300 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-800' },
      { variant: 'outline', color: 'success', className: 'border-success-500 text-success-600 hover:bg-success-50 dark:text-success-400 dark:hover:bg-success-950' },
      { variant: 'outline', color: 'warning', className: 'border-warning-500 text-warning-600 hover:bg-warning-50 dark:text-warning-400 dark:hover:bg-warning-950' },
      { variant: 'outline', color: 'error', className: 'border-error-500 text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-950' },
      { variant: 'outline', color: 'info', className: 'border-info-500 text-info-600 hover:bg-info-50 dark:text-info-400 dark:hover:bg-info-950' },
      
      // Subtle variants
      { variant: 'subtle', color: 'primary', className: 'bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900 dark:text-primary-300 dark:hover:bg-primary-800' },
      { variant: 'subtle', color: 'secondary', className: 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200 dark:bg-secondary-900 dark:text-secondary-300 dark:hover:bg-secondary-800' },
      { variant: 'subtle', color: 'accent', className: 'bg-accent-100 text-accent-700 hover:bg-accent-200 dark:bg-accent-900 dark:text-accent-300 dark:hover:bg-accent-800' },
      { variant: 'subtle', color: 'neutral', className: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700' },
      { variant: 'subtle', color: 'success', className: 'bg-success-100 text-success-700 hover:bg-success-200 dark:bg-success-900 dark:text-success-300 dark:hover:bg-success-800' },
      { variant: 'subtle', color: 'warning', className: 'bg-warning-100 text-warning-700 hover:bg-warning-200 dark:bg-warning-900 dark:text-warning-300 dark:hover:bg-warning-800' },
      { variant: 'subtle', color: 'error', className: 'bg-error-100 text-error-700 hover:bg-error-200 dark:bg-error-900 dark:text-error-300 dark:hover:bg-error-800' },
      { variant: 'subtle', color: 'info', className: 'bg-info-100 text-info-700 hover:bg-info-200 dark:bg-info-900 dark:text-info-300 dark:hover:bg-info-800' },
    ],
    defaultVariants: {
      variant: 'subtle',
      color: 'neutral',
      size: 'md',
      interactive: false,
    },
  }
);

export interface ChipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof chipVariants> {
  dismissible?: boolean;
  onDismiss?: () => void;
  statusDot?: boolean;
  leftIcon?: React.ReactNode;
}

const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      className,
      variant,
      color,
      size,
      interactive,
      dismissible,
      onDismiss,
      statusDot,
      leftIcon,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const isInteractive = interactive || !!onClick;
    const iconSize = size === 'sm' ? 'size-3' : size === 'lg' ? 'size-4' : 'size-3.5';
    
    const Comp = isInteractive ? 'button' : 'span';

    return (
      <Comp
        ref={ref as React.Ref<HTMLSpanElement & HTMLButtonElement>}
        className={cn(chipVariants({ variant, color, size, interactive: isInteractive }), className)}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement & HTMLSpanElement>}
        {...props}
      >
        {statusDot && (
          <span className={cn(
            'rounded-full',
            size === 'sm' ? 'size-1.5' : size === 'lg' ? 'size-2.5' : 'size-2',
            variant === 'solid' ? 'bg-white/80' : 'bg-current'
          )} />
        )}
        {leftIcon && <span className={iconSize}>{leftIcon}</span>}
        {children}
        {dismissible && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss?.();
            }}
            className={cn(
              iconSize,
              'ml-0.5 hover:opacity-70 transition-opacity focus:outline-none'
            )}
          >
            <X className="size-full" />
          </button>
        )}
      </Comp>
    );
  }
);

Chip.displayName = 'Chip';

// ============================================================================
// BADGE
// ============================================================================

const badgeVariants = cva(
  'inline-flex items-center justify-center font-semibold',
  {
    variants: {
      variant: {
        dot: 'rounded-full bg-current',
        count: 'rounded-full text-white',
        text: 'rounded-md',
      },
      color: {
        primary: '',
        secondary: '',
        accent: '',
        neutral: '',
        success: '',
        warning: '',
        error: '',
        info: '',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    compoundVariants: [
      // Dot sizes
      { variant: 'dot', size: 'sm', className: 'size-2' },
      { variant: 'dot', size: 'md', className: 'size-2.5' },
      { variant: 'dot', size: 'lg', className: 'size-3' },
      
      // Count sizes
      { variant: 'count', size: 'sm', className: 'min-w-4 h-4 px-1 text-[10px]' },
      { variant: 'count', size: 'md', className: 'min-w-5 h-5 px-1.5 text-xs' },
      { variant: 'count', size: 'lg', className: 'min-w-6 h-6 px-2 text-sm' },
      
      // Text sizes
      { variant: 'text', size: 'sm', className: 'h-5 px-1.5 text-[10px]' },
      { variant: 'text', size: 'md', className: 'h-6 px-2 text-xs' },
      { variant: 'text', size: 'lg', className: 'h-7 px-2.5 text-sm' },
      
      // Dot colors
      { variant: 'dot', color: 'primary', className: 'text-primary-500' },
      { variant: 'dot', color: 'secondary', className: 'text-secondary-500' },
      { variant: 'dot', color: 'accent', className: 'text-accent-500' },
      { variant: 'dot', color: 'neutral', className: 'text-neutral-500' },
      { variant: 'dot', color: 'success', className: 'text-success-500' },
      { variant: 'dot', color: 'warning', className: 'text-warning-500' },
      { variant: 'dot', color: 'error', className: 'text-error-500' },
      { variant: 'dot', color: 'info', className: 'text-info-500' },
      
      // Count colors
      { variant: 'count', color: 'primary', className: 'bg-primary-500' },
      { variant: 'count', color: 'secondary', className: 'bg-secondary-500' },
      { variant: 'count', color: 'accent', className: 'bg-accent-500' },
      { variant: 'count', color: 'neutral', className: 'bg-neutral-500' },
      { variant: 'count', color: 'success', className: 'bg-success-500' },
      { variant: 'count', color: 'warning', className: 'bg-warning-500' },
      { variant: 'count', color: 'error', className: 'bg-error-500' },
      { variant: 'count', color: 'info', className: 'bg-info-500' },
      
      // Text colors
      { variant: 'text', color: 'primary', className: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' },
      { variant: 'text', color: 'secondary', className: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900 dark:text-secondary-300' },
      { variant: 'text', color: 'accent', className: 'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300' },
      { variant: 'text', color: 'neutral', className: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300' },
      { variant: 'text', color: 'success', className: 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300' },
      { variant: 'text', color: 'warning', className: 'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300' },
      { variant: 'text', color: 'error', className: 'bg-error-100 text-error-700 dark:bg-error-900 dark:text-error-300' },
      { variant: 'text', color: 'info', className: 'bg-info-100 text-info-700 dark:bg-info-900 dark:text-info-300' },
    ],
    defaultVariants: {
      variant: 'count',
      color: 'primary',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof badgeVariants> {
  count?: number;
  maxCount?: number;
  showZero?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      color,
      size,
      count,
      maxCount = 99,
      showZero = false,
      children,
      ...props
    },
    ref
  ) => {
    if (variant === 'count') {
      if (count === undefined) return null;
      if (count === 0 && !showZero) return null;
      
      const displayCount = count > maxCount ? `${maxCount}+` : count;
      
      return (
        <span
          ref={ref}
          className={cn(badgeVariants({ variant, color, size }), className)}
          {...props}
        >
          {displayCount}
        </span>
      );
    }

    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, color, size }), className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Badge wrapper for positioning
export interface BadgeWrapperProps {
  children: React.ReactNode;
  badge: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const BadgeWrapper = ({ children, badge, position = 'top-right' }: BadgeWrapperProps) => {
  const positionClasses = {
    'top-right': 'top-0 right-0 translate-x-1/3 -translate-y-1/3',
    'top-left': 'top-0 left-0 -translate-x-1/3 -translate-y-1/3',
    'bottom-right': 'bottom-0 right-0 translate-x-1/3 translate-y-1/3',
    'bottom-left': 'bottom-0 left-0 -translate-x-1/3 translate-y-1/3',
  };

  return (
    <div className="relative inline-flex">
      {children}
      <span className={cn('absolute', positionClasses[position])}>
        {badge}
      </span>
    </div>
  );
};

export { Chip, Badge, BadgeWrapper, chipVariants, badgeVariants };
