import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, key } = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    // Using key ensures React Router updates on browser back/forward
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [pathname, key]);

  return null;
};

export default ScrollToTop;


