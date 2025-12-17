'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const avatarVariants = cva(
  'relative inline-flex items-center justify-center overflow-hidden bg-neutral-200 dark:bg-neutral-700 font-medium text-neutral-600 dark:text-neutral-300',
  {
    variants: {
      size: {
        xs: 'size-6 text-xs',
        sm: 'size-8 text-sm',
        md: 'size-10 text-base',
        lg: 'size-12 text-lg',
        xl: 'size-16 text-xl',
        '2xl': 'size-20 text-2xl',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-lg',
      },
    },
    defaultVariants: {
      size: 'md',
      shape: 'circle',
    },
  }
);

const statusDotVariants = cva(
  'absolute rounded-full border-2 border-white dark:border-neutral-900',
  {
    variants: {
      status: {
        online: 'bg-success-500',
        offline: 'bg-neutral-400',
        busy: 'bg-error-500',
        away: 'bg-warning-500',
      },
      size: {
        xs: 'size-2 -bottom-0.5 -right-0.5',
        sm: 'size-2.5 -bottom-0.5 -right-0.5',
        md: 'size-3 -bottom-0.5 -right-0.5',
        lg: 'size-3.5 bottom-0 right-0',
        xl: 'size-4 bottom-0.5 right-0.5',
        '2xl': 'size-5 bottom-1 right-1',
      },
    },
    defaultVariants: {
      status: 'online',
      size: 'md',
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
  status?: 'online' | 'offline' | 'busy' | 'away';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, shape, src, alt, fallback, status, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const showFallback = !src || imageError;
    const initials = fallback ? getInitials(fallback) : '?';

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, shape }), className)}
        {...props}
      >
        {!showFallback ? (
          <img
            src={src}
            alt={alt || fallback || 'Avatar'}
            className="size-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span>{initials}</span>
        )}
        {status && (
          <span className={cn(statusDotVariants({ status, size }))} />
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';

// Avatar Group
export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: VariantProps<typeof avatarVariants>['size'];
  className?: string;
}

const AvatarGroup = ({ children, max = 4, size = 'md', className }: AvatarGroupProps) => {
  const avatars = React.Children.toArray(children);
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  const overlapClasses = {
    xs: '-ml-2',
    sm: '-ml-2.5',
    md: '-ml-3',
    lg: '-ml-4',
    xl: '-ml-5',
    '2xl': '-ml-6',
  };

  return (
    <div className={cn('flex items-center', className)}>
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          className={cn(
            'ring-2 ring-white dark:ring-neutral-900 rounded-full',
            index > 0 && overlapClasses[size || 'md']
          )}
        >
          {React.isValidElement(avatar)
            ? React.cloneElement(avatar as React.ReactElement<AvatarProps>, { size })
            : avatar}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            avatarVariants({ size, shape: 'circle' }),
            'ring-2 ring-white dark:ring-neutral-900 bg-neutral-300 dark:bg-neutral-600',
            overlapClasses[size || 'md']
          )}
        >
          <span className="text-neutral-700 dark:text-neutral-200">
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  );
};

export { Avatar, AvatarGroup, avatarVariants };
