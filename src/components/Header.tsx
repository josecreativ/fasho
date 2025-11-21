import React, { useContext, useState, useEffect } from 'react';
import { ShoppingBag, User, Search, Heart } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../store/CartContext';
import UserAuthModal from './UserAuthModal';
import SearchModal from './SearchModal';
import CurrencySwitcher from './CurrencySwitcher';
import axios from 'axios';

interface CategoryData {
  [key: string]: {
    sub: string[];
  };
}

const mainMenu = [
  { label: 'WOMEN', href: '/women', bold: true, underline: true },
  { label: 'CURVE', href: '/curve' },
  { label: 'MEN', href: '/men' },
  { label: 'KIDS', href: '/kids' },
  { label: 'BEAUTY', href: '/beauty' },
];

const Header = () => {
  const { cart } = useContext(CartContext);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [authOpen, setAuthOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [categories, setCategories] = useState<CategoryData>({});
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activeMainCategory = mainMenu.find(item => location.pathname.startsWith(item.href))?.label || 'WOMEN';

  // Create a single flat list of all sub-categories for the secondary nav bar
  const allSubCategories = !loadingCategories
    ? Object.entries(categories).flatMap(([mainCat, { sub }]) => {
        const mainCatData = mainMenu.find(item => item.label === mainCat);
        if (!mainCatData) return [];
        return sub.map(subName => ({
          name: subName,
          href: `${mainCatData.href}?sub=${encodeURIComponent(subName)}`
        }));
      })
    : [];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories');
        setCategories(res.data);
      } catch (err) {
        setCategories({});
        console.error('Error fetching categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(true);
  };

  return (
    <>
      <header className="bg-white border-b shadow-sm">
        <div className="w-full px-2 sm:px-4">
          {/* Top Row */}
          <div className="flex flex-wrap items-center justify-between h-16 gap-y-2">
            {/* Logo */}
            <div className="flex items-center space-x-4 sm:space-x-8">
              <Link to="/">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight select-none">
                  ALLURE <span className="font-bold">FASHION</span>
                </h1>
              </Link>
              {/* Main Menu - Desktop */}
              <nav className="hidden lg:flex items-center space-x-4 sm:space-x-6">
                {mainMenu.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`uppercase text-xs sm:text-sm font-semibold tracking-wide ${
                      activeMainCategory === item.label ? 'underline underline-offset-8 decoration-2' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              {/* Hamburger - Mobile */}
              <button
                className="lg:hidden ml-2 p-2 rounded hover:bg-gray-100 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Open main menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            {/* Search, Icons Grouped */}
            <div
              className="flex flex-wrap items-center space-x-0 bg-white rounded-full border border-gray-200 px-1 sm:px-2 py-1 shadow-sm w-full sm:w-auto justify-end gap-y-2 mb-6 sm:mb-0"
            >
              {/* Search Bar (icon only for compact look) */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-600 flex items-center justify-center"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              {/* Divider */}
              <span className="hidden sm:inline w-px h-6 bg-gray-200 mx-1" />
              {/* Currency Switcher */}
              <CurrencySwitcher />
              <span className="hidden sm:inline w-px h-6 bg-gray-200 mx-1" />
              {/* User Auth */}
              <button
                onClick={() => {
                  try {
                    const user = JSON.parse(localStorage.getItem('user') || 'null');
                    if (user) {
                      navigate('/profile');
                    } else {
                      setAuthOpen(true);
                    }
                  } catch {
                    setAuthOpen(true);
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-600 flex items-center justify-center"
                title="Sign In / Create Account"
              >
                <User size={20} />
              </button>
              <span className="hidden sm:inline w-px h-6 bg-gray-200 mx-1" />
              {/* Wishlist */}
              <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 flex items-center justify-center" title="Wishlist">
                <Heart size={20} />
              </button>
              <span className="hidden sm:inline w-px h-6 bg-gray-200 mx-1" />
              {/* Cart */}
              <div className="relative flex items-center">
                <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full text-gray-600 flex items-center justify-center">
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>
                  )}
                </Link>
              </div>
            </div>
          </div>
          {/* Sub Menu - secondary nav bar with ALL sub-categories */}
          <div className="flex items-center justify-center space-x-4 sm:space-x-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold overflow-x-auto whitespace-nowrap scrollbar-hide border-t mt-6 sm:mt-0">
            {!loadingCategories && allSubCategories.map((sub) => {
              let specialClass = 'text-black';
              if (sub.name.toUpperCase() === 'SALE') specialClass = 'text-red-600';
              if (sub.name.toUpperCase() === 'SWIM') specialClass = 'text-blue-500';
              return (
                <Link
                  key={sub.href}
                  to={sub.href}
                  className={`uppercase hover:text-gray-500 transition-colors ${specialClass}`}
                >
                  {sub.name}
                </Link>
              );
            })}
          </div>
          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <nav className="lg:hidden flex flex-col space-y-1 py-2 bg-white border-b">
              {mainMenu.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`uppercase text-xs sm:text-sm font-semibold tracking-wide px-2 py-2 ${
                    activeMainCategory === item.label ? 'underline underline-offset-8 decoration-2' : ''
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
      <UserAuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Header;
