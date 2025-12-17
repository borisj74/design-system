'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ============================================================================
// LINEAR PROGRESS
// ============================================================================

const progressVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800',
  {
    variants: {
      size: {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const progressIndicatorVariants = cva(
  'h-full transition-all duration-300 ease-out rounded-full',
  {
    variants: {
      color: {
        primary: 'bg-primary-500',
        secondary: 'bg-secondary-500',
        accent: 'bg-accent-500',
        success: 'bg-success-500',
        warning: 'bg-warning-500',
        error: 'bg-error-500',
      },
      indeterminate: {
        true: 'animate-indeterminate',
        false: '',
      },
    },
    defaultVariants: {
      color: 'primary',
      indeterminate: false,
    },
  }
);

export interface ProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof progressIndicatorVariants> {
  value?: number;
  max?: number;
  showLabel?: boolean;
  label?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      size,
      color,
      indeterminate,
      showLabel,
      label,
      ...props
    },
    ref
  ) => {
    const percentage = indeterminate ? 100 : Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div className="w-full">
        {(showLabel || label) && (
          <div className="flex justify-between mb-1.5">
            {label && (
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {label}
              </span>
            )}
            {showLabel && !indeterminate && (
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        <div
          ref={ref}
          className={cn(progressVariants({ size }), className)}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          {...props}
        >
          <div
            className={cn(progressIndicatorVariants({ color, indeterminate }))}
            style={{ width: indeterminate ? '50%' : `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = 'Progress';

// ============================================================================
// CIRCULAR PROGRESS
// ============================================================================

export interface CircularProgressProps extends React.SVGAttributes<SVGElement> {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  strokeWidth?: number;
  indeterminate?: boolean;
  showLabel?: boolean;
}

const sizeMap = {
  sm: 24,
  md: 40,
  lg: 56,
  xl: 80,
};

const strokeWidthMap = {
  sm: 3,
  md: 4,
  lg: 5,
  xl: 6,
};

const colorClassMap = {
  primary: 'text-primary-500',
  secondary: 'text-secondary-500',
  accent: 'text-accent-500',
  success: 'text-success-500',
  warning: 'text-warning-500',
  error: 'text-error-500',
};

const CircularProgress = React.forwardRef<SVGSVGElement, CircularProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      size = 'md',
      color = 'primary',
      strokeWidth,
      indeterminate = false,
      showLabel = false,
      ...props
    },
    ref
  ) => {
    const dimension = sizeMap[size];
    const stroke = strokeWidth || strokeWidthMap[size];
    const radius = (dimension - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg
          ref={ref}
          className={cn(
            colorClassMap[color],
            indeterminate && 'animate-spin',
            className
          )}
          width={dimension}
          height={dimension}
          viewBox={`0 0 ${dimension} ${dimension}`}
          fill="none"
          {...props}
        >
          {/* Background circle */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
            className="opacity-20"
          />
          {/* Progress circle */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={indeterminate ? circumference * 0.75 : offset}
            className="transition-all duration-300 ease-out"
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
            }}
          />
        </svg>
        {showLabel && !indeterminate && (
          <span
            className={cn(
              'absolute font-semibold text-neutral-700 dark:text-neutral-300',
              size === 'sm' && 'text-[8px]',
              size === 'md' && 'text-xs',
              size === 'lg' && 'text-sm',
              size === 'xl' && 'text-base'
            )}
          >
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  }
);
CircularProgress.displayName = 'CircularProgress';

// ============================================================================
// SPINNER (simple loading indicator)
// ============================================================================

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'white';
}

const spinnerSizeMap = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
};

const spinnerColorMap = {
  primary: 'text-primary-500',
  secondary: 'text-secondary-500',
  accent: 'text-accent-500',
  neutral: 'text-neutral-500',
  white: 'text-white',
};

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', color = 'primary', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('animate-spin', spinnerSizeMap[size], spinnerColorMap[color], className)}
        {...props}
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-full">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            className="opacity-20"
          />
          <path
            d="M12 2C6.47715 2 2 6.47715 2 12"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }
);
Spinner.displayName = 'Spinner';

export { Progress, CircularProgress, Spinner };
