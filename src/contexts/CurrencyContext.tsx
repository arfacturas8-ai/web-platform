import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface ExchangeRate {
  buy: number;   // Tipo de cambio compra
  sell: number;  // Tipo de cambio venta
  date: string;
  source: string;
}

interface CurrencyContextType {
  currency: 'CRC' | 'USD';
  setCurrency: (currency: 'CRC' | 'USD') => void;
  exchangeRate: ExchangeRate | null;
  loading: boolean;
  error: string | null;
  formatPrice: (priceInColones: number, showBothCurrencies?: boolean) => string;
  convertToUSD: (priceInColones: number) => number;
  convertToCRC: (priceInUSD: number) => number;
  refreshRate: () => Promise<void>;
  lastUpdated: Date | null;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// BCCR API indicator codes
// 317 = Tipo de cambio de compra del dólar
// 318 = Tipo de cambio de venta del dólar
const BCCR_API_URL = 'https://gee.bccr.fi.cr/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx/ObtenerIndicadoresEconomicos';

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<'CRC' | 'USD'>('CRC');
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load currency preference on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('preferred_currency');
      if (saved === 'CRC' || saved === 'USD') {
        setCurrencyState(saved);
      }
    }
  }, []);

  const setCurrency = (newCurrency: 'CRC' | 'USD') => {
    setCurrencyState(newCurrency);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred_currency', newCurrency);
    }
  };

  const fetchExchangeRate = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to get from backend first (which can cache and proxy BCCR)
      const response = await fetch('/api/v1/settings/exchange-rate');

      if (response.ok) {
        const data = await response.json();
        setExchangeRate({
          buy: data.buy,
          sell: data.sell,
          date: data.date,
          source: 'BCCR'
        });
        setLastUpdated(new Date());
        return;
      }
    } catch (err) {
      console.warn('Backend exchange rate not available, using fallback');
    }

    // Fallback: Use a reasonable default rate if BCCR is unavailable
    // This should be updated periodically or fetched from a reliable source
    try {
      // Try alternative API (exchangerate-api.com has free tier)
      const fallbackResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        const crcRate = data.rates?.CRC || 520;
        setExchangeRate({
          buy: crcRate * 0.99,  // Slightly lower for buy
          sell: crcRate * 1.01, // Slightly higher for sell
          date: new Date().toISOString().split('T')[0],
          source: 'ExchangeRate-API'
        });
        setLastUpdated(new Date());
        return;
      }
    } catch (err) {
      console.warn('Fallback API failed, using default rate');
    }

    // Ultimate fallback: Use a reasonable default
    setExchangeRate({
      buy: 515,
      sell: 525,
      date: new Date().toISOString().split('T')[0],
      source: 'Default'
    });
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchExchangeRate();

    // Refresh rate every 30 minutes
    const interval = setInterval(fetchExchangeRate, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchExchangeRate]);

  const convertToUSD = useCallback((priceInColones: number): number => {
    if (!exchangeRate) return priceInColones / 520; // Fallback rate
    return priceInColones / exchangeRate.sell;
  }, [exchangeRate]);

  const convertToCRC = useCallback((priceInUSD: number): number => {
    if (!exchangeRate) return priceInUSD * 520; // Fallback rate
    return priceInUSD * exchangeRate.buy;
  }, [exchangeRate]);

  const formatPrice = useCallback((priceInColones: number, showBothCurrencies = false): string => {
    const formatCRC = (amount: number) => {
      return `₡${amount.toLocaleString('es-CR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    const formatUSD = (amount: number) => {
      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    if (showBothCurrencies && exchangeRate) {
      const usdAmount = convertToUSD(priceInColones);
      return `${formatCRC(priceInColones)} (${formatUSD(usdAmount)})`;
    }

    if (currency === 'USD') {
      const usdAmount = convertToUSD(priceInColones);
      return formatUSD(usdAmount);
    }

    return formatCRC(priceInColones);
  }, [currency, exchangeRate, convertToUSD]);

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    exchangeRate,
    loading,
    error,
    formatPrice,
    convertToUSD,
    convertToCRC,
    refreshRate: fetchExchangeRate,
    lastUpdated
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

// Convenience hook for just formatting prices
export const useFormatPrice = () => {
  const { formatPrice } = useCurrency();
  return formatPrice;
};
