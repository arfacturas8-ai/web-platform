import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trackOutboundLink } from '@/utils/analytics';

interface GoogleMapProps {
  /** Latitude of the location */
  latitude?: number;
  /** Longitude of the location */
  longitude?: number;
  /** Address text to display */
  address?: string;
  /** Height of the map (default: 400px) */
  height?: number;
  /** Show the card wrapper (default: true) */
  showCard?: boolean;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({
  latitude = Number(process.env.NEXT_PUBLIC_BAKERY_LATITUDE) || 40.7589,
  longitude = Number(process.env.NEXT_PUBLIC_BAKERY_LONGITUDE) || -73.9851,
  address = process.env.NEXT_PUBLIC_BAKERY_ADDRESS || '123 Café 1973 Street, New York, NY 10001',
  height = 400,
  showCard = true,
}) => {
  // Construct Google Maps embed URL (no API key needed for iframe embed)
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8'
  }&q=${latitude},${longitude}&zoom=15`;

  // Construct directions URL
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  const handleGetDirections = () => {
    trackOutboundLink(directionsUrl, 'Get Directions to Café 1973');
    window.open(directionsUrl, '_blank', 'noopener,noreferrer');
  };

  const mapContent = (
    <>
      <div className="relative" style={{ height: `${height}px` }}>
        <iframe
          title="Café 1973 Location"
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg"
        />
      </div>
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-2">
          <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Café 1973</p>
            <p className="text-sm text-muted-foreground">{address}</p>
          </div>
        </div>
        <Button onClick={handleGetDirections} className="w-full sm:w-auto">
          <Navigation className="mr-2 h-4 w-4" />
          Get Directions
        </Button>
      </div>
    </>
  );

  if (!showCard) {
    return <div className="w-full">{mapContent}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visit Us</CardTitle>
      </CardHeader>
      <CardContent>{mapContent}</CardContent>
    </Card>
  );
};
