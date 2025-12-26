import React from 'react';
import { LowStockAlert as LowStockAlertType } from '../../types/inventory';

interface LowStockAlertProps {
  alerts: LowStockAlertType[];
  onCreatePO?: (productId: string) => void;
}

export function LowStockAlert({ alerts, onCreatePO }: LowStockAlertProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">Low Stock Alert</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p className="mb-2">{alerts.length} product(s) are below reorder point:</p>
            <ul className="list-disc list-inside space-y-1">
              {alerts.slice(0, 5).map((alert) => (
                <li key={alert.product.id} className="flex items-center justify-between">
                  <span>
                    <strong>{alert.product.name}</strong> ({alert.branch.name}): {alert.current_stock} units
                    (needs {alert.quantity_deficit} more)
                  </span>
                  {onCreatePO && (
                    <button
                      onClick={() => onCreatePO(alert.product.id)}
                      className="ml-4 text-yellow-800 hover:text-yellow-900 underline text-xs"
                    >
                      Create PO
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {alerts.length > 5 && (
              <p className="mt-2 text-xs">...and {alerts.length - 5} more</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
