import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Users, Star, AlertTriangle, UserPlus, Heart, UserMinus } from 'lucide-react';

interface CustomerSegmentsProps {
  data: {
    total_customers: number;
    segments: Record<string, number>;
    rfm_data?: any[];
  };
}

const CustomerSegments: React.FC<CustomerSegmentsProps> = ({ data }) => {
  const segmentConfig = {
    high_value: {
      label: 'High Value',
      color: '#10b981',
      icon: Star,
      description: 'Frequent buyers with high spending'
    },
    loyal: {
      label: 'Loyal',
      color: '#3b82f6',
      icon: Heart,
      description: 'Regular customers'
    },
    at_risk: {
      label: 'At Risk',
      color: '#f59e0b',
      icon: AlertTriangle,
      description: 'Previously active, now inactive'
    },
    new: {
      label: 'New',
      color: '#8b5cf6',
      icon: UserPlus,
      description: 'Recent first-time customers'
    },
    occasional: {
      label: 'Occasional',
      color: '#6b7280',
      icon: Users,
      description: 'Infrequent purchasers'
    },
    churned: {
      label: 'Churned',
      color: '#ef4444',
      icon: UserMinus,
      description: 'Lost customers'
    }
  };

  // Prepare chart data
  const chartData = Object.entries(data.segments).map(([segment, count]) => ({
    name: segmentConfig[segment as keyof typeof segmentConfig]?.label || segment,
    value: count,
    color: segmentConfig[segment as keyof typeof segmentConfig]?.color || '#gray'
  }));

  // Calculate percentages
  const getPercentage = (count: number) => {
    return data.total_customers > 0 ? ((count / data.total_customers) * 100).toFixed(1) : '0';
  };

  if (data.total_customers === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Customer Segmentation</h3>
        <div className="text-center py-12 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No customer data available</p>
          <p className="text-sm mt-2">Start taking orders to segment your customers</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Customer Segmentation</h3>
        <p className="text-sm text-gray-600">
          RFM Analysis - {data.total_customers} customers segmented
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`${value} customers`, 'Count']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Segment Details */}
        <div className="space-y-3">
          {Object.entries(data.segments)
            .sort(([, a], [, b]) => b - a) // Sort by count descending
            .map(([segment, count]) => {
              const config = segmentConfig[segment as keyof typeof segmentConfig];
              if (!config) return null;

              const Icon = config.icon;
              const percentage = getPercentage(count);

              return (
                <div
                  key={segment}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${config.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{config.label}</span>
                      <span className="text-sm font-semibold" style={{ color: config.color }}>
                        {count}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">{config.description}</p>
                    {/* Progress bar */}
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: config.color
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold" style={{ color: config.color }}>
                      {percentage}%
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Segmentation Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-green-50 border border-green-100 rounded-lg p-3">
            <p className="text-xs text-green-700 mb-1">High Value + Loyal</p>
            <p className="text-xl font-bold text-green-600">
              {data.segments.high_value + data.segments.loyal}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {getPercentage(data.segments.high_value + data.segments.loyal)}% of customers
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
            <p className="text-xs text-yellow-700 mb-1">At Risk</p>
            <p className="text-xl font-bold text-yellow-600">
              {data.segments.at_risk || 0}
            </p>
            <p className="text-xs text-yellow-600 mt-1">Need re-engagement</p>
          </div>

          <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
            <p className="text-xs text-purple-700 mb-1">New Customers</p>
            <p className="text-xl font-bold text-purple-600">
              {data.segments.new || 0}
            </p>
            <p className="text-xs text-purple-600 mt-1">Growth opportunity</p>
          </div>
        </div>
      </div>

      {/* RFM Explanation */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <span className="font-semibold">RFM Analysis:</span> Segments customers based on{' '}
          <span className="font-medium">Recency</span> (days since last order),{' '}
          <span className="font-medium">Frequency</span> (number of orders), and{' '}
          <span className="font-medium">Monetary</span> (total spent).
        </p>
      </div>
    </div>
  );
};

export default CustomerSegments;
