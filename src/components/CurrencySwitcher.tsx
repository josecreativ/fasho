import React, { useState } from 'react';
import { DollarSign, ChevronDown } from 'lucide-react';
import { useCurrency } from '../store/CurrencyContext';

const CurrencySwitcher: React.FC = () => {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  ];

  const currentCurrency = currencies.find(c => c.code === currency);

  const handleCurrencyChange = (newCurrency: 'USD' | 'NGN') => {
    setCurrency(newCurrency);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full text-gray-600 flex items-center justify-center"
        title="Change Currency"
      >
        <DollarSign size={22} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[180px]">
            <div className="py-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b">
                Select Currency
              </div>
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => handleCurrencyChange(curr.code as 'USD' | 'NGN')}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between ${
                    currency === curr.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{curr.symbol}</span>
                    <span className="text-sm">{curr.name}</span>
                  </div>
                  {currency === curr.code && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CurrencySwitcher;
