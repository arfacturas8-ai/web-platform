import React from 'react';
import {
  MapPin,
  Navigation,
  Star,
  Calendar,
  Facebook,
  Instagram,
  Twitter,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TripAdvisorWidget } from './TripAdvisorWidget';
import { OpenTableLink } from './OpenTableLink';
import { WazeNavigationButton } from './WazeNavigationButton';

interface IntegrationHubProps {
  settings?: {
    tripAdvisorUrl?: string;
    tripAdvisorRating?: number;
    openTableRestaurantId?: string;
    openTableEnabled?: boolean;
    wazeAddress?: string;
    businessLatitude?: number;
    businessLongitude?: number;
    address?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    twitterUrl?: string;
  };
  variant?: 'full' | 'compact' | 'grid';
  className?: string;
}

export const IntegrationHub: React.FC<IntegrationHubProps> = ({
  settings = {},
  variant = 'grid',
  className = '',
}) => {
  const {
    tripAdvisorUrl,
    tripAdvisorRating = 4.5,
    openTableRestaurantId,
    openTableEnabled = false,
    wazeAddress,
    businessLatitude,
    businessLongitude,
    address,
    facebookUrl,
    instagramUrl,
    twitterUrl,
  } = settings;

  // Google Maps URL
  const googleMapsUrl = businessLatitude && businessLongitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${businessLatitude},${businessLongitude}`
    : address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : null;

  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center gap-3 ${className}`}>
        {tripAdvisorUrl && (
          <TripAdvisorWidget
            tripAdvisorUrl={tripAdvisorUrl}
            rating={tripAdvisorRating}
            variant="badge"
          />
        )}
        {openTableEnabled && openTableRestaurantId && (
          <OpenTableLink
            restaurantId={openTableRestaurantId}
            enabled={openTableEnabled}
            variant="button"
          />
        )}
        {(wazeAddress || (businessLatitude && businessLongitude)) && (
          <WazeNavigationButton
            address={wazeAddress}
            latitude={businessLatitude}
            longitude={businessLongitude}
            variant="button"
            size="sm"
          />
        )}
        {googleMapsUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => openExternalLink(googleMapsUrl)}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Google Maps
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Find & Connect With Us</CardTitle>
          <CardDescription>
            Book tables, navigate to our location, and stay connected on social media
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Reviews Section */}
          {tripAdvisorUrl && (
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Reviews
              </h3>
              <TripAdvisorWidget
                tripAdvisorUrl={tripAdvisorUrl}
                rating={tripAdvisorRating}
                variant="inline"
              />
            </div>
          )}

          {/* Reservations Section */}
          {openTableEnabled && openTableRestaurantId && (
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Reservations
              </h3>
              <OpenTableLink
                restaurantId={openTableRestaurantId}
                enabled={openTableEnabled}
                variant="inline"
              />
            </div>
          )}

          {/* Navigation Section */}
          {(googleMapsUrl || wazeAddress || (businessLatitude && businessLongitude)) && (
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Navigation
              </h3>
              <div className="flex flex-wrap gap-2">
                {googleMapsUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openExternalLink(googleMapsUrl)}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Google Maps
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                )}
                {(wazeAddress || (businessLatitude && businessLongitude)) && (
                  <WazeNavigationButton
                    address={wazeAddress}
                    latitude={businessLatitude}
                    longitude={businessLongitude}
                    variant="button"
                    size="sm"
                  />
                )}
              </div>
            </div>
          )}

          {/* Social Media Section */}
          {(facebookUrl || instagramUrl || twitterUrl) && (
            <div>
              <h3 className="text-sm font-semibold mb-3">Social Media</h3>
              <div className="flex gap-2">
                {facebookUrl && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openExternalLink(facebookUrl)}
                    title="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </Button>
                )}
                {instagramUrl && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openExternalLink(instagramUrl)}
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </Button>
                )}
                {twitterUrl && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openExternalLink(twitterUrl)}
                    title="Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Grid variant (default)
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {/* TripAdvisor Card */}
      {tripAdvisorUrl && (
        <TripAdvisorWidget
          tripAdvisorUrl={tripAdvisorUrl}
          rating={tripAdvisorRating}
          variant="card"
        />
      )}

      {/* OpenTable Card */}
      {openTableEnabled && openTableRestaurantId && (
        <OpenTableLink
          restaurantId={openTableRestaurantId}
          enabled={openTableEnabled}
          variant="card"
        />
      )}

      {/* Navigation Card */}
      {(googleMapsUrl || wazeAddress || (businessLatitude && businessLongitude)) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Get Directions
            </CardTitle>
            <CardDescription>
              Navigate to our location with your preferred app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {googleMapsUrl && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => openExternalLink(googleMapsUrl)}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Open in Google Maps
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            )}
            {(wazeAddress || (businessLatitude && businessLongitude)) && (
              <WazeNavigationButton
                address={wazeAddress}
                latitude={businessLatitude}
                longitude={businessLongitude}
                variant="button"
                className="w-full"
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Social Media Card */}
      {(facebookUrl || instagramUrl || twitterUrl) && (
        <Card>
          <CardHeader>
            <CardTitle>Follow Us</CardTitle>
            <CardDescription>
              Stay updated with our latest news and offers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {facebookUrl && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openExternalLink(facebookUrl)}
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
              )}
              {instagramUrl && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openExternalLink(instagramUrl)}
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </Button>
              )}
              {twitterUrl && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openExternalLink(twitterUrl)}
                  title="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
