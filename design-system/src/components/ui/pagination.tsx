'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Button } from './button';

const paginationVariants = cva('flex items-center gap-1', {
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// Simple prev/next pagination
export interface SimplePaginationProps extends VariantProps<typeof paginationVariants> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageInfo?: boolean;
  className?: string;
}

const SimplePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageInfo = true,
  size = 'md',
  className,
}: SimplePaginationProps) => {
  const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md';

  return (
    <div className={cn(paginationVariants({ size }), className)}>
      <Button
        variant="outline"
        size={buttonSize}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        leftIcon={<ChevronLeft className="size-4" />}
      >
        Previous
      </Button>
      {showPageInfo && (
        <span className="px-3 text-sm text-neutral-600 dark:text-neutral-400">
          Page {currentPage} of {totalPages}
        </span>
      )}
      <Button
        variant="outline"
        size={buttonSize}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        rightIcon={<ChevronRight className="size-4" />}
      >
        Next
      </Button>
    </div>
  );
};

// Full pagination with page numbers
export interface PaginationProps extends VariantProps<typeof paginationVariants> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  className?: string;
}

function usePagination({
  currentPage,
  totalPages,
  siblingCount = 1,
}: {
  currentPage: number;
  totalPages: number;
  siblingCount: number;
}): (number | 'ellipsis')[] {
  return React.useMemo(() => {
    const totalNumbers = siblingCount * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftEllipsis = leftSiblingIndex > 2;
    const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, 'ellipsis', totalPages];
    }

    if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, 'ellipsis', ...rightRange];
    }

    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages];
  }, [currentPage, totalPages, siblingCount]);
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  size = 'md',
  className,
}: PaginationProps) => {
  const pages = usePagination({ currentPage, totalPages, siblingCount });

  const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md';
  const iconSize = size === 'sm' ? 'size-3.5' : size === 'lg' ? 'size-5' : 'size-4';

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn(paginationVariants({ size }), className)}
    >
      {showFirstLast && (
        <Button
          variant="ghost"
          size={buttonSize}
          iconOnly
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          aria-label="Go to first page"
        >
          <ChevronLeft className={cn(iconSize, '-mr-1')} />
          <ChevronLeft className={cn(iconSize, '-ml-2')} />
        </Button>
      )}
      <Button
        variant="ghost"
        size={buttonSize}
        iconOnly
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft className={iconSize} />
      </Button>

      {pages.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex items-center justify-center size-9 text-neutral-400"
            >
              <MoreHorizontal className={iconSize} />
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <Button
            key={page}
            variant={isActive ? 'primary' : 'ghost'}
            size={buttonSize}
            iconOnly
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="ghost"
        size={buttonSize}
        iconOnly
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Go to next page"
      >
        <ChevronRight className={iconSize} />
      </Button>
      {showFirstLast && (
        <Button
          variant="ghost"
          size={buttonSize}
          iconOnly
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          aria-label="Go to last page"
        >
          <ChevronRight className={cn(iconSize, '-mr-1')} />
          <ChevronRight className={cn(iconSize, '-ml-2')} />
        </Button>
      )}
    </nav>
  );
};

// Compact pagination
export interface CompactPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const CompactPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: CompactPaginationProps) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="size-4" />
      </Button>
      <span className="text-sm text-neutral-600 dark:text-neutral-400 min-w-[80px] text-center">
        {currentPage} / {totalPages}
      </span>
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
};

export { SimplePagination, Pagination, CompactPagination };
