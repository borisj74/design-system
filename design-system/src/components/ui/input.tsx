'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const inputWrapperVariants = cva('relative flex flex-col gap-1.5', {
  variants: {
    fullWidth: {
      true: 'w-full',
      false: 'w-auto',
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});

const inputVariants = cva(
  'flex w-full border bg-transparent transition-all duration-200 placeholder:text-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-neutral-500',
  {
    variants: {
      size: {
        sm: 'h-8 px-3 text-sm rounded-md',
        md: 'h-10 px-3 text-sm rounded-lg',
        lg: 'h-12 px-4 text-base rounded-lg',
      },
      state: {
        default:
          'border-neutral-300 focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/20 dark:border-neutral-600 dark:focus-visible:border-primary-400',
        error:
          'border-error-500 focus-visible:border-error-500 focus-visible:ring-2 focus-visible:ring-error-500/20 dark:border-error-400',
        success:
          'border-success-500 focus-visible:border-success-500 focus-visible:ring-2 focus-visible:ring-success-500/20 dark:border-success-400',
      },
      hasPrefix: {
        true: '',
        false: '',
      },
      hasSuffix: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { hasPrefix: true, size: 'sm', className: 'pl-9' },
      { hasPrefix: true, size: 'md', className: 'pl-10' },
      { hasPrefix: true, size: 'lg', className: 'pl-12' },
      { hasSuffix: true, size: 'sm', className: 'pr-9' },
      { hasSuffix: true, size: 'md', className: 'pr-10' },
      { hasSuffix: true, size: 'lg', className: 'pr-12' },
    ],
    defaultVariants: {
      size: 'md',
      state: 'default',
      hasPrefix: false,
      hasSuffix: false,
    },
  }
);

const labelVariants = cva('text-sm font-medium text-neutral-700 dark:text-neutral-300', {
  variants: {
    required: {
      true: "after:ml-0.5 after:text-error-500 after:content-['*']",
      false: '',
    },
  },
  defaultVariants: {
    required: false,
  },
});

const helperTextVariants = cva('text-xs', {
  variants: {
    state: {
      default: 'text-neutral-500 dark:text-neutral-400',
      error: 'text-error-500 dark:text-error-400',
      success: 'text-success-500 dark:text-success-400',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  showCharacterCount?: boolean;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      size,
      label,
      helperText,
      errorMessage,
      successMessage,
      prefixIcon,
      suffixIcon,
      showCharacterCount,
      maxLength,
      fullWidth = true,
      required,
      disabled,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = React.useState(
      String(value || defaultValue || '').length
    );

    const state = errorMessage ? 'error' : successMessage ? 'success' : 'default';
    const message = errorMessage || successMessage || helperText;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    const iconSize = size === 'sm' ? 'size-4' : size === 'lg' ? 'size-5' : 'size-4';
    const iconPosition =
      size === 'sm' ? 'left-2.5' : size === 'lg' ? 'left-3.5' : 'left-3';
    const suffixPosition =
      size === 'sm' ? 'right-2.5' : size === 'lg' ? 'right-3.5' : 'right-3';

    return (
      <div className={cn(inputWrapperVariants({ fullWidth }))}>
        {label && (
          <label className={cn(labelVariants({ required }))}>
            {label}
          </label>
        )}
        <div className="relative">
          {prefixIcon && (
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500',
                iconPosition,
                iconSize
              )}
            >
              {prefixIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({
                size,
                state,
                hasPrefix: !!prefixIcon,
                hasSuffix: !!suffixIcon || state !== 'default',
              }),
              className
            )}
            ref={ref}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            {...props}
          />
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 flex items-center gap-1.5',
              suffixPosition
            )}
          >
            {state === 'error' && (
              <AlertCircle className={cn(iconSize, 'text-error-500')} />
            )}
            {state === 'success' && (
              <CheckCircle2 className={cn(iconSize, 'text-success-500')} />
            )}
            {suffixIcon && (
              <div className={cn('text-neutral-400 dark:text-neutral-500', iconSize)}>
                {suffixIcon}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between gap-2">
          {message && (
            <span className={cn(helperTextVariants({ state }))}>{message}</span>
          )}
          {showCharacterCount && maxLength && (
            <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-auto">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

// Search Input variant
export interface SearchInputProps extends Omit<InputProps, 'type' | 'prefixIcon'> {
  onClear?: () => void;
  searchIcon?: React.ReactNode;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClear, searchIcon, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      setInternalValue('');
      onClear?.();
    };

    const hasValue = String(internalValue).length > 0;

    return (
      <Input
        ref={ref}
        type="search"
        value={internalValue}
        onChange={handleChange}
        prefixIcon={
          searchIcon || (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-full"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          )
        }
        suffixIcon={
          hasValue ? (
            <button
              type="button"
              onClick={handleClear}
              className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            >
              <X className="size-full" />
            </button>
          ) : undefined
        }
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

// Textarea component
export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  showCharacterCount?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      size = 'md',
      label,
      helperText,
      errorMessage,
      successMessage,
      showCharacterCount,
      maxLength,
      fullWidth = true,
      required,
      disabled,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = React.useState(
      String(value || defaultValue || '').length
    );

    const state = errorMessage ? 'error' : successMessage ? 'success' : 'default';
    const message = errorMessage || successMessage || helperText;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm rounded-md min-h-[80px]',
      md: 'px-3 py-2.5 text-sm rounded-lg min-h-[100px]',
      lg: 'px-4 py-3 text-base rounded-lg min-h-[120px]',
    };

    const stateClasses = {
      default:
        'border-neutral-300 focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/20 dark:border-neutral-600 dark:focus-visible:border-primary-400',
      error:
        'border-error-500 focus-visible:border-error-500 focus-visible:ring-2 focus-visible:ring-error-500/20 dark:border-error-400',
      success:
        'border-success-500 focus-visible:border-success-500 focus-visible:ring-2 focus-visible:ring-success-500/20 dark:border-success-400',
    };

    return (
      <div className={cn(inputWrapperVariants({ fullWidth }))}>
        {label && (
          <label className={cn(labelVariants({ required }))}>
            {label}
          </label>
        )}
        <textarea
          className={cn(
            'flex w-full border bg-transparent transition-all duration-200 placeholder:text-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-neutral-500 resize-y',
            sizeClasses[size],
            stateClasses[state],
            className
          )}
          ref={ref}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          {...props}
        />
        <div className="flex justify-between gap-2">
          {message && (
            <span className={cn(helperTextVariants({ state }))}>{message}</span>
          )}
          {showCharacterCount && maxLength && (
            <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-auto">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Input, SearchInput, Textarea, inputVariants };
