'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const switchVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary-500 data-[state=unchecked]:bg-neutral-200 dark:data-[state=checked]:bg-primary-400 dark:data-[state=unchecked]:bg-neutral-700',
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
        lg: 'h-7 w-14',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const thumbVariants = cva(
  'pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200',
  {
    variants: {
      size: {
        sm: 'size-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
        md: 'size-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
        lg: 'size-6 data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants> {
  label?: string;
  description?: string;
  labelPosition?: 'left' | 'right';
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, size, label, description, labelPosition = 'right', ...props }, ref) => {
  const switchElement = (
    <SwitchPrimitives.Root
      className={cn(switchVariants({ size }), className)}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb className={cn(thumbVariants({ size }))} />
    </SwitchPrimitives.Root>
  );

  if (!label && !description) {
    return switchElement;
  }

  const labelContent = (
    <div className="flex flex-col gap-0.5">
      {label && (
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </span>
      )}
      {description && (
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {description}
        </span>
      )}
    </div>
  );

  return (
    <label className="inline-flex items-center gap-3 cursor-pointer">
      {labelPosition === 'left' && labelContent}
      {switchElement}
      {labelPosition === 'right' && labelContent}
    </label>
  );
});

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
