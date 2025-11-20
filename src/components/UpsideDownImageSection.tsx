import React from 'react';

interface UpsideDownImageSectionProps {
  image: string;
  alt?: string;
  rotation?: number; // degrees, optional
}

const UpsideDownImageSection: React.FC<UpsideDownImageSectionProps> = ({ image, alt = 'Collection', rotation = 0 }) => {
  return (
    <section className="relative w-full h-48 sm:h-[500px] flex items-center justify-center overflow-hidden select-none">
      {/* Background image, fully covers section */}
      <img
        src={image}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        style={rotation ? { transform: `rotate(${rotation}deg)` } : {}}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 z-10" />
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full px-2">
        <h2 className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-white mb-2 sm:mb-6 text-center drop-shadow-lg">
          50% OFF COLLECTION
        </h2>
        <a
          href="#main-products"
          className="inline-block border border-white text-white font-bold px-4 py-2 sm:px-8 sm:py-3 rounded shadow hover:bg-white hover:text-black transition text-base sm:text-lg bg-transparent backdrop-blur-sm bg-opacity-10"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          SHOP NOW
        </a>
      </div>
    </section>
  );
};

export default UpsideDownImageSection; 