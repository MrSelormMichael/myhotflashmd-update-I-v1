// ============================================
// NAV.JS v5.0 — Production Ready
// - Header + mobile nav
// - Hero slider (supports any number of slides)
// - Scroll reveal
// - Parallax
// - Marquee
// - Symptom quiz → redirects to waitlist.html
// - Optional floating booking bubble
// ============================================

document.addEventListener('DOMContentLoaded', function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ============================================================
  // HEADER + MOBILE NAV
  // ============================================================
  function initHeader() {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.main-nav');

    if (!header || !toggle || !nav) return;

    function closeMenu() {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('menu-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ============================================================
  // HERO SLIDER — supports any number of slides
  // ============================================================
  function initSlider() {
    const slider = document.querySelector('[data-slider]');
    if (!slider) return;

    const slides = slider.querySelectorAll('[data-slide]');
    const dots = slider.querySelectorAll('[data-slider-dot]');
    const prevBtn = slider.querySelector('[data-slider-prev]');
    const nextBtn = slider.querySelector('[data-slider-next]');
    const progressBar = slider.querySelector('[data-slider-progress-bar]');

    if (slides.length === 0) return;

    const duration = reduceMotion ? 8000 : 5500;
    let current = 0;
    let timer = null;
    let isTransitioning = false;
    let touchStartX = 0;

    function goTo(index) {
      if (isTransitioning) return;
      isTransitioning = true;

      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      current = index;

      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === current);
      });

      if (progressBar && !reduceMotion) {
        progressBar.style.display = 'block';
        progressBar.classList.remove('running');
        void progressBar.offsetWidth;
        progressBar.style.setProperty('--slide-duration', duration + 'ms');
        progressBar.classList.add('running');
      } else if (progressBar) {
        progressBar.style.display = 'none';
      }

      setTimeout(() => {
        isTransitioning = false;
      }, 100);
    }

    function next() {
      if (!isTransitioning) goTo(current + 1);
    }

    function prev() {
      if (!isTransitioning) goTo(current - 1);
    }

    function startAutoplay() {
      if (document.hidden) return;
      stopAutoplay();
      timer = setInterval(next, duration);
    }

    function stopAutoplay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        next();
        restartAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prev();
        restartAutoplay();
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goTo(index);
        restartAutoplay();
      });
    });

    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      const delta = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) > 40) {
        if (delta < 0) next();
        else prev();
        restartAutoplay();
      }
    }, { passive: true });

    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
        restartAutoplay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
        restartAutoplay();
      }
    });

    if (!reduceMotion) {
      slider.addEventListener('mouseenter', stopAutoplay);
      slider.addEventListener('mouseleave', startAutoplay);
      slider.addEventListener('focusin', stopAutoplay);
      slider.addEventListener('focusout', startAutoplay);
    }

    goTo(0);
    setTimeout(startAutoplay, 500);

    const cta = document.querySelector('.cta-glass .btn');
    if (cta) {
      setTimeout(() => cta.classList.add('pulse'), 1500);
    }
  }

  // ============================================================
  // SCROLL REVEAL
  // ============================================================
  function initReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length === 0) return;

    if ('IntersectionObserver' in window && !reduceMotion) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(el => observer.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('in-view'));
    }
  }

  // ============================================================
  // PARALLAX (story-visual)
  // ============================================================
  function initParallax() {
    const parallaxEl = document.querySelector('.story-visual');
    if (!parallaxEl || reduceMotion) return;

    window.addEventListener('scroll', () => {
      const rect = parallaxEl.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh - rect.top) / (vh + rect.height);
      const shift = Math.max(-1, Math.min(1, progress - 0.5)) * 24;
      parallaxEl.style.transform = 'translateY(' + shift + 'px)';
    }, { passive: true });
  }

  // ============================================================
  // MARQUEE
  // ============================================================
  function initMarquee() {
    const marquee = document.querySelector('[data-marquee]');
    if (!marquee) return;

    const inner = marquee.querySelector('.marquee-inner');
    const track = marquee.querySelector('.marquee-track');
    if (!inner || !track) return;

    if (reduceMotion) {
      inner.style.animation = 'none';
      inner.style.opacity = '1';
      inner.style.flexWrap = 'nowrap';
      inner.style.width = 'auto';
      return;
    }

    function setupMarquee() {
      const trackWidth = track.scrollWidth;
      if (trackWidth > 0) {
        inner.style.setProperty('--marquee-w', trackWidth + 'px');
        inner.style.width = (trackWidth * 2) + 'px';
        inner.classList.add('is-ready');
        inner.style.animation = 'marqueeScroll 45s linear infinite';
        inner.style.animationPlayState = 'running';
      } else {
        setTimeout(setupMarquee, 100);
      }
    }

    setTimeout(setupMarquee, 100);

    if (document.fonts) {
      document.fonts.ready.then(() => {
        setTimeout(setupMarquee, 50);
      });
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setupMarquee, 200);
    });

    marquee.addEventListener('mouseenter', () => {
      inner.style.animationPlayState = 'paused';
    });

    marquee.addEventListener('mouseleave', () => {
      inner.style.animationPlayState = 'running';
    });
  }

  // ============================================================
  // QUIZ — symptom check-in → redirects to waitlist.html
  // ============================================================
  function initQuiz() {
    const quizButton = document.getElementById('quiz-result-button');
    const quizResult = document.getElementById('quiz-result');
    const symptomLabels = document.querySelectorAll('.quiz-symptom');

    if (!quizButton || !quizResult || symptomLabels.length === 0) return;

    // Where the "Get my guide" button sends users
    const GUIDE_PAGE = 'waitlist.html';

    const insights = [
      {
        label: 'Temperature regulation',
        symptoms: [0],
        text: 'Hot flashes and night sweats can reflect changes in the way your brain regulates temperature.'
      },
      {
        label: 'Sleep',
        symptoms: [1],
        text: 'Sleep disruption can stem from hormone changes—and make every other symptom feel harder.'
      },
      {
        label: 'Mood & thinking',
        symptoms: [2, 3],
        text: 'Mood shifts, anxiety, and brain fog often overlap, and they deserve to be taken seriously.'
      },
      {
        label: 'Metabolic health',
        symptoms: [4],
        text: 'Changes in weight or metabolism are part of the whole picture, not a personal failure.'
      },
      {
        label: 'Sexual & vaginal health',
        symptoms: [5, 6],
        text: 'Vaginal, sexual, and libido changes are common, treatable, and worth talking about.'
      },
      {
        label: 'Cycle changes',
        symptoms: [7],
        text: 'Changing or irregular periods can be an early clue that your hormones are shifting.'
      }
    ];

    // Checkbox toggle
    symptomLabels.forEach(label => {
      const checkbox = label.querySelector('input[type="checkbox"]');
      if (!checkbox) return;

      checkbox.addEventListener('change', () => {
        label.classList.toggle('checked', checkbox.checked);
        const anyChecked = [...symptomLabels].some(l => l.querySelector('input').checked);
        quizButton.disabled = !anyChecked;
        quizResult.hidden = true;
      });
    });

    // Submit
    quizButton.addEventListener('click', () => {
      const selected = [];
      symptomLabels.forEach(label => {
        const checkbox = label.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
          selected.push(Number(label.dataset.value));
        }
      });

      const title =
        selected.length >= 5 ? 'Your symptoms deserve a closer look.' :
        selected.length >= 2 ? 'There may be more connecting these symptoms.' :
        'One symptom is still worth talking about.';

      const activePatterns = insights.filter(p =>
        p.symptoms.some(s => selected.includes(s))
      );

      const patternsHTML = activePatterns.map(p =>
        '<article><b>' + p.label + '</b><p>' + p.text + '</p></article>'
      ).join('');

      quizResult.innerHTML =
        '<p class="result-kicker">Your check-in</p>' +
        '<h3>' + title + '</h3>' +
        '<p>Symptoms alone cannot diagnose perimenopause or menopause, but your answers do reveal a pattern worth exploring.</p>' +
        '<div class="result-patterns">' +
          '<h4>Your answers touch on:</h4>' +
          patternsHTML +
        '</div>' +
        '<p class="quiz-disclaimer">This is a starting point, not a diagnosis. A thoughtful conversation can help connect your symptoms, health history, and goals.</p>' +
        '<a href="' + GUIDE_PAGE + '" class="btn btn-primary" style="margin-top:8px;">Get my free perimenopause guide</a>';

      quizButton.disabled = true;
      quizResult.hidden = false;

      setTimeout(() => {
        quizResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    });
  }

  // ============================================================
  // BOOKING BUBBLE (optional floating calendar button)
  // Set ENABLE_BOOKING_BUBBLE to false to hide it site-wide.
  // ============================================================
  function initBookingBubble() {
    const ENABLE_BOOKING_BUBBLE = true;
    if (!ENABLE_BOOKING_BUBBLE) return;

    const BOOKING_URL = 'https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_116636';

    // Bubble button
    const btn = document.createElement('button');
    btn.className = 'booking-bubble';
    btn.setAttribute('aria-label', 'Open booking');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
        '<path d="M20 3h-2c0-.6-.4-1-1-1s-1 .4-1 1H8c0-.6-.4-1-1-1s-1 .4-1 1H4c-1.1 0-2 .9-2 2v15c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 17H4V10h16v10zm0-12H4V5h2c0 .6.4 1 1 1s1-.4 1-1h8c0 .6.4 1 1 1s1-.4 1-1h2v3z"/>' +
        '<path d="M7 12h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2H7zm4 0h2v2h-2z"/>' +
      '</svg>';
    document.body.appendChild(btn);

    // Modal
    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.innerHTML =
      '<div class="booking-modal-inner">' +
        '<button class="booking-modal-close" aria-label="Close booking">✕</button>' +
        '<iframe title="Book a visit" src="about:blank"></iframe>' +
      '</div>';
    document.body.appendChild(modal);

    const iframe = modal.querySelector('iframe');
    const closeBtn = modal.querySelector('.booking-modal-close');

    function openBooking() {
      if (!iframe.src || iframe.src === 'about:blank') {
        iframe.src = BOOKING_URL;
      }
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeBooking() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', openBooking);
    closeBtn.addEventListener('click', closeBooking);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeBooking();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeBooking();
    });
  }

  // ============================================================
  // INIT
  // ============================================================
  initHeader();
  initSlider();
  initReveal();
  initParallax();
  initMarquee();
  initQuiz();
  initBookingBubble();
});