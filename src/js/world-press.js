/**
 * Sasha Khan — World Press Section Controller
 * Fade-in reveal on scroll + subtle parallax drift on the magazine figures
 * All viewports; disabled entirely under prefers-reduced-motion
 */

class WorldPressController {
  constructor() {
    this.section = document.querySelector('.world-press');
    if (!this.section) return;

    // Reduced motion: leave the section fully static and visible
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Elements that fade in as they enter the viewport
    this.revealTargets = [
      '.world-press__header',
      '.world-press__figure--hero',
      '.world-press__column--text > *',
      '.world-press__figure--secondary .world-press__image-frame',
      '.world-press__figure--secondary .world-press__figcaption',
      '.world-press__closing'
    ].flatMap(sel => [...this.section.querySelectorAll(sel)]);

    // Wrappers that drift as the page scrolls (parents of reveal targets,
    // so the two transforms never fight over the same element)
    this.parallaxItems = [
      { el: this.section.querySelector('.world-press__column--hero'), speed: 34 },
      { el: this.section.querySelector('.world-press__figure--secondary'), speed: -26 }
    ].filter(item => item.el);

    this.ticking = false;
    this.init();
  }

  init() {
    this.setupReveal();
    this.setupParallax();
  }

  /**
   * Fade-in reveal: stagger via per-element delay, one-shot observer
   */
  setupReveal() {
    this.revealTargets.forEach((el, index) => {
      el.classList.add('wp-reveal');
      el.style.setProperty('--wp-delay', `${Math.min(index * 90, 540)}ms`);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    this.revealTargets.forEach(el => observer.observe(el));
  }

  /**
   * Parallax drift, rAF-throttled; positions read minus the offset we
   * applied ourselves so the loop stays stable
   */
  setupParallax() {
    this.parallaxItems.forEach(item => {
      item.current = 0;
      item.el.classList.add('wp-parallax');
    });

    const onScroll = () => {
      if (this.ticking) return;
      this.ticking = true;
      requestAnimationFrame(() => {
        this.updateParallax();
        this.ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    this.updateParallax();
  }

  updateParallax() {
    const vh = window.innerHeight;
    const sectionRect = this.section.getBoundingClientRect();

    // Skip work while the section is far off-screen
    if (sectionRect.bottom < -200 || sectionRect.top > vh + 200) return;

    this.parallaxItems.forEach(item => {
      if (!item.el.offsetParent) return; // hidden in this viewport

      const rect = item.el.getBoundingClientRect();
      const untransformedCenter = rect.top + rect.height / 2 - item.current;

      // -0.5 → 0.5 as the element crosses the viewport
      const progress = (vh / 2 - untransformedCenter) / vh;
      item.current = +(progress * item.speed).toFixed(1);
      item.el.style.transform = `translate3d(0, ${item.current}px, 0)`;
    });
  }
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
  new WorldPressController();
});
