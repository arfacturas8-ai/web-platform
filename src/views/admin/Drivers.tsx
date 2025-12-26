import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { logger } from '@/utils/logger';
import { API_URL } from '@/utils/constants';
import { Plus, Search, Filter, Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import DriverCard from '../../components/delivery/DriverCard';

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

interface Stats {
  total: number;
  available: number;
  busy: number;
  offline: number;
}

const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stats, setStats] = useState<Stats>({ total: 0, available: 0, busy: 0, offline: 0 });

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    filterDrivers();
  }, [drivers, searchTerm, statusFilter]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/delivery-management/drivers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDrivers(response.data);
      calculateStats(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (driversList: Driver[]) => {
    setStats({
      total: driversList.length,
      available: driversList.filter(d => d.current_status === 'available').length,
      busy: driversList.filter(d => d.current_status === 'busy').length,
      offline: driversList.filter(d => d.current_status === 'offline').length,
    });
  };

  const filterDrivers = () => {
    let filtered = [...drivers];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        driver =>
          driver.license_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          driver.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          driver.vehicle_plate?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(driver => driver.current_status === statusFilter);
    }

    setFilteredDrivers(filtered);
  };

  const handleDriverSelect = (driver: Driver) => {
    // This would be used when assigning a driver to a delivery
    logger.debug('Selected driver:', driver);
  };

  const handleViewDetails = (driver: Driver) => {
    // Navigate to driver details page
    window.location.href = `/admin/drivers/${driver.id}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Management</h1>
          <p className="text-gray-600 mt-1">Manage your delivery drivers</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Driver</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Drivers</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.available}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Busy</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.busy}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Offline</p>
              <p className="text-3xl font-bold text-gray-600 mt-1">{stats.offline}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <UserX className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by license, ID, or plate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="on_break">On Break</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.length > 0 ? (
          filteredDrivers.map((driver) => (
            <DriverCard
              key={driver.id}
              driver={driver}
              onSelect={handleDriverSelect}
              onViewDetails={handleViewDetails}
              showActions={true}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No drivers found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Add your first driver to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Drivers;
