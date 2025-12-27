/**
 * Cafe 1973 - Skeleton Loading Components
 * Bisqueria-inspired design with Cafe 1973 brand colors
 * Animated placeholders for loading states
 */
import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  rounded = 'md',
  animate = true,
}) => {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`bg-gradient-to-r from-sand/30 via-sand/50 to-sand/30 ${roundedClasses[rounded]} ${
        animate ? 'animate-shimmer bg-[length:200%_100%]' : ''
      } ${className}`}
      style={style}
    />
  );
};

// Pre-built skeleton patterns for common use cases
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = '',
}) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className="h-4"
        width={i === lines - 1 ? '60%' : '100%'}
        rounded="lg"
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`card p-5 ${className}`}>
    <Skeleton className="h-44 w-full mb-5" rounded="xl" />
    <Skeleton className="h-5 w-3/4 mb-3" rounded="lg" />
    <Skeleton className="h-4 w-1/2 mb-5" rounded="lg" />
    <Skeleton className="h-10 w-full" rounded="xl" />
  </div>
);

export const SkeletonTableRow: React.FC<{ columns?: number; className?: string }> = ({
  columns = 5,
  className = '',
}) => (
  <tr className={className}>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-5 py-4">
        <Skeleton className="h-4" width={i === 0 ? 120 : i === columns - 1 ? 80 : 100} rounded="lg" />
      </td>
    ))}
  </tr>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number; className?: string }> = ({
  rows = 5,
  columns = 5,
  className = '',
}) => (
  <div className={`card overflow-hidden ${className}`}>
    <table className="w-full">
      <thead className="bg-sand/20 border-b border-sand-light">
        <tr>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="px-5 py-4 text-left">
              <Skeleton className="h-4" width={80} rounded="lg" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-sand-light">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonTableRow key={i} columns={columns} />
        ))}
      </tbody>
    </table>
  </div>
);

export const SkeletonDashboardCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`card p-6 ${className}`}>
    <div className="flex justify-between items-start mb-5">
      <Skeleton className="h-4 w-28" rounded="lg" />
      <Skeleton className="h-10 w-10" rounded="full" />
    </div>
    <Skeleton className="h-9 w-24 mb-2" rounded="lg" />
    <Skeleton className="h-3 w-36" rounded="lg" />
  </div>
);

export const SkeletonMenuItem: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`product-card overflow-hidden ${className}`}>
    <Skeleton className="aspect-[4/3] w-full" rounded="none" />
    <div className="p-5">
      <div className="flex justify-between items-start gap-3 mb-3">
        <Skeleton className="h-5 flex-1" rounded="lg" />
        <Skeleton className="h-6 w-20" rounded="lg" />
      </div>
      <Skeleton className="h-4 w-full mb-2" rounded="lg" />
      <Skeleton className="h-4 w-2/3 mb-4" rounded="lg" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" rounded="full" />
        <Skeleton className="h-6 w-16" rounded="full" />
      </div>
    </div>
  </div>
);

export const SkeletonCategoryPill: React.FC<{ className?: string }> = ({ className = '' }) => (
  <Skeleton className={`h-12 w-24 ${className}`} rounded="full" />
);

export default Skeleton;
