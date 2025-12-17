'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const tabsListVariants = cva(
  'inline-flex items-center justify-center',
  {
    variants: {
      variant: {
        underline: 'border-b border-neutral-200 dark:border-neutral-800 gap-0',
        pills: 'bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1 gap-1',
        contained: 'bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1.5 gap-1',
      },
      orientation: {
        horizontal: 'flex-row w-full',
        vertical: 'flex-col h-full',
      },
    },
    compoundVariants: [
      {
        variant: 'underline',
        orientation: 'vertical',
        className: 'border-b-0 border-r border-neutral-200 dark:border-neutral-800',
      },
    ],
    defaultVariants: {
      variant: 'underline',
      orientation: 'horizontal',
    },
  }
);

interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, orientation, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant, orientation }), className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        underline: 'px-4 py-2.5 border-b-2 border-transparent -mb-px text-neutral-500 hover:text-neutral-900 data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 dark:text-neutral-400 dark:hover:text-neutral-100 dark:data-[state=active]:text-primary-400',
        pills: 'px-3 py-1.5 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-white/50 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-700/50 dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-neutral-100',
        contained: 'px-4 py-2 rounded-lg text-neutral-600 hover:text-neutral-900 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-md dark:text-neutral-400 dark:hover:text-neutral-100 dark:data-[state=active]:bg-neutral-900 dark:data-[state=active]:text-neutral-100',
      },
      orientation: {
        horizontal: '',
        vertical: 'w-full justify-start',
      },
    },
    compoundVariants: [
      {
        variant: 'underline',
        orientation: 'vertical',
        className: 'border-b-0 border-r-2 -mr-px pr-4',
      },
    ],
    defaultVariants: {
      variant: 'underline',
      orientation: 'horizontal',
    },
  }
);

interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, orientation, leftIcon, rightIcon, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, orientation }), className)}
    {...props}
  >
    {leftIcon && <span className="mr-2">{leftIcon}</span>}
    {children}
    {rightIcon && <span className="ml-2">{rightIcon}</span>}
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// Convenience component
export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SimpleTabsProps {
  items: TabItem[];
  defaultValue?: string;
  variant?: 'underline' | 'pills' | 'contained';
  orientation?: 'horizontal' | 'vertical';
  onValueChange?: (value: string) => void;
}

const SimpleTabs = ({
  items,
  defaultValue,
  variant = 'underline',
  orientation = 'horizontal',
  onValueChange,
}: SimpleTabsProps) => {
  return (
    <Tabs
      defaultValue={defaultValue || items[0]?.value}
      orientation={orientation}
      onValueChange={onValueChange}
      className={cn(orientation === 'vertical' && 'flex gap-4')}
    >
      <TabsList variant={variant} orientation={orientation}>
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            variant={variant}
            orientation={orientation}
            disabled={item.disabled}
            leftIcon={item.icon}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className={cn(orientation === 'vertical' && 'flex-1')}>
        {items.map((item) => (
          <TabsContent key={item.value} value={item.value}>
            {item.content}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent, SimpleTabs };
