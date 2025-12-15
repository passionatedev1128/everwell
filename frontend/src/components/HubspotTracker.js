import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function HubspotTracker() {
  const location = useLocation();

  useEffect(() => {
    // Ensure queue exists (initialize if needed)
    if (typeof window !== 'undefined') {
      window._hsq = window._hsq || [];
    }

    // Function to track page view
    const trackPageView = () => {
      const queue = window._hsq;
      if (!queue) return;

      try {
        // Check if HubSpot is ready (queue is an object, not an array)
        // If queue is still an array, HubSpot hasn't processed it yet, but we can still push
        // HubSpot will process the queue when it's ready
        queue.push(["setPath", location.pathname + location.search]);
        queue.push(["trackPageView"]);
      } catch (error) {
        // Silently fail if HubSpot is blocked or not available
        if (import.meta.env.DEV) {
          console.warn('HubSpot: Failed to track page view', error);
        }
      }
    };

    // Track immediately
    trackPageView();

    // Also track after a short delay to ensure HubSpot is ready
    // This handles the case where the script loads after React mounts
    const timeoutId = setTimeout(() => {
      trackPageView();
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [location]);

  return null;
}

