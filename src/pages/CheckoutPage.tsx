import React, { useContext } from 'react';
import { CartContext } from '../store/CartContext';
import { useCurrency } from '../store/CurrencyContext';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const CheckoutPage = () => {
  const { cart, updateQuantity } = useContext(CartContext);
  const { formatPrice } = useCurrency();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-4 sm:py-8">
      <button onClick={() => navigate('/')} style={{ fontSize: '0.9rem', margin: '0.5rem 0', background: 'none', border: 'none', cursor: 'pointer', color: '#6B21A8', fontWeight: 'bold' }}>← Home</button>
      <div className="w-full max-w-md sm:max-w-3xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-3 sm:mb-6 gap-2 sm:gap-4">
          <div className="text-base sm:text-xl font-semibold">Subtotal: <span className="font-bold">{formatPrice(subtotal)}</span></div>
          <div className="flex gap-2 sm:gap-4">
            <button onClick={() => navigate('/cart')} className="border border-gray-300 rounded-full px-3 sm:px-6 py-1.5 sm:py-2 font-medium bg-white hover:bg-gray-100 text-xs sm:text-base">View bag ({cart.reduce((sum, item) => sum + item.quantity, 0)})</button>
            <button onClick={() => navigate('/payment')} className="bg-black text-white rounded-full px-3 sm:px-6 py-1.5 sm:py-2 font-medium hover:bg-gray-900 text-xs sm:text-base">Proceed to Checkout</button>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-2 sm:px-4 py-2 sm:py-3 mb-3 sm:mb-6 flex items-center justify-center text-xs sm:text-base">
          <span className="font-medium">You earned Free Standard Shipping!</span>
        </div>
        <div className="divide-y">
          {cart.map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 py-3 sm:py-6">
              <img src={`http://localhost:3001${item.image}`} alt={item.name} className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded" />
              <div className="flex-1 w-full">
                <h3 className="font-semibold text-sm sm:text-base mb-1">{item.name}</h3>
                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                  <span className="text-gray-500 text-xs">Color:</span>
                  <span className="font-medium text-gray-800 text-xs">{item.color}</span>
                </div>
                {/* You can add size selection here if your product supports it */}
                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                  <span className="text-gray-500 text-xs">Price:</span>
                  <span className="font-medium text-gray-800 text-xs">{formatPrice(item.price)}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                  <span className="text-gray-500 text-xs">Quantity:</span>
                  <button onClick={() => updateQuantity(item, item.quantity - 1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
                  <span className="px-2 text-xs">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage; 