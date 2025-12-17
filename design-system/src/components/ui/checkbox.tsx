'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Check, Minus, Circle } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ============================================================================
// CHECKBOX
// ============================================================================

const checkboxVariants = cva(
  'peer shrink-0 border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500 data-[state=checked]:text-white data-[state=indeterminate]:bg-primary-500 data-[state=indeterminate]:border-primary-500 data-[state=indeterminate]:text-white dark:data-[state=checked]:bg-primary-400 dark:data-[state=checked]:border-primary-400 dark:data-[state=indeterminate]:bg-primary-400 dark:data-[state=indeterminate]:border-primary-400',
  {
    variants: {
      size: {
        sm: 'size-4 rounded',
        md: 'size-5 rounded-md',
        lg: 'size-6 rounded-md',
      },
      variant: {
        default: 'border-neutral-300 dark:border-neutral-600 focus-visible:ring-primary-500',
        error: 'border-error-500 dark:border-error-400 focus-visible:ring-error-500',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, size, variant, label, description, indeterminate, checked, ...props }, ref) => {
  const iconSize = size === 'sm' ? 'size-3' : size === 'lg' ? 'size-4' : 'size-3.5';
  
  // Handle indeterminate state
  const actualChecked = indeterminate ? 'indeterminate' : checked;

  const checkbox = (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(checkboxVariants({ size, variant }), className)}
      checked={actualChecked}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        {indeterminate ? (
          <Minus className={iconSize} strokeWidth={3} />
        ) : (
          <Check className={iconSize} strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (!label && !description) {
    return checkbox;
  }

  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      {checkbox}
      <div className="flex flex-col gap-0.5">
        {label && (
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
            {label}
          </span>
        )}
        {description && (
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {description}
          </span>
        )}
      </div>
    </label>
  );
});

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

// Checkbox Group
export interface CheckboxGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const CheckboxGroup = ({ children, orientation = 'vertical', className }: CheckboxGroupProps) => {
  return (
    <div
      className={cn(
        'flex gap-4',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className
      )}
      role="group"
    >
      {children}
    </div>
  );
};

// ============================================================================
// RADIO GROUP
// ============================================================================

const radioVariants = cva(
  'aspect-square rounded-full border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'size-4',
        md: 'size-5',
        lg: 'size-6',
      },
      variant: {
        default: 'border-neutral-300 dark:border-neutral-600 focus-visible:ring-primary-500 data-[state=checked]:border-primary-500 dark:data-[state=checked]:border-primary-400',
        error: 'border-error-500 dark:border-error-400 focus-visible:ring-error-500',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & {
    orientation?: 'horizontal' | 'vertical';
  }
>(({ className, orientation = 'vertical', ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn(
        'flex gap-4',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className
      )}
      {...props}
      ref={ref}
    />
  );
});

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioVariants> {
  label?: string;
  description?: string;
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, size, variant, label, description, ...props }, ref) => {
  const indicatorSize = size === 'sm' ? 'size-2' : size === 'lg' ? 'size-3' : 'size-2.5';

  const radio = (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(radioVariants({ size, variant }), className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <div className={cn(indicatorSize, 'rounded-full bg-primary-500 dark:bg-primary-400')} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );

  if (!label && !description) {
    return radio;
  }

  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      {radio}
      <div className="flex flex-col gap-0.5">
        {label && (
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
            {label}
          </span>
        )}
        {description && (
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {description}
          </span>
        )}
      </div>
    </label>
  );
});

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { Checkbox, CheckboxGroup, RadioGroup, RadioGroupItem };
