import { Outlet } from 'react-router';
import ScrollToTop from './ScrollToTop';

/**
 * Wrapper component for router that includes ScrollToTop
 */
export default function RouterWrapper() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}
