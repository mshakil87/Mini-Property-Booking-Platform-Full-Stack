import React, { useState, useCallback, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, A11y } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

interface ImageSliderProps {
  images: string[];
  altText?: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, altText = 'Property Image' }) => {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setFullscreenImage(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const openFullscreen = useCallback((src: string) => {
    setFullscreenImage(src);
  }, []);

  const closeFullscreen = useCallback(() => {
    setFullscreenImage(null);
  }, []);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="relative w-full aspect-video sm:aspect-[16/9] overflow-hidden rounded-xl bg-gray-100">
        <Swiper
          modules={[Autoplay, Pagination, A11y]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false, // Continue autoplay after interaction
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          className="h-full w-full"
        >
          {images.map((src, index) => (
            <SwiperSlide key={`${src}-${index}`}>
              <div 
                className="h-full w-full cursor-pointer touch-pan-y"
                onClick={() => openFullscreen(src)}
              >
                <img
                  src={src}
                  alt={`${altText} ${index + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-opacity duration-300"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Fullscreen Modal */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-95 p-4 animate-in fade-in duration-200"
          onClick={closeFullscreen}
          role="dialog"
          aria-modal="true"
        >
          <button 
            className="absolute top-6 right-6 text-white text-4xl font-light hover:opacity-70 focus:outline-none z-[101]"
            onClick={closeFullscreen}
            aria-label="Close fullscreen view"
          >
            &times;
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={fullscreenImage}
              alt={altText}
              className="max-w-full max-h-full object-contain select-none"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
            />
          </div>
        </div>
      )}

      {/* Custom Styles for Swiper Pagination */}
      <style>{`
        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #fff;
          opacity: 0.6;
          box-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          background: #fff;
          width: 12px;
          height: 12px;
        }
        @media (max-width: 640px) {
          .swiper-pagination-bullet {
            width: 12px;
            height: 12px;
          }
          .swiper-pagination-bullet-active {
            width: 14px;
            height: 14px;
          }
        }
      `}</style>
    </>
  );
};

export default ImageSlider;
