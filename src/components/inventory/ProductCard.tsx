import React from 'react';
import { Product, StockLevel } from '../../types/inventory';
import { StockLevelIndicator } from './StockLevelIndicator';

interface ProductCardProps {
  product: Product;
  stockLevel?: StockLevel;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export function ProductCard({ product, stockLevel, onEdit, onDelete, onViewDetails }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500">SKU: {product.sku}</p>
        </div>
        {!product.is_active && (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            Inactive
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        {product.category && (
          <div className="flex items-center text-sm">
            <span className="text-gray-500 mr-2">Category:</span>
            <span className="font-medium text-gray-700">{product.category}</span>
          </div>
        )}

        {product.supplier && (
          <div className="flex items-center text-sm">
            <span className="text-gray-500 mr-2">Supplier:</span>
            <span className="font-medium text-gray-700">{product.supplier.name}</span>
          </div>
        )}

        <div className="flex items-center text-sm">
          <span className="text-gray-500 mr-2">Unit:</span>
          <span className="font-medium text-gray-700">{product.unit_of_measure}</span>
        </div>

        {product.cost_price && (
          <div className="flex items-center text-sm">
            <span className="text-gray-500 mr-2">Cost Price:</span>
            <span className="font-medium text-gray-700">${product.cost_price.toFixed(2)}</span>
          </div>
        )}
      </div>

      {stockLevel && (
        <div className="mb-4">
          <StockLevelIndicator
            current={stockLevel.quantity_available}
            reorderPoint={product.reorder_point}
          />
          <div className="mt-2 text-xs text-gray-500">
            Reorder at: {product.reorder_point} | Reorder qty: {product.reorder_quantity}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(product)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View Details
          </button>
        )}
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(product)}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(product)}
              className="px-3 py-1 text-sm font-medium text-red-600 bg-red-50 rounded hover:bg-red-100"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
