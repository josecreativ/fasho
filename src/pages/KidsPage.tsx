import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const KidsPage = () => {
  const [kidsPage, setKidsPage] = useState({
    bannerImage: '',
    saleMessage: '',
    buttonText: '',
    buttonLink: '/'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKidsPage = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/kids-page');
        setKidsPage(res.data);
      } catch (err) {
        // fallback: do nothing
      } finally {
        setLoading(false);
      }
    };
    fetchKidsPage();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-96">Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      {kidsPage.bannerImage && (
        <div className="w-full flex justify-center bg-gray-100">
          <img src={kidsPage.bannerImage} alt="Kids Banner" className="w-full max-h-[400px] object-cover object-center" />
        </div>
      )}
      {/* Sale Message */}
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <h2 className="text-3xl md:text-5xl font-extrabold text-center text-gray-900 mb-4 drop-shadow-lg">
          {kidsPage.saleMessage}
        </h2>
        <Link to={kidsPage.buttonLink} className="mt-4 px-8 py-3 bg-blue-500 text-white text-lg font-semibold rounded shadow hover:bg-blue-600 transition">
          {kidsPage.buttonText}
        </Link>
      </div>
    </div>
    <Footer />
  );
};

export default KidsPage; 