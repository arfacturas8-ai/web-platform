import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/utils/constants';
import { MapPin, Truck, Package, RefreshCw } from 'lucide-react';
import RouteMap from '../../components/delivery/RouteMap';

interface Driver {
  id: string;
  current_latitude?: number;
  current_longitude?: number;
  current_status: string;
  vehicle_type: string;
  total_deliveries: number;
}

interface Delivery {
  id: string;
  driver_id?: string;
  status: string;
  delivery_address: {
    street: string;
    city: string;
    lat: number;
    lng: number;
  };
}

const DeliveryMap: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchData();

    if (autoRefresh) {
      const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [driversRes, deliveriesRes] = await Promise.all([
        axios.get(`${API_URL}/delivery-management/drivers`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/delivery-management/deliveries`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { status: 'in_transit', limit: 100 },
        }),
      ]);

      setDrivers(driversRes.data.filter((d: Driver) => d.current_latitude && d.current_longitude));
      setDeliveries(deliveriesRes.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load map data');
    } finally {
      setLoading(false);
    }
  };

  const getDriverDeliveries = (driverId: string) => {
    return deliveries.filter(d => d.driver_id === driverId);
  };

  const getDriverStops = (driverId: string) => {
    const driverDeliveries = getDriverDeliveries(driverId);
    return driverDeliveries.map((delivery, index) => ({
      sequence: index + 1,
      order_id: delivery.id,
      delivery_id: delivery.id,
      address: delivery.delivery_address,
      status: delivery.status,
      distance_from_previous: 0, // Would calculate in real implementation
      estimated_arrival: new Date().toISOString(),
    }));
  };

  const activeDrivers = drivers.filter(d => d.current_status !== 'offline');
  const availableDrivers = drivers.filter(d => d.current_status === 'available');
  const busyDrivers = drivers.filter(d => d.current_status === 'busy');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Delivery Map</h1>
          <p className="text-gray-600 mt-1">Track all drivers and deliveries in real-time</p>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Auto-refresh</span>
          </label>
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Drivers</p>
              <p className="text-3xl font-bold">{activeDrivers.length}</p>
            </div>
            <Truck className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-3xl font-bold text-green-600">{availableDrivers.length}</p>
            </div>
            <MapPin className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">On Delivery</p>
              <p className="text-3xl font-bold text-yellow-600">{busyDrivers.length}</p>
            </div>
            <Package className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Deliveries</p>
              <p className="text-3xl font-bold text-purple-600">{deliveries.length}</p>
            </div>
            <Package className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Driver List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Active Drivers</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {activeDrivers.map((driver) => (
                <button
                  key={driver.id}
                  onClick={() => setSelectedDriver(driver)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    selectedDriver?.id === driver.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        driver.current_status === 'available' ? 'bg-green-500' :
                        driver.current_status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Driver #{driver.id.slice(0, 8)}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{driver.vehicle_type}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {getDriverDeliveries(driver.id).length} deliveries
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-4">
            {selectedDriver && getDriverStops(selectedDriver.id).length > 0 ? (
              <RouteMap
                stops={getDriverStops(selectedDriver.id)}
                driverLocation={
                  selectedDriver.current_latitude && selectedDriver.current_longitude
                    ? {
                        lat: selectedDriver.current_latitude,
                        lng: selectedDriver.current_longitude,
                      }
                    : undefined
                }
                height="600px"
                showControls={true}
              />
            ) : (
              <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedDriver
                      ? 'No active deliveries for this driver'
                      : 'Select a driver to view their route'}
                  </h3>
                  <p className="text-gray-600">
                    {selectedDriver
                      ? 'This driver has no pending deliveries'
                      : 'Choose a driver from the list to see their location and route'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Driver Info */}
          {selectedDriver && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Driver Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Driver ID</p>
                  <p className="font-medium">{selectedDriver.id.slice(0, 8)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{selectedDriver.current_status.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="font-medium capitalize">{selectedDriver.vehicle_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Deliveries</p>
                  <p className="font-medium">{selectedDriver.total_deliveries}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryMap;
