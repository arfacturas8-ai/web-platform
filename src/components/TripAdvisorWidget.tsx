import React from 'react';
import { ExternalLink, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TripAdvisorWidgetProps {
  tripAdvisorUrl?: string;
  rating?: number;
  variant?: 'card' | 'inline' | 'badge';
  className?: string;
}

export const TripAdvisorWidget: React.FC<TripAdvisorWidgetProps> = ({
  tripAdvisorUrl,
  rating = 4.5,
  variant = 'card',
  className = '',
}) => {
  if (!tripAdvisorUrl) {
    return null;
  }

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    if (hasHalfStar && stars.length < 5) {
      stars.push(
        <Star
          key="half"
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
          style={{ clipPath: 'inset(0 50% 0 0)' }}
        />
      );
    }

    while (stars.length < 5) {
      stars.push(
        <Star
          key={`empty-${stars.length}`}
          className="w-4 h-4 text-gray-300"
        />
      );
    }

    return stars;
  };

  if (variant === 'badge') {
    return (
      <a
        href={tripAdvisorUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm ${className}`}
      >
        <img
          src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg"
          alt="TripAdvisor"
          className="h-4 brightness-0 invert"
        />
        <div className="flex items-center gap-1">
          {renderStars(rating)}
          <span className="ml-1 font-semibold">{rating.toFixed(1)}</span>
        </div>
        <ExternalLink className="w-3 h-3" />
      </a>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <img
          src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg"
          alt="TripAdvisor"
          className="h-8"
        />
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">{renderStars(rating)}</div>
          <span className="font-semibold text-lg">{rating.toFixed(1)}</span>
        </div>
        <a
          href={tripAdvisorUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          Read Reviews
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  // Card variant (default)
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img
            src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg"
            alt="TripAdvisor"
            className="h-6"
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5">{renderStars(rating)}</div>
          <span className="text-2xl font-bold">{rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">out of 5</span>
        </div>
        <p className="text-sm text-muted-foreground">
          See what our customers are saying on TripAdvisor
        </p>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.open(tripAdvisorUrl, '_blank')}
        >
          Review us on TripAdvisor
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};
