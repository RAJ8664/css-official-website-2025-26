import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  // Extracts the pathname from the current location
  const { pathname } = useLocation();

  // This useEffect hook will run every time the pathname changes
  useEffect(() => {
    // Scrolls the window to the top left corner
    window.scrollTo(0, 0);
  }, [pathname]);

  // This component does not render any visible UI
  return null;
}

export default ScrollToTop;