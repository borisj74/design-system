'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const accordionVariants = cva('w-full', {
  variants: {
    variant: {
      default: '',
      bordered: 'border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden',
      separated: 'space-y-2',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface AccordionBaseProps extends VariantProps<typeof accordionVariants> {
  className?: string;
}

interface AccordionSingleProps extends AccordionBaseProps {
  type: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  collapsible?: boolean;
}

interface AccordionMultipleProps extends AccordionBaseProps {
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

type AccordionProps = (AccordionSingleProps | AccordionMultipleProps) & {
  children?: React.ReactNode;
  disabled?: boolean;
};

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, variant, type, ...props }, ref) => {
    if (type === 'multiple') {
      return (
        <AccordionPrimitive.Root
          ref={ref}
          type="multiple"
          className={cn(accordionVariants({ variant }), className)}
          {...(props as Omit<AccordionMultipleProps, 'type' | 'variant' | 'className'>)}
        />
      );
    }
    return (
      <AccordionPrimitive.Root
        ref={ref}
        type="single"
        className={cn(accordionVariants({ variant }), className)}
        {...(props as Omit<AccordionSingleProps, 'type' | 'variant' | 'className'>)}
      />
    );
  }
);
Accordion.displayName = 'Accordion';

const accordionItemVariants = cva('', {
  variants: {
    variant: {
      default: 'border-b border-neutral-200 dark:border-neutral-800 last:border-b-0',
      bordered: 'border-b border-neutral-200 dark:border-neutral-800 last:border-b-0',
      separated: 'border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface AccordionItemProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>,
    VariantProps<typeof accordionItemVariants> {}

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, variant, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(accordionItemVariants({ variant }), className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-4 px-4 text-sm font-medium text-neutral-900 dark:text-neutral-100 transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800/50 [&[data-state=open]>svg]:rotate-180',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="size-4 shrink-0 text-neutral-500 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('px-4 pb-4 pt-0 text-neutral-600 dark:text-neutral-400', className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

// Convenience component for simple FAQ-style accordions
export interface AccordionItemData {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface SimpleAccordionProps {
  items: AccordionItemData[];
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  variant?: 'default' | 'bordered' | 'separated';
  collapsible?: boolean;
}

const SimpleAccordion = ({
  items,
  type = 'single',
  defaultValue,
  variant = 'default',
  collapsible = true,
}: SimpleAccordionProps) => {
  if (type === 'single') {
    return (
      <Accordion
        type="single"
        defaultValue={defaultValue as string}
        collapsible={collapsible}
        variant={variant}
      >
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id} variant={variant}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }

  return (
    <Accordion
      type="multiple"
      defaultValue={defaultValue as string[]}
      variant={variant}
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id} variant={variant}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent, SimpleAccordion };
