import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../store/CartContext';
import { useCurrency } from '../store/CurrencyContext';
import { Heart, ChevronDown } from 'lucide-react';
import ProductGrid from '../components/ProductGrid'; // Assuming you have this component

interface ColorImage {
  url: string;
}

interface ColorVariant {
  name: string;
  value: string;
  images: ColorImage[];
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  isOutOfStock: boolean;
  colors: ColorVariant[];
  originalPrice?: number; // Added for price display
}

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products`);
        const data = await response.json();
        setAllProducts(data);
        const found = data.find((p: Product) => String(p.id) === String(id));
        setProduct(found || null);
      } catch {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id]);

  useEffect(() => {
    setSelectedImageIdx(0);
  }, [selectedColorIdx]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error || !product) return <div className="p-8 text-red-500 text-center">Product not found.</div>;

  const selectedColor = product.colors?.[selectedColorIdx];
  const images = selectedColor?.images || [];
  const mainImage = images[selectedImageIdx]?.url;

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert('Please select a size.');
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: images[0]?.url || '',
      color: selectedColor.name,
      quantity: 1,
      size: selectedSize,
    });
    navigate('/cart');
  };
  
  const similarProducts = allProducts.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="font-sans">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Home Arrow */}
        <button onClick={() => navigate('/')} style={{ fontSize: '0.9rem', margin: '0.5rem 0', background: 'none', border: 'none', cursor: 'pointer', color: '#6B21A8', fontWeight: 'bold' }}>← Home</button>
        <div className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4">
          <Link to="/" className="hover:underline">Home</Link> &gt; 
          <Link to={`/${product.category.toLowerCase()}`} className="hover:underline"> {product.category}</Link> &gt; 
          <span> {product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {/* Left: Image Gallery */}
          <div className="flex flex-col md:flex-row-reverse gap-2 sm:gap-4">
            <div className="flex-1">
              {mainImage ? (
                <img src={mainImage} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-md" />
              ) : (
                <div className="w-full aspect-square bg-gray-200 flex items-center justify-center rounded-lg">No Image</div>
              )}
            </div>
            <div className="flex flex-row md:flex-col gap-1 sm:gap-2 overflow-x-auto md:overflow-y-auto max-h-[300px] md:max-h-[600px]">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`w-12 h-12 sm:w-20 sm:h-20 flex-shrink-0 border-2 rounded-md overflow-hidden ${selectedImageIdx === idx ? 'border-black' : 'border-transparent'}`}
                  onClick={() => setSelectedImageIdx(idx)}
                >
                  <img src={img.url} alt={`thumbnail-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">{product.name}</h1>
            {product.originalPrice && product.originalPrice > product.price ? (
              <>
                <div className="text-xl sm:text-3xl font-bold text-red-600">{formatPrice(product.price)}</div>
                <div className="line-through text-gray-400 text-base sm:text-2xl mt-1">{formatPrice(product.originalPrice)}</div>
              </>
            ) : (
                <div className="text-xl sm:text-3xl font-bold">{formatPrice(product.price)}</div>
            )}
            <div className="text-xs sm:text-sm text-red-500 font-semibold mb-2 sm:mb-4">get free discount in our promo price</div>

            <div className="mb-2 sm:mb-4">
              <p className="font-semibold mb-1 sm:mb-2">{selectedColor?.name}</p>
              <div className="flex items-center gap-1 sm:gap-2">
                {product.colors.map((color, idx) => (
                  <button
                    key={idx}
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition ${selectedColorIdx === idx ? 'border-black' : 'border-gray-300'}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setSelectedColorIdx(idx)}
                  />
                ))}
              </div>
            </div>

            <div className="mb-2 sm:mb-4">
              <div className="flex justify-between items-center mb-1 sm:mb-2">
                <p className="font-semibold">Size</p>
                <button onClick={() => setShowSizeGuide(true)} className="text-xs sm:text-sm underline">View Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map(size => (
                  <button
                    key={size}
                    className={`px-2 py-1 sm:px-4 sm:py-2 border rounded-md hover:bg-gray-100 ${selectedSize === size ? 'bg-black text-white' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              <button onClick={handleAddToCart} className="flex-1 bg-black text-white py-2 sm:py-3 rounded-full font-semibold hover:bg-gray-800 text-xs sm:text-base">
                Add to Bag
              </button>
              <button className="p-2 sm:p-3 border rounded-full hover:bg-gray-100" onClick={handleAddToCart} title="Go to Cart">
                <Heart />
              </button>
            </div>

            <div className="mt-4 sm:mt-6 border-t">
              <div className="border-b py-2 sm:py-4">
                <button className="w-full flex justify-between items-center font-semibold text-xs sm:text-base">
                  <span>Product Details</span>
                  <ChevronDown />
                </button>
                {/* Accordion content can be added here */}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Styles Section */}
        {similarProducts.length > 0 && (
          <div className="mt-8 sm:mt-16">
            <h2 className="text-base sm:text-xl font-bold text-center mb-3 sm:mb-6">SEE 20+ SIMILAR STYLES</h2>
            <ProductGrid products={similarProducts} />
            <div className="text-center mt-3 sm:mt-6">
              <button className="bg-black text-white px-4 py-2 sm:px-8 sm:py-3 rounded-full font-semibold hover:bg-gray-800 text-xs sm:text-base">Shop Similar</button>
            </div>
          </div>
        )}
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowSizeGuide(false)}>
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-black"
              onClick={() => setShowSizeGuide(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-center mb-6">SIZE GUIDE</h3>
            <table className="w-full text-base border rounded overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Size</th>
                  <th className="border px-4 py-2">Top (US)</th>
                  <th className="border px-4 py-2">Chest (In)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border px-4 py-2">S</td><td className="border px-4 py-2">34-36</td><td className="border px-4 py-2">35-37</td></tr>
                <tr><td className="border px-4 py-2">M</td><td className="border px-4 py-2">38-40</td><td className="border px-4 py-2">38-40</td></tr>
                <tr><td className="border px-4 py-2">L</td><td className="border px-4 py-2">42</td><td className="border px-4 py-2">42-44</td></tr>
                <tr><td className="border px-4 py-2">XL</td><td className="border px-4 py-2">46</td><td className="border px-4 py-2">46-48</td></tr>
                <tr><td className="border px-4 py-2">XXL</td><td className="border px-4 py-2">48</td><td className="border px-4 py-2">50-52</td></tr>
                <tr><td className="border px-4 py-2">XXXL</td><td className="border px-4 py-2">50</td><td className="border px-4 py-2">54-56</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage; 