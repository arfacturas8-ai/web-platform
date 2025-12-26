import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart } from 'lucide-react';
import TrendIndicator from './TrendIndicator';

interface Product {
  id: string;
  name: string;
  price: number;
  orders: number;
  quantity_sold: number;
  revenue: number;
  trend_direction?: 'up' | 'down' | 'stable';
  trend_percentage?: number;
}

interface ProductPerformanceProps {
  data: {
    best_sellers: Product[];
    worst_performers: Product[];
    total_products_analyzed: number;
  };
  trendingItems?: Array<{
    id: string;
    name: string;
    trend_direction: 'up' | 'down' | 'stable';
    trend_percentage: number;
    recent_revenue: number;
  }>;
}

const ProductPerformance: React.FC<ProductPerformanceProps> = ({ data, trendingItems }) => {
  const [activeTab, setActiveTab] = useState<'best' | 'worst' | 'trending'>('best');

  if (data.total_products_analyzed === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Product Performance</h3>
        <div className="text-center py-12 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No product data available</p>
          <p className="text-sm mt-2">Start selling products to see performance metrics</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'best', label: 'Top Sellers', icon: TrendingUp, count: data.best_sellers.length },
    { id: 'worst', label: 'Low Performers', icon: TrendingDown, count: data.worst_performers.length },
    ...(trendingItems && trendingItems.length > 0
      ? [{ id: 'trending', label: 'Trending', icon: Package, count: trendingItems.length }]
      : [])
  ];

  const getDisplayData = () => {
    switch (activeTab) {
      case 'best':
        return data.best_sellers;
      case 'worst':
        return data.worst_performers;
      case 'trending':
        return trendingItems || [];
      default:
        return [];
    }
  };

  const displayData = getDisplayData();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Product Performance</h3>
        <p className="text-sm text-gray-600">
          Analyzed {data.total_products_analyzed} products based on last 30 days
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="space-y-3">
        {displayData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No data available for this category</p>
          </div>
        ) : activeTab === 'trending' ? (
          // Trending items view
          (displayData as any[]).map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex-shrink-0 w-8 text-center">
                <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
              </div>

              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>${item.recent_revenue.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <TrendIndicator
                  direction={item.trend_direction}
                  percentage={item.trend_percentage}
                />
              </div>
            </div>
          ))
        ) : (
          // Best/Worst sellers view
          (displayData as Product[]).map((product, index) => (
            <div
              key={product.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex-shrink-0 w-8 text-center">
                <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
              </div>

              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>${product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShoppingCart className="w-4 h-4" />
                    <span>{product.orders} orders</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    <span>{product.quantity_sold} sold</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 text-right">
                <div className="text-lg font-bold text-gray-900">
                  ${product.revenue.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">Revenue</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Statistics */}
      {activeTab === 'best' && data.best_sellers.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <p className="text-sm text-green-700 mb-1">Top Product Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ${data.best_sellers[0].revenue.toFixed(2)}
              </p>
              <p className="text-xs text-green-600 mt-1">{data.best_sellers[0].name}</p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-sm text-blue-700 mb-1">Total Best Sellers Revenue</p>
              <p className="text-2xl font-bold text-blue-600">
                ${data.best_sellers.reduce((sum, p) => sum + p.revenue, 0).toFixed(2)}
              </p>
              <p className="text-xs text-blue-600 mt-1">Top 10 products</p>
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
              <p className="text-sm text-purple-700 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-purple-600">
                {data.best_sellers.reduce((sum, p) => sum + p.orders, 0)}
              </p>
              <p className="text-xs text-purple-600 mt-1">From top sellers</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPerformance;
