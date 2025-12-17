'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const toastVariants = cva(
  'relative flex w-full items-start gap-3 rounded-xl border p-4 shadow-4 transition-all',
  {
    variants: {
      variant: {
        default: 'bg-white border-neutral-200 text-neutral-900 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-100',
        success: 'bg-success-50 border-success-200 text-success-900 dark:bg-success-950 dark:border-success-800 dark:text-success-100',
        error: 'bg-error-50 border-error-200 text-error-900 dark:bg-error-950 dark:border-error-800 dark:text-error-100',
        warning: 'bg-warning-50 border-warning-200 text-warning-900 dark:bg-warning-950 dark:border-warning-800 dark:text-warning-100',
        info: 'bg-info-50 border-info-200 text-info-900 dark:bg-info-950 dark:border-info-800 dark:text-info-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const iconMap = {
  default: null,
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const iconColorMap = {
  default: '',
  success: 'text-success-500',
  error: 'text-error-500',
  warning: 'text-warning-500',
  info: 'text-info-500',
};

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
  showIcon?: boolean;
  duration?: number;
  showProgress?: boolean;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      className,
      variant = 'default',
      title,
      description,
      action,
      onClose,
      showCloseButton = true,
      showIcon = true,
      duration,
      showProgress = false,
      children,
      ...props
    },
    ref
  ) => {
    const [progress, setProgress] = React.useState(100);
    const Icon = iconMap[variant || 'default'];

    React.useEffect(() => {
      if (duration && duration > 0) {
        const startTime = Date.now();
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
          setProgress(remaining);
          
          if (remaining <= 0) {
            clearInterval(interval);
            onClose?.();
          }
        }, 50);

        return () => clearInterval(interval);
      }
    }, [duration, onClose]);

    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        {showIcon && Icon && (
          <Icon className={cn('size-5 flex-shrink-0 mt-0.5', iconColorMap[variant || 'default'])} />
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <p className="text-sm font-semibold">{title}</p>
          )}
          {description && (
            <p className="text-sm opacity-90 mt-0.5">{description}</p>
          )}
          {children}
          {action && (
            <div className="mt-3">{action}</div>
          )}
        </div>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-md opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            <X className="size-4" />
          </button>
        )}
        {showProgress && duration && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 dark:bg-white/5 rounded-b-xl overflow-hidden">
            <div 
              className={cn(
                'h-full transition-all duration-100 ease-linear',
                variant === 'success' && 'bg-success-500',
                variant === 'error' && 'bg-error-500',
                variant === 'warning' && 'bg-warning-500',
                variant === 'info' && 'bg-info-500',
                variant === 'default' && 'bg-primary-500',
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    );
  }
);
Toast.displayName = 'Toast';

// Toast Container for positioning
export interface ToastContainerProps {
  children: React.ReactNode;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

const positionClasses = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
};

const ToastContainer = ({ children, position = 'top-right' }: ToastContainerProps) => {
  return (
    <div className={cn('fixed z-50 flex flex-col gap-2 w-full max-w-sm', positionClasses[position])}>
      {children}
    </div>
  );
};

// Simple toast hook for managing toasts
interface ToastItem {
  id: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  title?: string;
  description?: string;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = React.useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    toast: {
      success: (title: string, description?: string) => 
        addToast({ variant: 'success', title, description, duration: 5000 }),
      error: (title: string, description?: string) => 
        addToast({ variant: 'error', title, description, duration: 5000 }),
      warning: (title: string, description?: string) => 
        addToast({ variant: 'warning', title, description, duration: 5000 }),
      info: (title: string, description?: string) => 
        addToast({ variant: 'info', title, description, duration: 5000 }),
    },
  };
}

export { Toast, ToastContainer, toastVariants };
