import { useState, useEffect } from 'react';

const Carousel = ({ items, itemsPerView = 3, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const maxIndex = Math.max(0, items.length - itemsPerView);

  useEffect(() => {
    if (!isAutoPlaying || items.length <= itemsPerView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000); // Auto-advance every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex, items.length, itemsPerView]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setIsAutoPlaying(false);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    setIsAutoPlaying(false);
  };

  if (items.length <= itemsPerView) {
    const gridCols = itemsPerView === 3 ? 'md:grid-cols-3' : itemsPerView === 2 ? 'md:grid-cols-2' : 'md:grid-cols-4';
    return <div className={`grid grid-cols-1 ${gridCols} gap-8 ${className}`}>{items}</div>;
  }

  return (
    <div className={`relative ${className}`} style={{ isolation: 'isolate', contain: 'layout style', paddingLeft: '3rem', paddingRight: '3rem' }}>
      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%) translateZ(0)`,
            transition: 'transform 0.5s ease-in-out',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons - Isolated containers to prevent cross-button interference */}
      <div 
        style={{ 
          position: 'absolute',
          left: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          isolation: 'isolate',
          contain: 'layout style paint',
          zIndex: 50
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrev();
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onMouseOver={(e) => {
            e.stopPropagation();
          }}
          className="w-12 h-12 rounded-full bg-white border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white hidden md:flex"
          style={{ 
            isolation: 'isolate', 
            contain: 'layout style paint',
            transform: 'translateZ(0)',
            willChange: 'background-color, color',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            pointerEvents: 'auto',
            zIndex: 50
          }}
          aria-label="Previous"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ pointerEvents: 'none', display: 'block' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div 
        style={{ 
          position: 'absolute',
          right: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          isolation: 'isolate',
          contain: 'layout style paint',
          zIndex: 50
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onMouseOver={(e) => {
            e.stopPropagation();
          }}
          className="w-12 h-12 rounded-full bg-white border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white hidden md:flex"
          style={{ 
            isolation: 'isolate', 
            contain: 'layout style paint',
            transform: 'translateZ(0)',
            willChange: 'background-color, color',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            pointerEvents: 'auto',
            zIndex: 50
          }}
          aria-label="Next"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ pointerEvents: 'none', display: 'block' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsAutoPlaying(false);
            }}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              currentIndex === index
                ? 'bg-primary w-8'
                : 'bg-primary/30 hover:bg-primary/50'
            }`}
            style={currentIndex === index ? { width: '2rem', transition: 'width 0.3s ease, background-color 0.3s ease' } : { transition: 'width 0.3s ease, background-color 0.3s ease' }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;

