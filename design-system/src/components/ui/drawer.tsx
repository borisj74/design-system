'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const Drawer = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;
const DrawerPortal = DialogPrimitive.Portal;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & {
    variant?: 'overlay' | 'push';
  }
>(({ className, variant = 'overlay', ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 transition-opacity duration-300',
      variant === 'overlay' && 'bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      variant === 'push' && 'bg-transparent pointer-events-none',
      className
    )}
    {...props}
  />
));
DrawerOverlay.displayName = DialogPrimitive.Overlay.displayName;

const drawerContentVariants = cva(
  'fixed z-50 flex flex-col bg-white shadow-5 transition-transform duration-300 ease-in-out dark:bg-neutral-900 dark:border-neutral-800',
  {
    variants: {
      side: {
        left: 'left-0 top-0 h-full border-r data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0',
        right: 'right-0 top-0 h-full border-l data-[state=closed]:translate-x-full data-[state=open]:translate-x-0',
        top: 'top-0 left-0 w-full border-b data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0',
        bottom: 'bottom-0 left-0 w-full border-t data-[state=closed]:translate-y-full data-[state=open]:translate-y-0',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
        xl: '',
        full: '',
      },
    },
    compoundVariants: [
      { side: 'left', size: 'sm', className: 'w-72' },
      { side: 'left', size: 'md', className: 'w-96' },
      { side: 'left', size: 'lg', className: 'w-[480px]' },
      { side: 'left', size: 'xl', className: 'w-[640px]' },
      { side: 'left', size: 'full', className: 'w-screen' },
      { side: 'right', size: 'sm', className: 'w-72' },
      { side: 'right', size: 'md', className: 'w-96' },
      { side: 'right', size: 'lg', className: 'w-[480px]' },
      { side: 'right', size: 'xl', className: 'w-[640px]' },
      { side: 'right', size: 'full', className: 'w-screen' },
      { side: 'top', size: 'sm', className: 'h-48' },
      { side: 'top', size: 'md', className: 'h-72' },
      { side: 'top', size: 'lg', className: 'h-96' },
      { side: 'top', size: 'xl', className: 'h-[480px]' },
      { side: 'top', size: 'full', className: 'h-screen' },
      { side: 'bottom', size: 'sm', className: 'h-48' },
      { side: 'bottom', size: 'md', className: 'h-72' },
      { side: 'bottom', size: 'lg', className: 'h-96' },
      { side: 'bottom', size: 'xl', className: 'h-[480px]' },
      { side: 'bottom', size: 'full', className: 'h-screen' },
    ],
    defaultVariants: {
      side: 'right',
      size: 'md',
    },
  }
);

interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof drawerContentVariants> {
  showCloseButton?: boolean;
  overlayVariant?: 'overlay' | 'push';
}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(({ className, side, size, children, showCloseButton = true, overlayVariant = 'overlay', ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay variant={overlayVariant} />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(drawerContentVariants({ side, size }), className)}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-lg p-2 text-neutral-500 opacity-70 ring-offset-white transition-opacity hover:opacity-100 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:pointer-events-none dark:ring-offset-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800">
          <X className="size-5" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = DialogPrimitive.Content.displayName;

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col gap-1.5 p-6 border-b border-neutral-200 dark:border-neutral-800', className)}
    {...props}
  />
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold text-neutral-900 dark:text-neutral-100', className)}
    {...props}
  />
));
DrawerTitle.displayName = DialogPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-neutral-500 dark:text-neutral-400', className)}
    {...props}
  />
));
DrawerDescription.displayName = DialogPrimitive.Description.displayName;

const DrawerBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex-1 overflow-y-auto p-6', className)}
    {...props}
  />
);
DrawerBody.displayName = 'DrawerBody';

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end gap-3 p-6 border-t border-neutral-200 dark:border-neutral-800', className)}
    {...props}
  />
);
DrawerFooter.displayName = 'DrawerFooter';

// Convenience component
export interface SidePanelProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'overlay' | 'push';
  showCloseButton?: boolean;
}

const SidePanel = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  side = 'right',
  size = 'md',
  variant = 'overlay',
  showCloseButton = true,
}: SidePanelProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent side={side} size={size} showCloseButton={showCloseButton} overlayVariant={variant}>
        {(title || description) && (
          <DrawerHeader>
            {title && <DrawerTitle>{title}</DrawerTitle>}
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
        )}
        <DrawerBody>{children}</DrawerBody>
        {footer && <DrawerFooter>{footer}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  );
};

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  SidePanel,
};
