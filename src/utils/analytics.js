import ReactGA from 'react-ga4';

const TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID;

export const initGA = () => {
  if (TRACKING_ID && typeof window !== 'undefined') {
    ReactGA.initialize(TRACKING_ID, {
      gtagOptions: {
        send_page_view: false
      }
    });
    console.log('Google Analytics initialized');
  } else {
    console.log('Google Analytics not initialized - no tracking ID');
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