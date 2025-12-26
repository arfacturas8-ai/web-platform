import React from 'react';
import { ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface OpenTableLinkProps {
  restaurantId?: string;
  enabled?: boolean;
  variant?: 'card' | 'button' | 'inline';
  className?: string;
}

export const OpenTableLink: React.FC<OpenTableLinkProps> = ({
  restaurantId,
  enabled = false,
  variant = 'button',
  className = '',
}) => {
  if (!enabled || !restaurantId) {
    return null;
  }

  // OpenTable URL format: https://www.opentable.com/r/[restaurant-name-and-id]
  // For widget: https://www.opentable.com/widget/reservation/canvas?rid=[restaurantId]
  const openTableUrl = `https://www.opentable.com/restref/client/?restref=${restaurantId}`;

  const handleOpenTable = () => {
    window.open(openTableUrl, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'inline') {
    return (
      <a
        href={openTableUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 text-primary hover:underline ${className}`}
      >
        <img
          src="https://components.otstatic.com/components/rebrand/1.45.4/images/icons/ot-logo-icon-red.png"
          alt="OpenTable"
          className="h-5 w-5"
        />
        <span>Reserve on OpenTable</span>
        <ExternalLink className="w-4 h-4" />
      </a>
    );
  }

  if (variant === 'card') {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <img
              src="https://components.otstatic.com/components/rebrand/1.45.4/images/icons/ot-logo-icon-red.png"
              alt="OpenTable"
              className="h-6 w-6"
            />
            Reserve with OpenTable
          </CardTitle>
          <CardDescription>
            Book your table through OpenTable's trusted reservation platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full border-red-600 text-red-600 hover:bg-red-50"
            onClick={handleOpenTable}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Make Reservation
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Button variant (default)
  return (
    <Button
      variant="outline"
      className={`border-red-600 text-red-600 hover:bg-red-50 ${className}`}
      onClick={handleOpenTable}
    >
      <img
        src="https://components.otstatic.com/components/rebrand/1.45.4/images/icons/ot-logo-icon-red.png"
        alt="OpenTable"
        className="h-4 w-4 mr-2"
      />
      Reserve on OpenTable
      <ExternalLink className="w-4 h-4 ml-2" />
    </Button>
  );
};
