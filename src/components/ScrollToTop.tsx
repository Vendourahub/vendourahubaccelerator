import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * Component that scrolls to top on route change
 * Place inside RouterProvider to ensure it works across all navigation
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top immediately on route change
    window.scrollTo(0, 0);
    
    // Also scroll the main content area if it exists
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [pathname]);

  return null;
}
