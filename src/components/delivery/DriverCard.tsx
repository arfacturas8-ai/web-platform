import React from 'react';
import { User, Star, TrendingUp, DollarSign, Package, MapPin, Phone } from 'lucide-react';

interface Driver {
  id: string;
  user_id: string;
  vehicle_type: string;
  vehicle_model?: string;
  vehicle_plate?: string;
  license_number: string;
  is_available: boolean;
  current_status: string;
  current_latitude?: number;
  current_longitude?: number;
  total_deliveries: number;
  successful_deliveries: number;
  average_rating: number;
  total_earnings: number;
  is_verified: boolean;
}

interface DriverCardProps {
  driver: Driver;
  onSelect?: (driver: Driver) => void;
  onViewDetails?: (driver: Driver) => void;
  showActions?: boolean;
}

const DriverCard: React.FC<DriverCardProps> = ({
  driver,
  onSelect,
  onViewDetails,
  showActions = true,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'on_break':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'car':
        return '🚗';
      case 'bike':
        return '🚴';
      case 'scooter':
        return '🛵';
      case 'van':
        return '🚐';
      default:
        return '🚗';
    }
  };

  const successRate = driver.total_deliveries > 0
    ? ((driver.successful_deliveries / driver.total_deliveries) * 100).toFixed(1)
    : '0';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Driver #{driver.id.slice(0, 8)}</h3>
            <p className="text-sm text-gray-500">License: {driver.license_number}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(driver.current_status)}`}>
            {driver.current_status.replace('_', ' ').toUpperCase()}
          </span>
          {driver.is_verified && (
            <span className="text-green-500" title="Verified">✓</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getVehicleIcon(driver.vehicle_type)}</span>
          <div>
            <p className="text-xs text-gray-500">Vehicle</p>
            <p className="text-sm font-medium capitalize">{driver.vehicle_type}</p>
            {driver.vehicle_model && (
              <p className="text-xs text-gray-400">{driver.vehicle_model}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Location</p>
            <p className="text-sm font-medium">
              {driver.current_latitude && driver.current_longitude
                ? `${driver.current_latitude.toFixed(4)}, ${driver.current_longitude.toFixed(4)}`
                : 'Unknown'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Package className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-xs text-gray-500">Deliveries</p>
            <p className="text-sm font-semibold">{driver.total_deliveries}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-xs text-gray-500">Success Rate</p>
            <p className="text-sm font-semibold">{successRate}%</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="text-xs text-gray-500">Rating</p>
            <p className="text-sm font-semibold">{driver.average_rating.toFixed(1)} ⭐</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-xs text-gray-500">Earnings</p>
            <p className="text-sm font-semibold">${driver.total_earnings}</p>
          </div>
        </div>
      </div>

      {showActions && (
        <div className="flex space-x-2 pt-4 border-t">
          {onSelect && driver.is_available && (
            <button
              onClick={() => onSelect(driver)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Assign Driver
            </button>
          )}
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(driver)}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              View Details
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DriverCard;
