import React, { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';
import axios from 'axios';
import { API_URL } from '@/utils/constants';
import { Package, MapPin, Phone, Navigation, CheckCircle, Camera, FileText } from 'lucide-react';
import DeliveryTracker from '../../components/delivery/DeliveryTracker';

interface Delivery {
  id: string;
  order_id: string;
  status: string;
  delivery_address: any;
  pickup_address: any;
  delivery_instructions?: string;
  delivery_code?: string;
  delivery_fee: number;
  estimated_delivery_time?: string;
}

const DriverApp: React.FC = () => {
  const [currentDelivery, setCurrentDelivery] = useState<Delivery | null>(null);
  const [deliveryQueue, setDeliveryQueue] = useState<Delivery[]>([]);
  const [driverStatus, setDriverStatus] = useState<'available' | 'busy' | 'on_break'>('available');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  const driverId = localStorage.getItem('driver_id'); // Assume driver ID is stored

  useEffect(() => {
    fetchDeliveries();
    startLocationTracking();

    const interval = setInterval(fetchDeliveries, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDeliveries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/delivery-management/deliveries`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { driver_id: driverId, status: ['assigned', 'picked_up', 'in_transit'] },
      });

      const deliveries = response.data;
      if (deliveries.length > 0) {
        setCurrentDelivery(deliveries[0]);
        setDeliveryQueue(deliveries.slice(1));
      }
    } catch (err) {
      logger.error('Failed to fetch deliveries:', err);
    } finally {
      setLoading(false);
    }
  };

  const startLocationTracking = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);
          updateLocation(newLocation);
        },
        (error) => logger.error('Location error:', error),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }
  };

  const updateLocation = async (loc: { lat: number; lng: number }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/delivery-management/drivers/${driverId}/location`,
        {
          latitude: loc.lat,
          longitude: loc.lng,
          speed: 0, // Would get from GPS in real app
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      logger.error('Failed to update location:', err);
    }
  };

  const handlePickup = async () => {
    if (!currentDelivery) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/delivery-management/deliveries/${currentDelivery.id}/pickup`,
        { pickup_notes: 'Order picked up' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCurrentDelivery({ ...currentDelivery, status: 'picked_up' });
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to mark as picked up');
    }
  };

  const handleComplete = async () => {
    if (!currentDelivery) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/delivery-management/deliveries/${currentDelivery.id}/complete`,
        {
          delivery_notes: completionNotes,
          tip_amount: 0,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowCompleteModal(false);
      setCompletionNotes('');
      fetchDeliveries();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to complete delivery');
    }
  };

  const toggleStatus = async () => {
    const newStatus = driverStatus === 'available' ? 'on_break' : 'available';

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/delivery-management/drivers/${driverId}`,
        { current_status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDriverStatus(newStatus);
    } catch (err) {
      logger.error('Failed to update status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
            <p className="text-gray-600">Driver ID: {driverId?.slice(0, 8)}</p>
          </div>
          <button
            onClick={toggleStatus}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              driverStatus === 'available'
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-yellow-600 text-white hover:bg-yellow-700'
            }`}
          >
            {driverStatus === 'available' ? 'Available' : 'On Break'}
          </button>
        </div>
      </div>

      {/* Current Delivery */}
      {currentDelivery ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Current Delivery</h2>
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {currentDelivery.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* Delivery Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-medium">{currentDelivery.order_id.slice(0, 8)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivery Code</p>
                <p className="text-2xl font-bold text-blue-600">{currentDelivery.delivery_code}</p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Delivery Address</p>
                  <p className="font-medium">{currentDelivery.delivery_address?.street}</p>
                  <p className="text-sm text-gray-600">{currentDelivery.delivery_address?.city}</p>
                </div>
                <button
                  onClick={() => {
                    const address = `${currentDelivery.delivery_address?.street}, ${currentDelivery.delivery_address?.city}`;
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank');
                  }}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                >
                  <Navigation className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Delivery Instructions */}
            {currentDelivery.delivery_instructions && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <FileText className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Delivery Instructions</p>
                    <p className="text-sm text-yellow-800 mt-1">{currentDelivery.delivery_instructions}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              {currentDelivery.status === 'assigned' && (
                <button
                  onClick={handlePickup}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Package className="w-5 h-5" />
                  <span>Mark as Picked Up</span>
                </button>
              )}

              {currentDelivery.status === 'picked_up' && (
                <>
                  <button
                    onClick={() => setShowCompleteModal(true)}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Complete Delivery</span>
                  </button>
                  <button className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300">
                    <Phone className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Tracking */}
          <div className="mt-6 pt-6 border-t">
            <DeliveryTracker deliveryId={currentDelivery.id} autoRefresh={true} refreshInterval={15} />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Deliveries</h3>
          <p className="text-gray-600">You'll see your next delivery here when one is assigned to you</p>
        </div>
      )}

      {/* Queue */}
      {deliveryQueue.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Deliveries ({deliveryQueue.length})</h2>
          <div className="space-y-3">
            {deliveryQueue.map((delivery, index) => (
              <div key={delivery.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{delivery.delivery_address?.street}</p>
                    <p className="text-sm text-gray-600">{delivery.delivery_address?.city}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Order: {delivery.order_id.slice(0, 8)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complete Delivery Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Complete Delivery</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Notes (Optional)
                </label>
                <textarea
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  rows={3}
                  placeholder="Add any notes about the delivery..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleComplete}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Complete
                </button>
                <button
                  onClick={() => setShowCompleteModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverApp;
