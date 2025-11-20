import React, { useContext } from 'react';
import ProductCard from './ProductCard';
import { CartContext } from '../store/CartContext';
import { Link } from 'react-router-dom';

interface ColorVariant {
  name: string;
  value: string;
  image: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  isOutOfStock: boolean;
  colors: ColorVariant[];
}

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="container mx-auto px-1 sm:px-2 py-2 sm:py-4">
      <div className="text-center mb-4 sm:mb-8">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Featured Collection</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-xs sm:text-sm">
          Discover our latest space-inspired fashion collection. Each piece comes in multiple colors 
          to match your cosmic style.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
        {products.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
            <ProductCard product={product} addToCart={addToCart} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
