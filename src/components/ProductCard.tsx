import React, { useState, useContext } from 'react';
import { Heart } from 'lucide-react';
import { CartItem, CartContext } from '../store/CartContext';
import { useCurrency } from '../store/CurrencyContext';
import { useNavigate } from 'react-router-dom';

interface ColorVariant {
  name: string;
  value: string;
  images?: { url: string }[];
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  isOutOfStock: boolean;
  colors: ColorVariant[];
  originalPrice?: number; // Added for original price
}

interface ProductCardProps {
  product: Product;
  addToCart: (item: CartItem) => void;
}

const ProductCard = ({ product, addToCart }: ProductCardProps) => {
  const hasColors = Array.isArray(product.colors) && product.colors.length > 0;
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const selectedColor = hasColors ? product.colors[selectedColorIdx] : null;
  const navigate = useNavigate();
  const cartContext = useContext(CartContext);
  const { formatPrice } = useCurrency();

  const handleAddToCart = () => {
    if (!selectedColor) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: selectedColor.images && selectedColor.images[0] ? selectedColor.images[0].url : '',
      color: selectedColor.name,
      quantity: 1,
    });
    navigate('/cart');
  };

  const handleCartIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedColor) return;
    cartContext.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: selectedColor.images && selectedColor.images[0] ? selectedColor.images[0].url : '',
      color: selectedColor.name,
      quantity: 1,
    });
    // Optionally, show a toast or feedback here
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {selectedColor && selectedColor.images && selectedColor.images[0] && selectedColor.images[0].url ? (
          <img
            src={selectedColor.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div style={{width: '100%', height: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 12}}>
            No Image
          </div>
        )}
        {product.isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-base sm:text-lg">Out of Stock</span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-100">
          <button className="p-1 sm:p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors" onClick={handleCartIconClick} title="Add to Cart">
            <span role="img" aria-label="cart">🛒</span>
          </button>
          <button className="p-1 sm:p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 hover:text-red-500" />
          </button>
        </div>
      </div>
      <div className="p-2 sm:p-4 space-y-2 sm:space-y-3">
        <div>
          <h3 className="font-medium text-gray-900 text-xs sm:text-sm">{product.name}</h3>
          <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>
          <div className="mt-1 flex flex-col items-start">
            {product.originalPrice && product.originalPrice > product.price ? (
              <>
                <span className="text-xl sm:text-2xl font-bold text-red-600">{formatPrice(product.price)}</span>
                <span className="line-through text-gray-400 text-sm sm:text-base mt-1">{formatPrice(product.originalPrice)}</span>
              </>
            ) : (
              <span className="text-xl sm:text-2xl font-bold">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {hasColors ? (
            <>
              {product.colors.map((color, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 ${selectedColorIdx === idx ? 'border-purple-600 scale-110' : 'border-gray-300'} transition-transform`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                  onClick={() => setSelectedColorIdx(idx)}
                />
              ))}
              <span className="text-xs sm:text-sm text-gray-600 font-semibold ml-1 sm:ml-2">{selectedColor?.name}</span>
            </>
          ) : (
            <span className="text-xs sm:text-sm text-gray-400">No colors</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-base sm:text-lg font-semibold text-gray-900">${product.price}</span>
          <button className="text-xs bg-purple-100 text-purple-700 font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md hover:bg-purple-200 transition-colors">
            Promo
          </button>
        </div>
        <button onClick={handleAddToCart} className="mt-1 sm:mt-2 w-full bg-purple-600 text-white py-1.5 sm:py-2 rounded hover:bg-purple-700 transition-colors text-xs sm:text-base">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;
