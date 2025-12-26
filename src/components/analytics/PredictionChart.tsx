import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Users, ShoppingCart } from 'lucide-react';

interface Prediction {
  date: string;
  predicted_revenue: number;
  predicted_orders: number;
  predicted_customers: number;
  confidence_score: number;
}

interface PredictionChartProps {
  predictions: Prediction[];
}

const PredictionChart: React.FC<PredictionChartProps> = ({ predictions }) => {
  if (!predictions || predictions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Predictions</h3>
        <div className="text-center py-12 text-gray-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No prediction data available</p>
          <p className="text-sm mt-2">Add more historical data to generate predictions</p>
        </div>
      </div>
    );
  }

  // Format data for chart
  const chartData = predictions.map(pred => ({
    date: new Date(pred.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: pred.predicted_revenue,
    orders: pred.predicted_orders,
    customers: pred.predicted_customers,
    confidence: (pred.confidence_score * 100).toFixed(0)
  }));

  // Calculate summary stats
  const totalPredictedRevenue = predictions.reduce((sum, p) => sum + p.predicted_revenue, 0);
  const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence_score, 0) / predictions.length;
  const totalPredictedOrders = predictions.reduce((sum, p) => sum + p.predicted_orders, 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">7-Day Revenue Prediction</h3>
        <p className="text-sm text-gray-600">
          AI-powered forecast based on historical data with {(avgConfidence * 100).toFixed(0)}% confidence
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Predicted Revenue</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            ${totalPredictedRevenue.toFixed(2)}
          </p>
          <p className="text-xs text-blue-600 mt-1">Next 7 days</p>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Expected Orders</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {Math.round(totalPredictedOrders)}
          </p>
          <p className="text-xs text-green-600 mt-1">Next 7 days</p>
        </div>

        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Confidence Score</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {(avgConfidence * 100).toFixed(0)}%
          </p>
          <p className="text-xs text-purple-600 mt-1">Prediction accuracy</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Daily Revenue Forecast</h4>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              formatter={(value: any, name?: string) => {
                if (name === 'revenue') return [`$${value.toFixed(2)}`, 'Revenue'];
                return [value, name || ''];
              }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Orders and Customers Chart */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Orders & Customer Traffic</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#10b981"
              strokeWidth={2}
              name="Orders"
              dot={{ fill: '#10b981', r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="customers"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Customers"
              dot={{ fill: '#8b5cf6', r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Confidence Indicator */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Based on 30-day historical data</span>
          <div className="flex items-center gap-2">
            <span>Confidence:</span>
            <div className="flex gap-1">
              {chartData.map((data, idx) => (
                <div
                  key={idx}
                  className="w-2 h-4 rounded-sm"
                  style={{
                    backgroundColor: `rgba(59, 130, 246, ${Number(data.confidence) / 100})`
                  }}
                  title={`${data.date}: ${data.confidence}% confidence`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionChart;
