import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface WaitTimeBadgeProps {
  minutes: number;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * WaitTimeBadge - Display wait time with color coding
 * Green: < 15 min
 * Yellow: 15-30 min
 * Orange: 30-45 min
 * Red: > 45 min
 */
export const WaitTimeBadge = ({ minutes, size = 'md' }: WaitTimeBadgeProps) => {
  const getVariant = () => {
    if (minutes < 15) return 'default'; // Green
    if (minutes < 30) return 'secondary'; // Yellow
    if (minutes < 45) return 'warning'; // Orange
    return 'destructive'; // Red
  };

  const getColorClasses = () => {
    if (minutes < 15) return 'bg-green-100 text-green-800 border-green-200';
    if (minutes < 30) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (minutes < 45) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'lg':
        return 'text-lg px-4 py-2';
      default:
        return 'text-sm px-3 py-1';
    }
  };

  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';

  return (
    <Badge
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold border',
        getColorClasses(),
        getSizeClasses()
      )}
    >
      <Clock className={iconSize} />
      <span>{minutes} min</span>
    </Badge>
  );
};
