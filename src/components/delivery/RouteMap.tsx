import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Flag } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
}

interface Stop {
  sequence: number;
  order_id: string;
  delivery_id: string;
  address: {
    street: string;
    city: string;
    lat: number;
    lng: number;
  };
  status: string;
  distance_from_previous: number;
  estimated_arrival: string;
}

interface RouteMapProps {
  stops: Stop[];
  driverLocation?: Location;
  pickupLocation?: Location;
  height?: string;
  showControls?: boolean;
}

const RouteMap: React.FC<RouteMapProps> = ({
  stops,
  driverLocation,
  pickupLocation,
  height = '500px',
  showControls = true,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);

  // Initialize Google Map
  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    const initialCenter = driverLocation || pickupLocation || stops[0]?.address || { lat: 40.7128, lng: -74.0060 };

    const newMap = new window.google.maps.Map(mapRef.current, {
      center: initialCenter,
      zoom: 12,
      mapTypeControl: showControls,
      streetViewControl: showControls,
      fullscreenControl: showControls,
    });

    setMap(newMap);

    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, []);

  // Update markers when stops or driver location changes
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers: any[] = [];

    // Add driver marker
    if (driverLocation && window.google) {
      const driverMarker = new window.google.maps.Marker({
        position: driverLocation,
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 5,
          fillColor: '#4F46E5',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
        title: 'Driver Location',
        zIndex: 999,
      });
      newMarkers.push(driverMarker);
    }

    // Add pickup location marker
    if (pickupLocation && window.google) {
      const pickupMarker = new window.google.maps.Marker({
        position: pickupLocation,
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#10B981',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
        title: 'Pickup Location',
        label: {
          text: 'P',
          color: '#FFFFFF',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      });
      newMarkers.push(pickupMarker);
    }

    // Add stop markers
    stops.forEach((stop, index) => {
      if (!window.google) return;

      const isCompleted = stop.status === 'completed';
      const marker = new window.google.maps.Marker({
        position: { lat: stop.address.lat, lng: stop.address.lng },
        map: map,
        label: {
          text: stop.sequence.toString(),
          color: '#FFFFFF',
          fontSize: '12px',
          fontWeight: 'bold',
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: isCompleted ? '#10B981' : '#F59E0B',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
        title: `Stop ${stop.sequence}: ${stop.address.street}`,
      });

      // Info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold">Stop #${stop.sequence}</h3>
            <p class="text-sm">${stop.address.street}</p>
            <p class="text-sm">${stop.address.city}</p>
            <p class="text-xs text-gray-500 mt-1">Order: ${stop.order_id.slice(0, 8)}</p>
            <p class="text-xs text-gray-500">Status: ${stop.status}</p>
            <p class="text-xs text-gray-500">Distance: ${stop.distance_from_previous.toFixed(2)} km</p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // Fit bounds to show all markers
    if (newMarkers.length > 0 && window.google) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds);
    }
  }, [map, stops, driverLocation, pickupLocation]);

  // Draw route polyline
  useEffect(() => {
    if (!map || !window.google || stops.length < 2) return;

    const coordinates = stops.map(stop => ({
      lat: stop.address.lat,
      lng: stop.address.lng,
    }));

    // Add driver location at the start if available
    if (driverLocation) {
      coordinates.unshift(driverLocation);
    } else if (pickupLocation) {
      coordinates.unshift(pickupLocation);
    }

    const routePath = new window.google.maps.Polyline({
      path: coordinates,
      geodesic: true,
      strokeColor: '#4F46E5',
      strokeOpacity: 0.8,
      strokeWeight: 4,
      map: map,
    });

    return () => {
      routePath.setMap(null);
    };
  }, [map, stops, driverLocation, pickupLocation]);

  return (
    <div className="relative">
      <div
        ref={mapRef}
        style={{ height }}
        className="w-full rounded-lg shadow-md"
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          <span className="text-xs font-medium">Driver</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
          <span className="text-xs font-medium">Pickup / Completed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-xs font-medium">Pending Stop</span>
        </div>
      </div>

      {/* Route Info */}
      {stops.length > 0 && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="font-semibold text-gray-900 mb-2">Route Summary</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Stops:</span>
              <span className="font-medium">{stops.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completed:</span>
              <span className="font-medium text-green-600">
                {stops.filter(s => s.status === 'completed').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Distance:</span>
              <span className="font-medium">
                {stops.reduce((sum, stop) => sum + stop.distance_from_previous, 0).toFixed(2)} km
              </span>
            </div>
          </div>
        </div>
      )}

      {/* No Google Maps fallback */}
      {!window.google && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Map not available</p>
            <p className="text-sm text-gray-500">Google Maps API key required</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteMap;
