import React from 'react';
import { Navigation, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WazeNavigationButtonProps {
  address?: string;
  latitude?: number;
  longitude?: number;
  variant?: 'button' | 'link' | 'icon';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const WazeNavigationButton: React.FC<WazeNavigationButtonProps> = ({
  address,
  latitude,
  longitude,
  variant = 'button',
  size = 'default',
  className = '',
}) => {
  // Generate Waze deep link
  // Format: https://waze.com/ul?ll=[latitude],[longitude]&navigate=yes
  // Or: https://waze.com/ul?q=[address]&navigate=yes
  const generateWazeUrl = () => {
    if (latitude && longitude) {
      return `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
    } else if (address) {
      const encodedAddress = encodeURIComponent(address);
      return `https://waze.com/ul?q=${encodedAddress}&navigate=yes`;
    }
    return null;
  };

  const wazeUrl = generateWazeUrl();

  if (!wazeUrl) {
    return null;
  }

  const handleNavigate = () => {
    window.open(wazeUrl, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'link') {
    return (
      <a
        href={wazeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 text-primary hover:underline text-sm ${className}`}
      >
        <div className="flex items-center justify-center w-5 h-5 bg-[#33CCFF] rounded-full">
          <Navigation className="w-3 h-3 text-white" />
        </div>
        Navigate with Waze
        <ExternalLink className="w-3 h-3" />
      </a>
    );
  }

  if (variant === 'icon') {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={handleNavigate}
        className={`bg-[#33CCFF] hover:bg-[#2BB8E8] text-white border-[#33CCFF] ${className}`}
        title="Navigate with Waze"
      >
        <Navigation className="w-4 h-4" />
      </Button>
    );
  }

  // Button variant (default)
  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleNavigate}
      className={`bg-[#33CCFF] hover:bg-[#2BB8E8] text-white border-[#33CCFF] ${className}`}
    >
      <Navigation className="w-4 h-4 mr-2" />
      Navigate with Waze
    </Button>
  );
};
