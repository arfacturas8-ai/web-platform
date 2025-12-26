import React from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface CurrencyToggleProps {
  className?: string;
  showRate?: boolean;
}

export const CurrencyToggle: React.FC<CurrencyToggleProps> = ({
  className = '',
  showRate = false
}) => {
  const { currency, setCurrency, exchangeRate, loading } = useCurrency();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex rounded-lg border border-gray-300 overflow-hidden">
        <button
          onClick={() => setCurrency('CRC')}
          className={`px-3 py-1.5 text-sm font-medium transition-colors ${
            currency === 'CRC'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          ₡ CRC
        </button>
        <button
          onClick={() => setCurrency('USD')}
          className={`px-3 py-1.5 text-sm font-medium transition-colors ${
            currency === 'USD'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          $ USD
        </button>
      </div>
      {showRate && exchangeRate && !loading && (
        <span className="text-xs text-gray-500">
          1 USD = ₡{exchangeRate.sell.toLocaleString('es-CR')}
        </span>
      )}
    </div>
  );
};

export default CurrencyToggle;
