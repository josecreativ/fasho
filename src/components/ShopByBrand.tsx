import React from 'react';

// List all image filenames in the public folder (excluding uploads and video.mp4) and their custom labels
const brandImages = [
  { filename: 'fineman.jpg', label: 'Allure man' },
  { filename: 'woman1.jpg', label: 'Allure luxe' },
  { filename: 'woman2.jpg', label: 'Allure curve' },
  { filename: 'child.jpg', label: 'Allure kids' },
  { filename: 'woman4.jpg', label: 'Allure sport' },
  { filename: 'woman3.jpg', label: 'Allure beauty' },
];

const ShopByBrand: React.FC = () => {
  return (
    <section className="my-8 sm:my-12">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 px-2 sm:px-4">SHOP BY BRAND</h2>
      <div className="grid grid-cols-2 gap-3 px-2 sm:px-4 sm:flex sm:flex-nowrap sm:justify-center sm:gap-6 sm:overflow-x-auto sm:scrollbar-thin sm:scrollbar-thumb-gray-300 sm:scrollbar-track-gray-100">
        {brandImages.map(({ filename, label }) => (
          <div
            key={filename}
            className="relative group rounded-lg overflow-hidden shadow-lg w-full h-40 sm:w-60 sm:h-96 bg-gray-100"
          >
            <img
              src={`/${filename}`}
              alt={label}
              className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 flex items-end h-full">
              <span className="w-full text-left text-white text-base sm:text-2xl font-bold p-2 sm:p-4 tracking-wide" style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.7) 100%)',
                fontFamily: 'inherit',
                letterSpacing: '0.05em',
              }}>
                {label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShopByBrand; 