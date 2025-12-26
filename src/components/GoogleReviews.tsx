import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, AlertCircle } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

interface Review {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description: string;
}

interface GoogleReviewsProps {
  maxReviews?: number;
}

export const GoogleReviews: React.FC<GoogleReviewsProps> = ({ maxReviews = 5 }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: settings } = useSettings();

  useEffect(() => {
    // In a production environment, this would fetch from Google Places API
    // For now, we'll use mock data
    const fetchReviews = async () => {
      try {
        setLoading(true);

        // Mock data - replace with actual Google Places API call
        // API call would use settings?.google_place_id
        setTimeout(() => {
          const mockReviews: Review[] = [
            {
              author_name: 'Maria Garcia',
              rating: 5,
              text: 'Absolutely amazing! The croissants are the best I\'ve ever had. Fresh every morning and the staff is so friendly.',
              time: Date.now() - 86400000 * 2,
              relative_time_description: '2 days ago',
            },
            {
              author_name: 'John Smith',
              rating: 5,
              text: 'Best bakery in town! The sourdough bread is incredible and their pastries are to die for.',
              time: Date.now() - 86400000 * 5,
              relative_time_description: '5 days ago',
            },
            {
              author_name: 'Sophie Chen',
              rating: 4,
              text: 'Great selection of breads and pastries. Prices are reasonable and quality is top-notch.',
              time: Date.now() - 86400000 * 7,
              relative_time_description: 'a week ago',
            },
            {
              author_name: 'David Rodriguez',
              rating: 5,
              text: 'I come here every weekend! The cinnamon rolls are heavenly. Can\'t recommend enough!',
              time: Date.now() - 86400000 * 10,
              relative_time_description: '10 days ago',
            },
            {
              author_name: 'Emma Wilson',
              rating: 5,
              text: 'Beautiful bakery with an amazing atmosphere. Everything tastes as good as it looks!',
              time: Date.now() - 86400000 * 14,
              relative_time_description: '2 weeks ago',
            },
          ];

          setReviews(mockReviews.slice(0, maxReviews));
          setAverageRating(4.8);
          setTotalReviews(127);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load reviews');
        setLoading(false);
      }
    };

    fetchReviews();
  }, [maxReviews]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }
          />
        ))}
      </div>
    );
  };

  const handleWriteReview = () => {
    // Open Google review page
    const googlePlaceId = settings?.google_place_id;
    if (googlePlaceId) {
      window.open(
        `https://search.google.com/local/writereview?placeid=${googlePlaceId}`,
        '_blank'
      );
    } else {
      // Fallback to search
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(settings?.restaurant_name || 'Café 1973')}`,
        '_blank'
      );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-4">
              {error || 'No reviews available at the moment'}
            </p>
            <Button onClick={handleWriteReview} variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              Be the First to Review
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Customer Reviews</CardTitle>
          <Button onClick={handleWriteReview} variant="outline" size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            Write a Review
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="flex items-center gap-4 pb-4 border-b">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center mt-1">{renderStars(Math.round(averageRating))}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {totalReviews} reviews
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              Our customers love our fresh baked goods and friendly service!
            </p>
          </div>
        </div>

        {/* Individual Reviews */}
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="pb-4 last:pb-0 border-b last:border-b-0"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold">{review.author_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {review.relative_time_description}
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {review.text}
              </p>
            </div>
          ))}
        </div>

        {/* View All Reviews */}
        <div className="text-center pt-2">
          <Button
            variant="link"
            onClick={() => {
              const googlePlaceId = settings?.google_place_id;
              if (googlePlaceId) {
                window.open(
                  `https://search.google.com/local/reviews?placeid=${googlePlaceId}`,
                  '_blank'
                );
              } else {
                window.open(
                  `https://www.google.com/search?q=${encodeURIComponent(settings?.restaurant_name || 'Café 1973')}+reviews`,
                  '_blank'
                );
              }
            }}
          >
            View All {totalReviews} Reviews
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
