import React, { useState, useEffect } from 'react';
import { MapPin, Package, Clock, CheckCircle, Truck, AlertCircle, Phone } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '@/utils/constants';

interface TrackingData {
  delivery_id: string;
  order_number: string;
  status: string;
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  distance_km?: number;
  delivery_code?: string;
  driver?: {
    id: string;
    name: string;
    vehicle_type: string;
    current_location?: {
      lat: number;
      lng: number;
    };
    rating: number;
  };
  estimated_arrival_minutes?: number;
}

interface DeliveryTrackerProps {
  deliveryId: string;
  autoRefresh?: boolean;
  refreshInterval?: number; // in seconds
}

const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({
  deliveryId,
  autoRefresh = true,
  refreshInterval = 30,
}) => {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrackingData = async () => {
    try {
      const response = await axios.get(`${API_URL}/delivery-management/deliveries/${deliveryId}/track`);
      setTrackingData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load tracking data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackingData();

    if (autoRefresh) {
      const interval = setInterval(fetchTrackingData, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [deliveryId, autoRefresh, refreshInterval]);

  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          label: 'Pending Assignment',
          description: 'Looking for a driver...',
        };
      case 'assigned':
        return {
          icon: Package,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          label: 'Driver Assigned',
          description: 'Driver is on the way to pick up your order',
        };
      case 'picked_up':
        return {
          icon: Truck,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          label: 'Picked Up',
          description: 'Order picked up, on the way to you',
        };
      case 'in_transit':
        return {
          icon: Truck,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          label: 'In Transit',
          description: 'Your order is on its way',
        };
      case 'arrived':
        return {
          icon: MapPin,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          label: 'Driver Arrived',
          description: 'Driver has arrived at your location',
        };
      case 'delivered':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          label: 'Delivered',
          description: 'Order successfully delivered',
        };
      case 'failed':
      case 'cancelled':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          label: status === 'failed' ? 'Delivery Failed' : 'Cancelled',
          description: 'Please contact support',
        };
      default:
        return {
          icon: Package,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          label: status,
          description: '',
        };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !trackingData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <p>{error || 'Tracking data not available'}</p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(trackingData.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Tracking</h2>
          <p className="text-sm text-gray-500">Order #{trackingData.order_number}</p>
        </div>
        {trackingData.delivery_code && (
          <div className="text-right">
            <p className="text-xs text-gray-500">Delivery Code</p>
            <p className="text-2xl font-bold text-blue-600">{trackingData.delivery_code}</p>
          </div>
        )}
      </div>

      {/* Current Status */}
      <div className={`${statusInfo.bgColor} rounded-lg p-4 mb-6`}>
        <div className="flex items-center space-x-3">
          <StatusIcon className={`w-8 h-8 ${statusInfo.color}`} />
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${statusInfo.color}`}>
              {statusInfo.label}
            </h3>
            <p className="text-sm text-gray-600">{statusInfo.description}</p>
          </div>
        </div>
      </div>

      {/* ETA */}
      {trackingData.estimated_arrival_minutes && trackingData.status !== 'delivered' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Estimated Arrival</p>
              <p className="text-lg font-semibold text-blue-600">
                {trackingData.estimated_arrival_minutes} minutes
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Driver Info */}
      {trackingData.driver && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Driver Information</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{trackingData.driver.name}</p>
                <p className="text-sm text-gray-500 capitalize">{trackingData.driver.vehicle_type}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm font-medium">{trackingData.driver.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            {trackingData.driver.current_location && (
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Call Driver</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Delivery Timeline */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Delivery Timeline</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          {['pending', 'assigned', 'picked_up', 'in_transit', 'delivered'].map((status, index) => {
            const isCompleted = ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered']
              .indexOf(trackingData.status.toLowerCase()) >= index;
            const isCurrent = trackingData.status.toLowerCase() === status;

            return (
              <div key={status} className="relative flex items-start space-x-4 pb-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                    isCompleted
                      ? isCurrent
                        ? 'bg-blue-600'
                        : 'bg-green-600'
                      : 'bg-gray-300'
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-white' : 'bg-gray-500'}`}></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                    {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isCurrent ? 'In progress...' : isCompleted ? 'Completed' : 'Pending'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distance Info */}
      {trackingData.distance_km && (
        <div className="mt-6 pt-4 border-t flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Distance: {trackingData.distance_km.toFixed(2)} km</span>
          </div>
          {trackingData.estimated_delivery_time && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>
                Estimated: {new Date(trackingData.estimated_delivery_time).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryTracker;
