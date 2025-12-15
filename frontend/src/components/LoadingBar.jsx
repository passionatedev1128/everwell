import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const LoadingBar = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (location.pathname === '/agendar') {
      setIsLoading(true);
      setProgress(0);

      // Check SimplyBookWidget status
      const checkWidgetStatus = () => {
        const widgetElement = document.getElementById('simplybook_widget');
        if (widgetElement) {
          const iframes = widgetElement.querySelectorAll('iframe');
          if (iframes.length > 0) {
            // Widget is ready
            setProgress(100);
            setTimeout(() => {
              setIsLoading(false);
            }, 300);
            return true;
          }
        }
        return false;
      };

      // Simulate loading progress
      const interval = setInterval(() => {
        if (checkWidgetStatus()) {
          clearInterval(interval);
          return;
        }
        setProgress((prev) => {
          if (prev >= 90) {
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Complete loading after max delay or when widget is ready
      const timeout = setTimeout(() => {
        if (!checkWidgetStatus()) {
          setProgress(100);
          setTimeout(() => {
            setIsLoading(false);
          }, 300);
        }
        clearInterval(interval);
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      setIsLoading(false);
      setProgress(0);
    }
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-primary/20">
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default LoadingBar;

