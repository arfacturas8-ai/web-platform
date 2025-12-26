import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendIndicatorProps {
  direction: 'up' | 'down' | 'stable';
  percentage: number;
  label?: string;
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({ direction, percentage, label }) => {
  const getIcon = () => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getColor = () => {
    switch (direction) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatPercentage = (value: number) => {
    const absValue = Math.abs(value);
    return `${direction === 'down' ? '-' : '+'}${absValue.toFixed(1)}%`;
  };

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${getColor()}`}>
      {getIcon()}
      <span className="text-sm font-medium">{formatPercentage(percentage)}</span>
      {label && <span className="text-xs ml-1">{label}</span>}
    </div>
  );
};

export default TrendIndicator;
