import React, { useEffect, useState } from 'react';
import { logger } from '@/utils/logger';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '@/utils/constants';
import PredictionChart from '../../components/analytics/PredictionChart';
import CustomerSegments from '../../components/analytics/CustomerSegments';
import ProductPerformance from '../../components/analytics/ProductPerformance';
import InsightsCard from '../../components/analytics/InsightsCard';
import { RefreshCw, TrendingUp, Users, Package, Lightbulb, Download, Calendar } from 'lucide-react';

interface AnalyticsDashboardData {
  predictions: any[];
  customer_segments: any;
  product_performance: any;
  trending_items: any[];
  peak_hours: any[];
  insights: any[];
  generated_at: string;
}

const Analytics: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<AnalyticsDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch(`${API_URL}/analytics/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      logger.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [token]);

  const handleRefresh = () => {
    fetchAnalytics(true);
  };

  const handleExport = () => {
    if (!dashboardData) return;

    // Create a downloadable JSON file
    const dataStr = JSON.stringify(dashboardData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Analytics</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchAnalytics()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">AI-powered insights and predictions for your business</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                disabled={!dashboardData}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Last Updated */}
          {dashboardData && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>
                Last updated: {new Date(dashboardData.generated_at).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {!dashboardData ? (
          <div className="text-center py-12 text-gray-500">
            <p>No analytics data available</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Business Insights Section */}
            {dashboardData.insights && dashboardData.insights.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-2xl font-semibold text-gray-900">Key Insights</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboardData.insights.map((insight, index) => (
                    <InsightsCard key={index} insight={insight} />
                  ))}
                </div>
              </section>
            )}

            {/* Revenue Predictions Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-semibold text-gray-900">Revenue Predictions</h2>
              </div>
              <PredictionChart predictions={dashboardData.predictions || []} />
            </section>

            {/* Customer Segmentation Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-6 h-6 text-green-500" />
                <h2 className="text-2xl font-semibold text-gray-900">Customer Segmentation</h2>
              </div>
              <CustomerSegments data={dashboardData.customer_segments || { total_customers: 0, segments: {} }} />
            </section>

            {/* Product Performance Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-6 h-6 text-purple-500" />
                <h2 className="text-2xl font-semibold text-gray-900">Product Performance</h2>
              </div>
              <ProductPerformance
                data={dashboardData.product_performance || { best_sellers: [], worst_performers: [], total_products_analyzed: 0 }}
                trendingItems={dashboardData.trending_items || []}
              />
            </section>

            {/* Peak Hours Section */}
            {dashboardData.peak_hours && dashboardData.peak_hours.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-6 h-6 text-orange-500" />
                  <h2 className="text-2xl font-semibold text-gray-900">Peak Hours</h2>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dashboardData.peak_hours.slice(0, 6).map((peak, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{peak.day_name}</span>
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                            #{index + 1}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {peak.hour}:00
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{peak.reservation_count} reservations</span>
                          <span>{peak.total_customers} customers</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Footer Note */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">
                Analytics are updated in real-time. Use the refresh button to get the latest data.
                All predictions are based on historical data and should be used as guidance.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
