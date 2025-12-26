import React from 'react';

interface StockLevelIndicatorProps {
  current: number;
  reorderPoint: number;
  className?: string;
}

export function StockLevelIndicator({ current, reorderPoint, className = '' }: StockLevelIndicatorProps) {
  const getStockLevel = () => {
    if (current === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: '🔴' };
    if (current <= reorderPoint) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: '⚠️' };
    if (current <= reorderPoint * 2) return { label: 'Medium Stock', color: 'bg-blue-100 text-blue-800', icon: '🔵' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800', icon: '✅' };
  };

  const level = getStockLevel();

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${level.color} ${className}`}>
      <span>{level.icon}</span>
      <span>{level.label}</span>
      <span className="ml-1 font-semibold">({current})</span>
    </div>
  );
}
