'use client';

import * as React from 'react';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      className,
      items,
      separator = <ChevronRight className="size-4 text-neutral-400" />,
      maxItems,
      onItemClick,
      ...props
    },
    ref
  ) => {
    const [expanded, setExpanded] = React.useState(false);

    const shouldCollapse = maxItems && items.length > maxItems && !expanded;
    const visibleItems = shouldCollapse
      ? [items[0], { label: '...', collapsed: true }, ...items.slice(-(maxItems - 1))]
      : items;

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn('', className)}
        {...props}
      >
        <ol className="flex items-center gap-1.5 text-sm">
          {visibleItems.map((item, index) => {
            const isLast = index === visibleItems.length - 1;
            const isCollapsed = 'collapsed' in item && item.collapsed;
            const originalIndex = shouldCollapse
              ? index === 0
                ? 0
                : index === 1
                ? -1
                : items.length - (visibleItems.length - index)
              : index;

            return (
              <li key={index} className="flex items-center gap-1.5">
                {index > 0 && (
                  <span className="flex items-center" aria-hidden="true">
                    {separator}
                  </span>
                )}
                {isCollapsed ? (
                  <button
                    onClick={() => setExpanded(true)}
                    className="flex items-center justify-center size-6 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
                    aria-label="Show more breadcrumbs"
                  >
                    <MoreHorizontal className="size-4" />
                  </button>
                ) : isLast ? (
                  <span
                    className="font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5"
                    aria-current="page"
                  >
                    {'icon' in item && item.icon}
                    {item.label}
                  </span>
                ) : 'href' in item && item.href ? (
                  <a
                    href={item.href}
                    onClick={(e) => {
                      if (onItemClick) {
                        e.preventDefault();
                        onItemClick(item as BreadcrumbItem, originalIndex);
                      }
                    }}
                    className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors flex items-center gap-1.5"
                  >
                    {'icon' in item && item.icon}
                    {item.label}
                  </a>
                ) : (
                  <button
                    onClick={() => onItemClick?.(item as BreadcrumbItem, originalIndex)}
                    className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors flex items-center gap-1.5"
                  >
                    {'icon' in item && item.icon}
                    {item.label}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);
Breadcrumb.displayName = 'Breadcrumb';

// Simple breadcrumb list components for more control
const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.OlHTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn('flex items-center gap-1.5 text-sm flex-wrap', className)}
    {...props}
  />
));
BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItemWrapper = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn('flex items-center gap-1.5', className)}
    {...props}
  />
));
BreadcrumbItemWrapper.displayName = 'BreadcrumbItemWrapper';

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors',
      className
    )}
    {...props}
  />
));
BreadcrumbLink.displayName = 'BreadcrumbLink';

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-current="page"
    className={cn('font-medium text-neutral-900 dark:text-neutral-100', className)}
    {...props}
  />
));
BreadcrumbPage.displayName = 'BreadcrumbPage';

const BreadcrumbSeparator = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn('text-neutral-400', className)}
    {...props}
  >
    {children || <ChevronRight className="size-4" />}
  </span>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItemWrapper,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
