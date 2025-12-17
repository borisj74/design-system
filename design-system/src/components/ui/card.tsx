'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-xl transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800',
        elevated: 'bg-white dark:bg-neutral-900 shadow-3 dark:shadow-none dark:border dark:border-neutral-800',
        outlined: 'bg-transparent border-2 border-neutral-200 dark:border-neutral-700',
        ghost: 'bg-neutral-50 dark:bg-neutral-800/50',
      },
      interactive: {
        true: 'cursor-pointer',
        false: '',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        interactive: true,
        className: 'hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-2',
      },
      {
        variant: 'elevated',
        interactive: true,
        className: 'hover:shadow-4',
      },
      {
        variant: 'outlined',
        interactive: true,
        className: 'hover:border-primary-500 dark:hover:border-primary-400',
      },
      {
        variant: 'ghost',
        interactive: true,
        className: 'hover:bg-neutral-100 dark:hover:bg-neutral-800',
      },
    ],
    defaultVariants: {
      variant: 'default',
      interactive: false,
      padding: 'none',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, interactive, padding }), className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-1.5 p-6 pb-0', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-xl font-semibold leading-tight text-neutral-900 dark:text-neutral-100',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-neutral-500 dark:text-neutral-400', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// Image Card variant
export interface ImageCardProps extends CardProps {
  imageSrc: string;
  imageAlt?: string;
  imagePosition?: 'top' | 'bottom' | 'left' | 'right';
  imageAspectRatio?: 'video' | 'square' | 'portrait' | 'auto';
}

const ImageCard = React.forwardRef<HTMLDivElement, ImageCardProps>(
  (
    {
      className,
      variant,
      interactive,
      imageSrc,
      imageAlt = '',
      imagePosition = 'top',
      imageAspectRatio = 'video',
      children,
      ...props
    },
    ref
  ) => {
    const isHorizontal = imagePosition === 'left' || imagePosition === 'right';
    
    const aspectClasses = {
      video: 'aspect-video',
      square: 'aspect-square',
      portrait: 'aspect-[3/4]',
      auto: '',
    };

    const imageElement = (
      <div
        className={cn(
          'overflow-hidden',
          isHorizontal ? 'flex-shrink-0' : '',
          isHorizontal ? 'w-1/3' : 'w-full',
          imagePosition === 'top' && 'rounded-t-xl',
          imagePosition === 'bottom' && 'rounded-b-xl',
          imagePosition === 'left' && 'rounded-l-xl',
          imagePosition === 'right' && 'rounded-r-xl'
        )}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className={cn(
            'w-full h-full object-cover transition-transform duration-300',
            interactive && 'group-hover:scale-105',
            aspectClasses[imageAspectRatio]
          )}
        />
      </div>
    );

    return (
      <Card
        ref={ref}
        variant={variant}
        interactive={interactive}
        className={cn(
          'overflow-hidden group',
          isHorizontal && 'flex',
          imagePosition === 'right' && 'flex-row-reverse',
          className
        )}
        {...props}
      >
        {(imagePosition === 'top' || imagePosition === 'left') && imageElement}
        <div className={cn('flex-1', isHorizontal && 'flex flex-col')}>
          {children}
        </div>
        {(imagePosition === 'bottom' || imagePosition === 'right') && imageElement}
      </Card>
    );
  }
);
ImageCard.displayName = 'ImageCard';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  ImageCard,
  cardVariants,
};
