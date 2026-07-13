/**
 * Sasha Khan — Bags Section Controller
 * Scroll-triggered video playback with horizontal scroll effect
 */

class BagsController {
  constructor() {
    this.videoSection = document.querySelector('.bags-intro');
    this.videoContainer = document.querySelector('.bags-intro__video-container');
    this.desktopVideo = document.querySelector('.bags-intro__video--desktop');
    this.tabletPortraitVideo = document.querySelector('.bags-intro__video--tablet-portrait');
    this.video = null; // Will be set based on viewport
    this.bagShowcase = document.querySelector('.bag-showcase');

    this.isVideoPlaying = false;
    this.isInHorizontalScroll = false;

    // Auto-advance to LUX cards when the keyhole video finishes
    this.videoEnded = false;
    this.autoScrollDone = false;
    this.autoScrollRaf = null;
    this.autoScrollDelayTimer = null;
    this.cancelAutoScroll = null;
    this.lastSectionTop = null;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.videoSection && (this.desktopVideo || this.tabletPortraitVideo)) {
      this.selectVideo();
      this.init();
    }
  }

  /**
   * Check if viewport is tablet portrait (768px - 990px width, height > 500px)
   * Height check prevents overlap with mobile landscape
   */
  isTabletPortrait() {
    return window.innerWidth >= 768 && window.innerWidth <= 990 && window.innerHeight > 500;
  }

  /**
   * Check if viewport is mobile portrait (width <= 767px, height > 500px)
   */
  isMobilePortrait() {
    return window.innerWidth <= 767 && window.innerHeight > 500;
  }

  /**
   * Select the correct video element based on viewport
   */
  selectVideo() {
    if ((this.isTabletPortrait() || this.isMobilePortrait()) && this.tabletPortraitVideo) {
      this.video = this.tabletPortraitVideo;
    } else if (this.desktopVideo) {
      this.video = this.desktopVideo;
    }
  }

  /**
   * Initialize the controller
   */
  init() {
    this.setupVideoObserver();
    this.setupShowcaseObserver();
    this.setupScrollHandler();
    this.setupAutoAdvance();

    // Handle viewport resize/orientation change
    window.addEventListener('resize', () => {
      const previousVideo = this.video;
      this.selectVideo();
      // If video changed, update observers
      if (previousVideo !== this.video) {
        this.isVideoPlaying = false;
      }
    });
  }

  /**
   * Setup Intersection Observer for video section
   * Plays video when 10% is visible
   */
  setupVideoObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 // 10% visibility threshold
    };

    this.videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.playVideo();
        } else {
          this.pauseVideo();
        }
      });
    }, options);

    this.videoObserver.observe(this.videoSection);
  }

  /**
   * Setup scroll handler for horizontal scroll effect
   */
  setupScrollHandler() {
    window.addEventListener('scroll', () => {
      this.handleHorizontalScroll();
    }, { passive: true });
  }

  /**
   * Handle horizontal scroll effect
   * Translates vertical scroll into horizontal video movement
   */
  handleHorizontalScroll() {
    const sectionRect = this.videoSection.getBoundingClientRect();
    const sectionTop = sectionRect.top;
    const sectionHeight = this.videoSection.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Scrolling down onto a video that already finished → auto-advance
    if (this.lastSectionTop !== null && sectionTop < this.lastSectionTop) {
      this.maybeAutoAdvance();
    }
    this.lastSectionTop = sectionTop;

    // Calculate how far we've scrolled into the section
    // The section is 200vh, so the "scroll range" for horizontal effect is 100vh
    const scrollStart = 0; // When video fills viewport (sectionTop = 0)
    const scrollRange = sectionHeight - viewportHeight; // 100vh of scroll

    // Only apply horizontal scroll when section top is at or above viewport top
    if (sectionTop <= 0 && sectionTop > -scrollRange) {
      // Calculate progress (0 to 1)
      const progress = Math.abs(sectionTop) / scrollRange;

      // Translate video horizontally (0% to -100%)
      const translateX = progress * -100;
      this.video.style.transform = `translateX(${translateX}%)`;

      this.isInHorizontalScroll = true;
    } else if (sectionTop > 0) {
      // Before horizontal scroll zone - reset position
      this.video.style.transform = 'translateX(0)';
      this.isInHorizontalScroll = false;
    } else if (sectionTop <= -scrollRange) {
      // After horizontal scroll zone - video fully exited
      this.video.style.transform = 'translateX(-100%)';
      this.isInHorizontalScroll = false;
    }
  }

  /**
   * Setup Intersection Observer for bag showcase
   */
  setupShowcaseObserver() {
    if (!this.bagShowcase) return;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    this.showcaseObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.showBagShowcase();
        }
      });
    }, options);

    this.showcaseObserver.observe(this.bagShowcase);
  }

  /**
   * Auto-advance: when the keyhole video reaches its last frame while the
   * viewer is watching it, smooth-scroll to the LUX cards on its own
   */
  setupAutoAdvance() {
    [this.desktopVideo, this.tabletPortraitVideo].forEach(video => {
      if (!video) return;

      video.addEventListener('ended', () => {
        if (video !== this.video) return;
        this.videoEnded = true;
        if (!document.hidden) {
          this.maybeAutoAdvance();
        }
      });

      // play() on an ended video restarts it from the top — re-arm
      video.addEventListener('play', () => {
        if (video !== this.video) return;
        this.videoEnded = false;
        this.autoScrollDone = false;
      });
    });

    // The video may finish while the tab is hidden — advance on return
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.maybeAutoAdvance();
      }
    });
  }

  /**
   * Auto-scroll only if the ended video still dominates the viewport
   * and the viewer hasn't already scrolled into the card sweep zone
   */
  maybeAutoAdvance() {
    if (!this.videoEnded || this.autoScrollDone || !this.video) return;

    const sectionTop = this.videoSection.getBoundingClientRect().top;
    const scrollRange = this.videoSection.offsetHeight - window.innerHeight;
    if (scrollRange <= 0) return;

    const progress = -sectionTop / scrollRange;
    const videoDominatesViewport = sectionTop < window.innerHeight * 0.25;
    const beforeCardZone = progress < 0.15;

    if (videoDominatesViewport && beforeCardZone) {
      this.autoScrollToCards(scrollRange);
    }
  }

  /**
   * Hold the final frame briefly, then glide to 25% section progress —
   * where luxury.js locks the LUX cards fully in view.
   * Any viewer input (wheel, touch, key, click) cancels the glide.
   */
  autoScrollToCards(scrollRange) {
    this.autoScrollDone = true;

    // No scroll hijacking for reduced-motion users
    if (this.prefersReducedMotion) return;

    const targetY = this.videoSection.offsetTop + scrollRange * 0.25;
    const HOLD_MS = 400;
    const GLIDE_MS = 1600;
    const easeLuxury = t => 1 - Math.pow(1 - t, 5);
    const cancelEvents = ['wheel', 'touchstart', 'keydown', 'mousedown'];

    const cancel = () => {
      if (this.autoScrollDelayTimer) {
        clearTimeout(this.autoScrollDelayTimer);
        this.autoScrollDelayTimer = null;
      }
      if (this.autoScrollRaf) {
        cancelAnimationFrame(this.autoScrollRaf);
        this.autoScrollRaf = null;
      }
      cancelEvents.forEach(evt => window.removeEventListener(evt, cancel));
      this.cancelAutoScroll = null;
    };

    this.cancelAutoScroll = cancel;
    cancelEvents.forEach(evt => {
      window.addEventListener(evt, cancel, { passive: true });
    });

    this.autoScrollDelayTimer = setTimeout(() => {
      this.autoScrollDelayTimer = null;
      const startY = window.scrollY;
      const distance = targetY - startY;
      if (distance <= 0) {
        cancel();
        return;
      }

      let startTime = null;
      const step = (timestamp) => {
        if (startTime === null) startTime = timestamp;
        const t = Math.min((timestamp - startTime) / GLIDE_MS, 1);
        window.scrollTo(0, startY + distance * easeLuxury(t));
        if (t < 1) {
          this.autoScrollRaf = requestAnimationFrame(step);
        } else {
          cancel();
        }
      };
      this.autoScrollRaf = requestAnimationFrame(step);
    }, HOLD_MS);
  }

  /**
   * Play the video
   */
  playVideo() {
    if (this.isVideoPlaying) return;

    this.video.play().then(() => {
      this.isVideoPlaying = true;
    }).catch(err => {
      console.log('Video autoplay prevented:', err);
    });
  }

  /**
   * Pause the video
   */
  pauseVideo() {
    if (!this.isVideoPlaying) return;

    this.video.pause();
    this.isVideoPlaying = false;
  }

  /**
   * Show the bag showcase section
   */
  showBagShowcase() {
    if (!this.bagShowcase) return;
    this.bagShowcase.classList.add('is-visible');
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.videoObserver) {
      this.videoObserver.disconnect();
    }
    if (this.showcaseObserver) {
      this.showcaseObserver.disconnect();
    }
    if (this.cancelAutoScroll) {
      this.cancelAutoScroll();
    }
  }
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
  new BagsController();
});
