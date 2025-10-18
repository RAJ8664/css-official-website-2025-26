import ReactGA from 'react-ga4';


const TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;

export const initGA = () => {
  if (TRACKING_ID && typeof window !== 'undefined') {
    ReactGA.initialize(TRACKING_ID, {
      gtagOptions: {
        send_page_view: false
      }
    });
  } else {
    console.warn('Google Analytics not initialized - no tracking ID found');
  }
};

export const logPageView = (path) => {
  if (TRACKING_ID) {
    ReactGA.send({
      hitType: "pageview",
      page: path,
      title: document.title
    });
  }
};

export const logEvent = (category, action, label = null) => {
  if (TRACKING_ID) {
    ReactGA.event({
      category: category,
      action: action,
      label: label,
    });
  }
};