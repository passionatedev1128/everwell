import { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button only when scrolled down more than 100px, hide when at top
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      // Hide button when at the top of the page (scrollTop === 0 or very close to 0, within 10px)
      setIsVisible(scrollTop > 100);
    };

    // Check initial scroll position
    toggleVisibility();

    // Listen to scroll events
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    window.addEventListener('resize', toggleVisibility, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      window.removeEventListener('resize', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className="scroll-to-top-btn fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark flex items-center justify-center"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
        pointerEvents: isVisible ? 'auto' : 'none',
        animation: isVisible ? 'fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
      }}
      aria-label="Voltar ao topo"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
};

export default ScrollToTopButton;

