/**
 * Skeleton Loading Component
 * Animated placeholder for loading states
 */
import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
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
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`bg-forest/10 ${roundedClasses[rounded]} ${animate ? 'animate-pulse' : ''} ${className}`}
      style={style}
    />
  );
};

// Pre-built skeleton patterns for common use cases
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = '',
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className="h-4"
        width={i === lines - 1 ? '60%' : '100%'}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-xl p-4 shadow-soft ${className}`}>
    <Skeleton className="h-40 w-full mb-4" rounded="lg" />
    <Skeleton className="h-5 w-3/4 mb-2" />
    <Skeleton className="h-4 w-1/2 mb-4" />
    <Skeleton className="h-8 w-full" rounded="lg" />
  </div>
);

export const SkeletonTableRow: React.FC<{ columns?: number; className?: string }> = ({
  columns = 5,
  className = '',
}) => (
  <tr className={className}>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className="h-4" width={i === 0 ? 120 : i === columns - 1 ? 80 : 100} />
      </td>
    ))}
  </tr>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number; className?: string }> = ({
  rows = 5,
  columns = 5,
  className = '',
}) => (
  <div className={`bg-white rounded-xl overflow-hidden shadow-soft ${className}`}>
    <table className="w-full">
      <thead className="bg-[#faf8f3] border-b border-sand-200">
        <tr>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="px-4 py-3 text-left">
              <Skeleton className="h-4" width={80} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonTableRow key={i} columns={columns} />
        ))}
      </tbody>
    </table>
  </div>
);

export const SkeletonDashboardCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-xl p-6 shadow-soft ${className}`}>
    <div className="flex justify-between items-start mb-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-8" rounded="full" />
    </div>
    <Skeleton className="h-8 w-20 mb-2" />
    <Skeleton className="h-3 w-32" />
  </div>
);

export const SkeletonMenuItem: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-2xl overflow-hidden shadow-soft ${className}`}>
    <Skeleton className="h-48 w-full" rounded="none" />
    <div className="p-4">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3 mb-3" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-10 w-10" rounded="full" />
      </div>
    </div>
  </div>
);

export default Skeleton;
