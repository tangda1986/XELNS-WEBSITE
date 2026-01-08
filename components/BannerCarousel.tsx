
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Banner } from '../types';

interface BannerCarouselProps {
  banners: Banner[];
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners }) => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // If banners array is empty or undefined, handle gracefully
  const validBanners = banners || [];

  useEffect(() => {
    if (validBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % validBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [validBanners.length]);

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % validBanners.length);
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + validBanners.length) % validBanners.length);
  };

  const location = useLocation();
  const isHome = location.pathname === '/';

  if (validBanners.length === 0) return (
    <div className={`relative w-full ${isHome ? 'aspect-video' : 'h-[450px]'} bg-gray-900 flex items-center justify-center text-white`}>
      <p>暂无轮播图</p>
    </div>
  );

  return (
    <div className={`relative w-full ${isHome ? 'aspect-video' : 'h-[450px]'} overflow-hidden bg-gray-900`}>
        {validBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentBannerIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={banner.image} alt={banner.title || ''} className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
              {banner.title && <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight drop-shadow-lg">{banner.title}</h2>}
              {banner.subtitle && (
                <p className="text-xl md:text-2xl font-light tracking-wide drop-shadow-md">{banner.subtitle}</p>
              )}
            </div>
          </div>
        ))}

        {validBanners.length > 1 && (
          <>
            <button onClick={prevBanner} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition-all z-10">
              <ChevronLeft size={32} />
            </button>
            <button onClick={nextBanner} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition-all z-10">
              <ChevronRight size={32} />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {validBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentBannerIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${idx === currentBannerIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
  );
};

export default BannerCarousel;
