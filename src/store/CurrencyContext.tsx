import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CurrencyContextType {
  currency: 'USD' | 'NGN';
  setCurrency: (currency: 'USD' | 'NGN') => void;
  convertPrice: (price: number) => Promise<number>;
  formatPrice: (price: number) => string;
  exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');
  const [exchangeRate, setExchangeRate] = useState<number>(1);

  // Fetch exchange rate when currency changes
  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (currency === 'USD') {
        setExchangeRate(1);
        return;
      }

      try {
        const response = await fetch(`/api/currency/rate?from=USD&to=${currency}`);
        const data = await response.json();
        if (data.rate) {
          setExchangeRate(data.rate);
        }
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
        // Fallback rate
        setExchangeRate(currency === 'NGN' ? 1650 : 1);
      }
    };

    fetchExchangeRate();
  }, [currency]);

  const convertPrice = async (price: number): Promise<number> => {
    if (currency === 'USD') {
      return price;
    }

    try {
      const response = await fetch('/api/currency/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: price,
          from: 'USD',
          to: currency,
        }),
      });

      const data = await response.json();
      return data.convertedAmount || price * exchangeRate;
    } catch (error) {
      console.error('Failed to convert price:', error);
      return price * exchangeRate;
    }
  };

  const formatPrice = (price: number): string => {
    const symbol = currency === 'USD' ? '$' : '₦';
    const convertedPrice = price * exchangeRate;
    
    if (currency === 'NGN') {
      // Format Nigerian Naira with commas
      return `${symbol}${Math.round(convertedPrice).toLocaleString()}`;
    } else {
      // Format USD with 2 decimal places
      return `${symbol}${price.toFixed(2)}`;
    }
  };

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    convertPrice,
    formatPrice,
    exchangeRate,
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
