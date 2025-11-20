import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';
import ShopByBrand from '../components/ShopByBrand';
import UpsideDownImageSection from '../components/UpsideDownImageSection';

interface Product {
  id: number;
  name: string;
  category: string;
  subCategory: string;
  description: string;
  price: number;
  isOutOfStock: boolean;
  colors: any[];
}

interface Banner {
  image: string;
}

interface CategoryData {
  [key: string]: {
    sub: string[];
  };
}

interface CategoryPageProps {
  category: string;
}

const staticBanners: Record<string, string> = {
  WOMEN: '/be.jpg',
  CURVE: '/kids.jpg',
  MEN: '/man.jpg',
  KIDS: '/kids.jpg',
  BEAUTY: '/be.jpg',
};

const CategoryPage: React.FC<CategoryPageProps> = ({ category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryData>({});
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const params = new URLSearchParams(location.search);
  const selectedSubCategory = params.get('sub');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Build the API URL
        let url = `http://localhost:3001/api/products?category=${category}`;
        if (selectedSubCategory) {
          url += `&subCategory=${selectedSubCategory}`;
        }
        
        // Fetch products and categories in parallel
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(url),
          axios.get('http://localhost:3001/api/categories')
        ]);
        
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);

      } catch (err) {
        setProducts([]);
        setCategories({});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category, selectedSubCategory]);
  
  const handleSubCategoryClick = (sub: string | null) => {
    if (sub) {
      navigate(`?sub=${encodeURIComponent(sub)}`);
    } else {
      navigate('');
    }
  };

  // Only show the static banner for category pages, not the home page
  const showBanner = ["WOMEN", "CURVE", "MEN", "KIDS", "BEAUTY"].includes(category.toUpperCase());
  const bannerImage = staticBanners[category.toUpperCase()] || '';

  return (
    <div className="min-h-screen flex flex-col">
      {showBanner && (
        <div className="relative w-full h-80 flex items-center overflow-hidden">
          <img
            src={bannerImage}
            alt={`${category} banner`}
            className="absolute inset-0 w-full h-full object-cover object-center z-0"
          />
          <div className="absolute inset-0 bg-black/20 z-10" />
          <div className="relative z-20 flex items-center h-full w-full">
            <div className="ml-12">
              <a
                href="#main-products"
                className="inline-block bg-transparent border border-white text-white font-bold px-8 py-3 rounded shadow hover:bg-white hover:text-black transition text-lg"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      )}
      <ShopByBrand />
      {['WOMEN', 'CURVE', 'MEN', 'KIDS', 'BEAUTY'].includes(category.toUpperCase()) && (
        <UpsideDownImageSection image={bannerImage} />
      )}
      <main id="main-products" className="flex-1 container mx-auto px-4 py-8">
        
        {/* Sub-category filter links */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => handleSubCategoryClick(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${!selectedSubCategory ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
          >
            All
          </button>
          {(categories[category.toUpperCase()]?.sub || []).map(sub => (
            <button
              key={sub}
              onClick={() => handleSubCategoryClick(sub)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${selectedSubCategory === sub ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
            >
              {sub}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <ProductGrid products={products} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage; 