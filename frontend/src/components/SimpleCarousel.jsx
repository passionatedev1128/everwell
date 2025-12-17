import { useRef, useState, useEffect } from 'react';

const SimpleCarousel = ({ items, itemsPerView = 3, gap = 'gap-8 sm:gap-10 md:gap-12', itemWidth = 'calc(33.333% - 1rem)', minItemWidth = '300px' }) => {
  const scrollRef = useRef(null);
  const staticContainerRef = useRef(null);
  const [calculatedWidth, setCalculatedWidth] = useState(null);
  const [staticCalculatedWidth, setStaticCalculatedWidth] = useState(null);
  
  // Helper function to calculate gap value
  const getGapValue = () => {
    const windowWidth = window.innerWidth;
    let gapValue = 32; // Default to 2rem (32px) for gap-8
    
    if (gap.includes('gap-8')) {
      if (windowWidth >= 768 && gap.includes('md:gap-12')) {
        gapValue = 48; // 3rem for md and above
      } else if (windowWidth >= 640 && gap.includes('sm:gap-10')) {
        gapValue = 40; // 2.5rem for sm and above
      } else {
        gapValue = 32; // 2rem default
      }
    } else if (gap.includes('gap-10')) {
      gapValue = 40;
    } else if (gap.includes('gap-12')) {
      gapValue = 48;
    }
    
    return gapValue;
  };
  
  // Calculate fixed width for scrollable carousel
  useEffect(() => {
    const calculateWidth = () => {
      if (scrollRef.current) {
        // Use the scrollable container's width for calculation
        const containerWidth = scrollRef.current.offsetWidth || scrollRef.current.clientWidth;
        const gapValue = getGapValue();
        
        // Calculate available width
        const availableWidth = containerWidth;
        
        // Calculate card width: (availableWidth - (gaps between items)) / itemsPerView
        // For itemsPerView items, there are (itemsPerView - 1) gaps
        const totalGapWidth = (itemsPerView - 1) * gapValue;
        const cardWidth = (availableWidth - totalGapWidth) / itemsPerView;
        
        // Ensure minimum width
        const minWidth = parseInt(minItemWidth) || 300;
        const finalWidth = Math.max(cardWidth, minWidth);
        setCalculatedWidth(finalWidth);
      }
    };

    // Use a small delay to ensure DOM is ready
    const timeoutId = setTimeout(calculateWidth, 0);
    window.addEventListener('resize', calculateWidth);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', calculateWidth);
    };
  }, [itemsPerView, gap, minItemWidth]);
  
  // Calculate fixed width for static flex layout (when items <= itemsPerView)
  useEffect(() => {
    const calculateStaticWidth = () => {
      if (staticContainerRef.current) {
        const containerWidth = staticContainerRef.current.offsetWidth || staticContainerRef.current.clientWidth;
        const gapValue = getGapValue();
        
        // Calculate available width
        const availableWidth = containerWidth;
        
        // Calculate card width: (availableWidth - (gaps between items)) / itemsPerView
        const totalGapWidth = (itemsPerView - 1) * gapValue;
        const cardWidth = (availableWidth - totalGapWidth) / itemsPerView;
        
        // Ensure minimum width
        const minWidth = parseInt(minItemWidth) || 300;
        const finalWidth = Math.max(cardWidth, minWidth);
        setStaticCalculatedWidth(finalWidth);
      }
    };

    if (items.length <= itemsPerView) {
      const timeoutId = setTimeout(calculateStaticWidth, 0);
      window.addEventListener('resize', calculateStaticWidth);
      
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', calculateStaticWidth);
      };
    }
  }, [items.length, itemsPerView, gap, minItemWidth]);
  
  // Button styles that prevent blinking
  const buttonBaseStyle = {
    fontFamily: 'kodchasan',
    color: '#C0DF16',
    backgroundColor: 'white',
    transition: 'background-color 0.2s ease, color 0.2s ease',
    pointerEvents: 'auto',
    willChange: 'background-color, color',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    boxSizing: 'border-box',
    minWidth: '48px',
    minHeight: '48px',
    maxWidth: '48px',
    maxHeight: '48px',
    outline: 'none',
    border: '2px solid #C0DF16',
    borderRadius: '9999px'
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 430; // Scroll by card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // If 3 or fewer items, show flex layout with calculated widths
  if (items.length <= itemsPerView) {
    return (
      <div 
        ref={staticContainerRef}
        className={`flex ${gap} flex-wrap justify-center`}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-shrink-0"
            style={{ 
              width: staticCalculatedWidth ? `${staticCalculatedWidth}px` : itemWidth, 
              minWidth: staticCalculatedWidth ? `${staticCalculatedWidth}px` : minItemWidth,
              maxWidth: staticCalculatedWidth ? `${staticCalculatedWidth}px` : undefined,
              boxSizing: 'border-box'
            }}
          >
            {item}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <style>{`
        .simple-carousel-button {
          transition: background-color 0.2s ease, color 0.2s ease !important;
        }
        .simple-carousel-button:hover {
          background-color: #C0DF16 !important;
          color: white !important;
        }
      `}</style>
      <div className="relative" style={{ isolation: 'isolate' }}>
        {/* Left Arrow Button - Only show if more than itemsPerView */}
        {items.length > itemsPerView && (
        <div 
          style={{
            position: 'absolute',
            left: '-29px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            isolation: 'isolate',
            contain: 'layout style paint',
            zIndex: 50
          }}
        >
          <button
            onClick={() => scroll('left')}
            className="simple-carousel-button w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg"
            style={buttonBaseStyle}
            aria-label="Previous items"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ pointerEvents: 'none' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className={`flex ${gap} overflow-x-auto hide-scrollbar scroll-smooth`}
          style={{
            WebkitOverflowScrolling: 'touch',
            cursor: 'grab',
            scrollBehavior: 'auto'
          }}
        onMouseDown={(e) => {
          const startX = e.pageX - scrollRef.current.offsetLeft;
          const scrollLeft = scrollRef.current.scrollLeft;
          let isDown = true;
          
          const handleMouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollRef.current.offsetLeft;
            const walk = (x - startX) * 2;
            scrollRef.current.scrollLeft = scrollLeft - walk;
          };
          
          const handleMouseUp = () => {
            isDown = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };
          
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-shrink-0"
            style={{ 
              width: calculatedWidth ? `${calculatedWidth}px` : itemWidth, 
              minWidth: calculatedWidth ? `${calculatedWidth}px` : minItemWidth,
              maxWidth: calculatedWidth ? `${calculatedWidth}px` : undefined,
              boxSizing: 'border-box'
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Right Arrow Button - Only show if more than itemsPerView */}
      {items.length > itemsPerView && (
        <div
          style={{
            position: 'absolute',
            right: '-29px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            isolation: 'isolate',
            contain: 'layout style paint',
            zIndex: 50
          }}
        >
          <button
            onClick={() => scroll('right')}
            className="simple-carousel-button w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg"
            style={buttonBaseStyle}
            aria-label="Next items"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ pointerEvents: 'none' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
      </div>
    </>
  );
};

export default SimpleCarousel;

