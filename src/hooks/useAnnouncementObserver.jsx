import { useState, useEffect, useRef } from 'react';

const useAnnouncementObserver = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const announcementRef = useRef(null);

  useEffect(() => {
    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem('diwaliPopupShown');
    if (popupShown) {
      setHasShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasShown) {
          setShowPopup(true);
          setHasShown(true);
          sessionStorage.setItem('diwaliPopupShown', 'true');
        }
      },
      {
        threshold: 0.3, // Show when 30% of announcement section is visible
        rootMargin: '0px 0px -100px 0px'
      }
    );

    // Try to find announcement section with different possible IDs/classes
    const findAnnouncementSection = () => {
      const possibleSelectors = [
        '#announcements',
        '#announcement',
        '[class*="announcement"]',
        '[class*="Announcement"]',
        'section:nth-of-type(3)', // Often announcements are 3rd section
        'section:nth-of-type(4)'
      ];

      for (const selector of possibleSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          announcementRef.current = element;
          observer.observe(element);
          return;
        }
      }

      // Fallback: observe the entire page after a delay
      setTimeout(() => {
        const sections = document.querySelectorAll('section');
        if (sections.length > 2) {
          announcementRef.current = sections[2];
          observer.observe(sections[2]);
        }
      }, 1000);
    };

    // Wait for page to load
    setTimeout(findAnnouncementSection, 500);

    return () => {
      if (announcementRef.current) {
        observer.unobserve(announcementRef.current);
      }
    };
  }, [hasShown]);

  return { showPopup, setShowPopup };
};

export default useAnnouncementObserver;