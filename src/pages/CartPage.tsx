import React, { useContext } from 'react';
import { CartContext } from '../store/CartContext';
import { useCurrency } from '../store/CurrencyContext';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const { formatPrice } = useCurrency();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-8 flex flex-col items-center">
      <button onClick={() => navigate('/')} style={{ fontSize: '0.9rem', margin: '0.5rem 0', background: 'none', border: 'none', cursor: 'pointer', color: '#6B21A8', fontWeight: 'bold' }}>← Home</button>
      <div className="w-full max-w-md sm:max-w-4xl bg-white rounded-lg shadow p-2 sm:p-6">
        <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6">Shopping Bag</h2>
        {cart.length === 0 ? (
          <div className="text-center">
            <p>Your cart is empty.</p>
            <Link to="/" className="text-purple-600 underline">Continue Shopping</Link>
          </div>
        ) : (
          <>
            <div className="divide-y">
              {cart.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 py-3 sm:py-6">
                  <img src={item.image} alt={item.name} className="w-24 h-24 sm:w-40 sm:h-40 object-cover rounded" />
                  <div className="flex-1 w-full">
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">{item.name}</h3>
                    <div className="flex items-center gap-2 sm:gap-4 mb-1 sm:mb-2">
                      <span className="text-gray-500 text-xs sm:text-sm">Color: <span className="font-medium text-gray-800">{item.color}</span></span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 mb-1 sm:mb-2">
                      <span className="text-gray-500 text-xs sm:text-sm">Price: <span className="font-medium text-gray-800">{formatPrice(item.price)}</span></span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 mb-1 sm:mb-2">
                      <span className="text-gray-500 text-xs sm:text-sm">Quantity:</span>
                      <button onClick={() => updateQuantity(item, item.quantity - 1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
                      <span className="px-2">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item)} className="text-red-500 text-xs mt-1 sm:mt-2">Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-8 gap-2 sm:gap-4">
              <div className="text-base sm:text-lg font-bold">Subtotal: {formatPrice(subtotal)}</div>
              <button onClick={() => navigate('/checkout')} className="bg-black text-white px-4 sm:px-8 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-gray-900 transition-colors">Proceed to Checkout</button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage; 