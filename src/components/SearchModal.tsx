import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../store/CartContext';

const tabs = ['WOMEN', 'MEN', 'KIDS', 'BEAUTY'];
const hotSearches = [
  'Date Night', '4th of July', 'White Affair', 'Swimsuit',
  'Wedding Suite', 'Vacation', 'White Shorts', 'Summer Tops'
];
const topSearches = [
  { img: 'https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?auto=compress&w=80', title: 'Summer Dress' },
  { img: 'https://images.pexels.com/photos/1138903/pexels-photo-1138903.jpeg?auto=compress&w=80', title: 'Pride' },
  { img: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&w=80', title: 'Birthday Dress' },
];
const trending = [
  { img: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&w=80', title: 'Wedding Suite' },
  { img: 'https://images.pexels.com/photos/1138903/pexels-photo-1138903.jpeg?auto=compress&w=80', title: 'Florals' },
  { img: 'https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?auto=compress&w=80', title: 'White Affair' },
];

const SearchModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    if (!search) {
      setResults([]);
      setLoading(false);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    const controller = new AbortController();
    fetch(`/api/products/search?q=${encodeURIComponent(search)}`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError('Error fetching results');
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [search]);

  const handleResultClick = (product: any) => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-30 pt-12">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl mx-auto p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl font-bold">&times;</button>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🔍</span>
          <input
            type="text"
            className="flex-1 border-none outline-none bg-transparent text-lg placeholder-gray-400"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        {search ? (
          <div className="mt-4">
            {loading && <div className="text-gray-500">Searching...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && results.length === 0 && (
              <div className="text-gray-500">No results found.</div>
            )}
            {!loading && !error && results.length > 0 && (
              <div>
                <div className="font-semibold mb-2 text-sm">Search Results</div>
                <ul className="divide-y">
                  {results.map(product => (
                    <li key={product.id} className="py-2 flex items-center gap-4 cursor-pointer hover:bg-gray-100 rounded transition" onClick={() => handleResultClick(product)}>
                      {product.colors && product.colors[0]?.images && product.colors[0].images.length > 0 ? (
                        <div className="flex flex-row gap-1 items-center">
                          {product.colors[0].images.map((img, idx) => (
                            img.url ? (
                              <img
                                key={idx}
                                src={`http://localhost:3001${img.url}`}
                                alt={product.name}
                                className="w-8 h-10 object-cover rounded"
                              />
                            ) : null
                          ))}
                        </div>
                      ) : (
                        <div style={{width: 48, height: 64, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 10, borderRadius: 8}}>
                          No Image
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.category}</div>
                        <div className="text-xs text-gray-400">{product.description}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex gap-6 border-b mb-4">
              {tabs.map((tab, idx) => (
                <button
                  key={tab}
                  className={`pb-2 font-semibold text-sm ${activeTab === idx ? 'border-b-2 border-black' : 'text-gray-500'}`}
                  onClick={() => setActiveTab(idx)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="mb-4">
              <div className="font-semibold mb-2 text-sm">Hot Searches</div>
              <div className="flex flex-wrap gap-2">
                {hotSearches.map(hot => (
                  <button key={hot} className="bg-gray-100 rounded-full px-4 py-2 text-sm font-medium shadow-sm">{hot}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="font-semibold mb-2 text-sm">Top Searches</div>
                {topSearches.map((item, idx) => (
                  <div key={item.title} className="flex items-center gap-2 mb-2">
                    <span className="text-gray-400 w-4 text-right">{idx + 1}</span>
                    <img src={item.img} alt={item.title} className="w-10 h-14 object-cover rounded" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="font-semibold mb-2 text-sm">Trending</div>
                {trending.map((item, idx) => (
                  <div key={item.title} className="flex items-center gap-2 mb-2">
                    <span className="text-gray-400 w-4 text-right">{idx + 1}</span>
                    <img src={item.img} alt={item.title} className="w-10 h-14 object-cover rounded" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6 text-gray-400 text-sm">
              <button className="font-semibold" disabled>&lt; Prev</button>
              <button className="font-semibold">Next &gt;</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchModal; 