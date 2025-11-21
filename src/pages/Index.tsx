import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductGrid from '../components/ProductGrid';
import CookieConsent from '../components/CookieConsent';
import Footer from '../components/Footer';
import ShopByBrand from '../components/ShopByBrand';
import UpsideDownImageSection from '../components/UpsideDownImageSection';

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  isOutOfStock: boolean;
  colors: any[];
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Only fetch products marked for the home page
        const response = await axios.get('/api/products?home=true');
        setProducts(response.data);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Video Background Section */}
      <div className="relative w-full h-48 sm:h-[400px] flex items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="/video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="relative z-10 text-center px-2">
          <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg mb-2 sm:mb-4">Allure Fashion</h1>
          <a
            href="#main-products"
            className="inline-block bg-transparent border border-white text-white font-bold px-4 py-2 sm:px-8 sm:py-3 rounded shadow hover:bg-white hover:text-black transition text-base sm:text-lg mt-2 sm:mt-6"
          >
            Shop Now
          </a>
        </div>
        <div className="absolute inset-0 bg-black/30 z-5" />
      </div>
      <ShopByBrand />
      <UpsideDownImageSection image="/woman1.jpg" />
      <main className="flex-1">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <ProductGrid products={products} />
        )}
      </main>
      <CookieConsent />
      <Footer />
    </div>
  );
};

export default Index;
