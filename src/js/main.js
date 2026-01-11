/**
 * Sasha Khan — Main JavaScript
 * Global utilities and initialization
 */

/**
 * Debounce utility function
 */
function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle utility function
 */
function throttle(func, limit = 100) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(element) {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

/**
 * Preload critical assets
 */
function preloadAssets() {
  // Preload logo
  const logo = new Image();
  logo.src = 'assets/logo/sasha-khan-logo.png';

  // Preload hero background image
  const heroImage = new Image();
  heroImage.src = 'assets/images/hero-section/lux-bag-1-hero-section.png';
}

/**
 * Handle viewport height for mobile browsers
 * Fixes the 100vh issue on mobile Safari
 */
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/**
 * Initialize global event listeners
 */
function initGlobalEvents() {
  // Handle viewport resize
  window.addEventListener('resize', debounce(setViewportHeight, 100));

  // Initial viewport height set
  setViewportHeight();

  // Handle orientation change
  window.addEventListener('orientationchange', () => {
    setTimeout(setViewportHeight, 100);
  });
}

/**
 * Performance monitoring (development only)
 */
function logPerformance() {
  if (process.env.NODE_ENV === 'development') {
    window.addEventListener('load', () => {
      const timing = performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      console.log(`Page load time: ${loadTime}ms`);
    });
  }
}

/**
 * Main initialization
 */
document.addEventListener('DOMContentLoaded', () => {
  // Preload critical assets
  preloadAssets();

  // Initialize global events
  initGlobalEvents();

  // Add page loaded indicator
  window.addEventListener('load', () => {
    document.body.classList.add('page-loaded');
  });
});

// Export utilities for potential use in other modules
window.SashaKhanUtils = {
  debounce,
  throttle,
  isInViewport,
  smoothScrollTo,
};
