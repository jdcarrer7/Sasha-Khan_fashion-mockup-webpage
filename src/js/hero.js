/**
 * Sasha Khan — Hero Section Controller
 * Interactive video hover behavior for diagonal triangle layout
 */

class HeroVideoController {
  constructor() {
    this.videoSections = document.querySelectorAll('.hero-triangle--video');
    this.allSections = document.querySelectorAll('.hero-triangle');
    this.logo = document.querySelector('.hero-logo');
    this.isTouch = this.detectTouchDevice();

    this.init();
  }

  /**
   * Detect if device supports touch
   */
  detectTouchDevice() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  /**
   * Initialize event listeners
   */
  init() {
    // Set up video sections
    this.videoSections.forEach(section => {
      const video = section.querySelector('video');

      if (!video) return;

      // Ensure video is paused and ready
      video.pause();
      video.currentTime = 0;

      if (this.isTouch) {
        // Touch device behavior - toggle on tap
        section.addEventListener('touchstart', (e) => this.onTouch(e, section, video), { passive: true });
      } else {
        // Desktop hover behavior
        section.addEventListener('mouseenter', () => this.onHover(section, video));
        section.addEventListener('mouseleave', () => this.onLeave(section, video));
      }
    });

    // Handle keyboard accessibility
    this.setupKeyboardNavigation();

    // Handle reduced motion preference
    this.handleReducedMotion();
  }

  /**
   * Handle hover on desktop - play video and dim others
   */
  onHover(activeSection, video) {
    // Play the hovered video (continues from current position)
    video.play().catch(err => {
      // Handle autoplay restrictions gracefully
      console.log('Video autoplay prevented:', err);
    });

    // Dim all OTHER sections (including logo area effect)
    this.allSections.forEach(section => {
      if (section !== activeSection) {
        section.classList.add('is-dimmed');
      }
    });

    // Mark active section
    activeSection.classList.add('is-active');

    // Subtle logo dim effect
    if (this.logo) {
      this.logo.classList.add('is-dimmed');
    }
  }

  /**
   * Handle mouse leave - pause video at current position
   */
  onLeave(activeSection, video) {
    // Pause video at current frame (does NOT reset)
    video.pause();

    // Remove dimming from all sections
    this.allSections.forEach(section => {
      section.classList.remove('is-dimmed');
    });

    // Remove active state
    activeSection.classList.remove('is-active');

    // Remove logo dim
    if (this.logo) {
      this.logo.classList.remove('is-dimmed');
    }
  }

  /**
   * Handle touch interaction - toggle play/pause
   */
  onTouch(event, section, video) {
    // Prevent double-firing
    event.stopPropagation();

    const isPlaying = !video.paused;

    if (isPlaying) {
      // If playing, pause it
      video.pause();
      section.classList.remove('is-active');
      this.allSections.forEach(s => s.classList.remove('is-dimmed'));
    } else {
      // Pause all other videos first
      this.videoSections.forEach(s => {
        const v = s.querySelector('video');
        if (v && s !== section) {
          v.pause();
          s.classList.remove('is-active');
        }
      });

      // Play this video
      video.play().catch(err => {
        console.log('Video autoplay prevented:', err);
      });

      // Dim others
      this.allSections.forEach(s => {
        if (s !== section) {
          s.classList.add('is-dimmed');
        } else {
          s.classList.remove('is-dimmed');
        }
      });

      section.classList.add('is-active');
    }
  }

  /**
   * Setup keyboard navigation for accessibility
   */
  setupKeyboardNavigation() {
    this.videoSections.forEach((section, index) => {
      const video = section.querySelector('video');

      // Make sections focusable
      section.setAttribute('tabindex', '0');
      section.setAttribute('role', 'button');
      section.setAttribute('aria-label', `Play video ${index + 1}`);

      section.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();

          if (video.paused) {
            this.onHover(section, video);
          } else {
            this.onLeave(section, video);
          }
        }
      });

      section.addEventListener('focus', () => {
        if (video) {
          this.onHover(section, video);
        }
      });

      section.addEventListener('blur', () => {
        if (video) {
          this.onLeave(section, video);
        }
      });
    });
  }

  /**
   * Handle prefers-reduced-motion
   */
  handleReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleMotionPreference = (e) => {
      if (e.matches) {
        // Reduced motion - pause all videos
        this.videoSections.forEach(section => {
          const video = section.querySelector('video');
          if (video) {
            video.pause();
            video.currentTime = 0;
          }
        });
      }
    };

    mediaQuery.addEventListener('change', handleMotionPreference);
    handleMotionPreference(mediaQuery);
  }
}

/**
 * Logo Parallax Effect (subtle)
 */
class LogoParallax {
  constructor() {
    this.logo = document.querySelector('.hero-logo__image');
    this.intensity = 0.02; // Subtle movement

    if (this.logo && !this.prefersReducedMotion()) {
      this.init();
    }
  }

  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  init() {
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }

  onMouseMove(e) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const deltaX = (e.clientX - centerX) * this.intensity;
    const deltaY = (e.clientY - centerY) * this.intensity;

    requestAnimationFrame(() => {
      this.logo.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });
  }
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize video controller
  new HeroVideoController();

  // Initialize logo parallax
  new LogoParallax();

  // Add loaded class for animations
  document.body.classList.add('is-loaded');
});

/**
 * Handle page visibility - pause videos when tab is hidden
 */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.querySelectorAll('.hero-triangle--video video').forEach(video => {
      video.pause();
    });
  }
});
