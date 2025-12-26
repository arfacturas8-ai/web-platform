import React from 'react';
import { InventoryValue } from '../../types/inventory';

interface InventoryValueCardProps {
  value: InventoryValue;
}

export function InventoryValueCard({ value }: InventoryValueCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Value</h3>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-3xl font-bold text-blue-600">${value.total_value.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">Total Value</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600">{value.total_products}</p>
          <p className="text-sm text-gray-500 mt-1">Products</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-purple-600">{value.total_items}</p>
          <p className="text-sm text-gray-500 mt-1">Total Items</p>
        </div>
      </div>

      {Object.keys(value.by_category).length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">By Category</h4>
          <div className="space-y-2">
            {Object.entries(value.by_category).map(([category, data]) => (
              <div key={category} className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">{category}</span>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">${data.value.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{data.items} items</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
