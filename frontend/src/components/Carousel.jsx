import { useState, useEffect, useRef } from 'react';

const Carousel = ({ items, itemsPerView = 3, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemWidth, setItemWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);

  const maxIndex = Math.max(0, items.length - itemsPerView);

  // Calculate fixed item width based on container width
  useEffect(() => {
    const calculateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
        const padding = 64; // 2rem on each side = 4rem total = 64px
        const availableWidth = width - padding;
        // mx-2 adds 0.5rem (8px) margin on each side = 16px total per item
        // For itemsPerView items, we have (itemsPerView - 1) gaps of 32px (16px from each adjacent item)
        const marginPerItem = 16; // 0.5rem * 2 = 1rem = 16px total margin per item
        const totalMargins = itemsPerView * marginPerItem;
        const calculatedWidth = (availableWidth - totalMargins) / itemsPerView;
        setItemWidth(calculatedWidth);
      }
    };

    calculateWidth();
    window.addEventListener('resize', calculateWidth);
    return () => window.removeEventListener('resize', calculateWidth);
  }, [itemsPerView]);

  // Auto-play disabled - carousel only moves when user clicks navigation buttons
  // useEffect(() => {
  //   if (!isAutoPlaying || items.length <= itemsPerView) return;

  //   const interval = setInterval(() => {
  //     setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  //   }, 4000); // Auto-advance every 4 seconds

  //   return () => clearInterval(interval);
  // }, [isAutoPlaying, maxIndex, items.length, itemsPerView]);

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
    <div 
      ref={containerRef}
      className={`relative py-4 ${className}`} 
      style={{ isolation: 'isolate', contain: 'layout style', paddingLeft: '2rem', paddingRight: '2rem' }}
    >
      <div className="overflow-hidden">
        <div
          className="flex items-stretch"
          style={{
            transform: itemWidth > 0 && containerWidth > 0 ? (() => {
              // First card is 25% wider
              const firstCardWidth = itemWidth * 1.09;
              const regularCardWidth = itemWidth;
              
              // Calculate total width of all items (first is wider)
              const totalItemsWidth = (firstCardWidth) + (items.length - 1) * (regularCardWidth);
              // Calculate visible width (container - left padding only, no right padding for last item)
              const visibleWidth = containerWidth - 32; // Only left padding (2rem = 32px)
              
              // Calculate transform based on current index
              let transformX = 0;
              if (currentIndex === 0) {
                transformX = 0;
              } else {
                // Start with first card width, then add regular cards
                transformX = (firstCardWidth) + (currentIndex - 1) * (regularCardWidth);
              }
              
              // When at maxIndex, align last item to right edge (no right padding)
              if (currentIndex === maxIndex && maxIndex > 0) {
                const lastItemPosition = totalItemsWidth - visibleWidth;
                return `translateX(-${lastItemPosition}px) translateZ(0)`;
              }
              
              return `translateX(-${transformX}px) translateZ(0)`;
            })() : 'translateX(0) translateZ(0)',
            transition: 'transform 0.5s ease-in-out',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          {items.map((item, index) => {
            // Make first card wider (25% more)
            const isFirstCard = index === 0;
            const cardWidth = itemWidth > 0 ? (isFirstCard ? itemWidth : itemWidth) : 'auto';
            
            return (
              <div
                key={index}
                className="flex-shrink-0"
                style={{ width: typeof cardWidth === 'number' ? `${cardWidth}px` : cardWidth, display: 'flex', height: '100%' }}
              >
                {item}
              </div>
            );
          })}
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

