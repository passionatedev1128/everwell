import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    setIsEntering(true);
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 400); // Match animation duration
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div
      className={`page-transition-wrapper ${
        isEntering ? 'page-enter' : ''
      }`}
    >
      {children}
    </div>
  );
};

export default PageTransition;

