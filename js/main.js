/* ============================================================
   PASTA — Main JavaScript
   ============================================================ */

'use strict';

/* ─── Navbar ─────────────────────────────────────────────────── */
(function initNav() {
  const navbar   = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const drawer   = document.querySelector('.nav-drawer');
  const overlay  = document.querySelector('.nav-overlay');
  const closeBtn = document.querySelector('.nav-drawer-close');

  // Scrolled class
  function checkNavbarScroll() {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateProgressBar();
    toggleBackToTop();
  }
  window.addEventListener('scroll', checkNavbarScroll, { passive: true });
  checkNavbarScroll();

  // Active link highlight
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage) {
      a.classList.add('active');
      const dropdownParent = a.closest('.nav-item-dropdown');
      if (dropdownParent) {
        dropdownParent.querySelector('.dropdown-trigger')?.classList.add('active');
      }
    }
  });

  // Hamburger / Drawer
  if (hamburger && drawer && overlay) {
    function openDrawer() {
      hamburger.classList.add('active');
      drawer.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
      hamburger.classList.remove('active');
      drawer.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    hamburger.addEventListener('click', openDrawer);
    overlay.addEventListener('click', closeDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
  }
})();

/* ─── Progress Bar ──────────────────────────────────────────── */
function updateProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const docH  = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  bar.style.width = (scrollTop / docH * 100).toFixed(1) + '%';
}

/* ─── Back to Top ────────────────────────────────────────────── */
function toggleBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.classList.toggle('visible', window.scrollY > 400);
}
document.getElementById('back-to-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── Scroll Animations (AOS-lite) ─────────────────────────── */
(function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = e.target.dataset.aosDelay || 0;
        setTimeout(() => e.target.classList.add('aos-animate'), +delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => obs.observe(el));
})();

/* ─── FAQ Accordion ──────────────────────────────────────────── */
(function initAccordion() {
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const isOpen  = btn.classList.contains('active');

      // Close all
      document.querySelectorAll('.accordion-btn').forEach(b => {
        b.classList.remove('active');
        b.nextElementSibling?.classList.remove('open');
      });

      // Open clicked if was closed
      if (!isOpen) {
        btn.classList.add('active');
        content?.classList.add('open');
      }
    });
  });
})();

/* ─── Product Filter ─────────────────────────────────────────── */
(function initFilter() {
  const tabs  = document.querySelectorAll('.filter-tab');
  const items = document.querySelectorAll('[data-category]');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.filter;
      items.forEach(item => {
        const show = cat === 'all' || item.dataset.category === cat;
        item.style.display = show ? '' : 'none';
        if (show) {
          item.style.animation = 'fadeInItem .35s ease forwards';
        }
      });
    });
  });
})();

/* ─── Form Validation Helper ─────────────────────────────────── */
function validateForm(form) {
  let valid = true;

  // Clear previous errors
  form.querySelectorAll('.field-error').forEach(e => e.remove());
  form.querySelectorAll('.form-control').forEach(c => c.classList.remove('error'));

  form.querySelectorAll('[required]').forEach(field => {
    const val = field.value.trim();
    let error = '';

    if (!val) {
      error = 'This field is required.';
    } else if (field.type === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) error = 'Please enter a valid email address.';
    } else if (field.type === 'tel') {
      if (!/^[\d\s\+\-\(\)]{7,15}$/.test(val)) error = 'Please enter a valid phone number.';
    }

    if (error) {
      valid = false;
      field.classList.add('error');
      const span = document.createElement('span');
      span.className = 'field-error';
      span.textContent = error;
      field.parentElement.appendChild(span);
    }
  });

  return valid;
}

/* ─── Enquiry / Contact Forms ────────────────────────────────── */
document.querySelectorAll('.enquiry-form, .contact-form, .wholesale-form').forEach(form => {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateForm(this)) return;

    const msg = this.querySelector('.form-msg');
    if (msg) {
      msg.className = 'form-msg success';
      msg.innerHTML = '<i>✔</i> Thank you! Your enquiry has been received. We\'ll be in touch within 1–2 business days. (Demo mode — no data was submitted to a server.)';
    }
    this.reset();
    setTimeout(() => { if (msg) msg.className = 'form-msg'; }, 8000);
  });
});

/* ─── Newsletter Form ────────────────────────────────────────── */
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const emailInput = this.querySelector('[type="email"]');
    const msg = this.querySelector('.form-msg');
    const val = emailInput?.value.trim();

    if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      if (msg) {
        msg.className = 'form-msg error';
        msg.innerHTML = '<i>✕</i> Please enter a valid email address.';
      }
      emailInput?.classList.add('error');
      return;
    }

    if (msg) {
      msg.className = 'form-msg success';
      msg.innerHTML = '<i>✔</i> You\'re subscribed! Thank you for joining our pasta community. (Demo mode — no data was submitted to a server.)';
    }
    this.reset();
    setTimeout(() => { if (msg) msg.className = 'form-msg'; }, 8000);
  });
});

/* ─── Smooth Scroll for anchor links ───────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── Hero Parallax (subtle) ─────────────────────────────────── */
(function initParallax() {
  const heroImg = document.querySelector('.hero-parallax');
  if (!heroImg) return;
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.3;
    heroImg.style.transform = `translateY(${offset}px)`;
  }, { passive: true });
})();

/* ─── Counter Animation ──────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.round(current) + (el.dataset.suffix || '');
        if (current >= target) clearInterval(timer);
      }, 16);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
})();

/* ─── Add CSS keyframe for filter animation ─────────────────── */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInItem {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

/* ─── Theme & RTL Layout Toggles ───────────────────────────── */
(function initThemeAndRTL() {
  const THEME_KEY = 'pasta_theme';
  const DIR_KEY   = 'pasta_dir';

  function getSavedTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }

  function getSavedDir() {
    return localStorage.getItem(DIR_KEY) || 'ltr';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    const isDark = theme === 'dark';

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }
      const text = btn.querySelector('.theme-text');
      if (text) {
        text.textContent = isDark ? 'Light Mode' : 'Dark Mode';
      }
    });
  }

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
    localStorage.setItem(DIR_KEY, dir);
    const isRTL = dir === 'rtl';

    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      btn.setAttribute('aria-label', isRTL ? 'Switch to LTR' : 'Switch to RTL');
      btn.setAttribute('title', isRTL ? 'Switch to LTR' : 'Switch to RTL');
      const label = btn.querySelector('.rtl-label');
      if (label) {
        label.textContent = isRTL ? 'LTR' : 'RTL';
      }
      const text = btn.querySelector('.rtl-text');
      if (text) {
        text.textContent = isRTL ? 'Left-to-Right' : 'Right-to-Left';
      }
    });
  }

  // Initial sync
  applyTheme(getSavedTheme());
  applyDir(getSavedDir());

  // Click delegation
  document.addEventListener('click', (e) => {
    const themeBtn = e.target.closest('.theme-toggle-btn');
    if (themeBtn) {
      e.preventDefault();
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    }

    const rtlBtn = e.target.closest('.rtl-toggle-btn');
    if (rtlBtn) {
      e.preventDefault();
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      applyDir(current === 'rtl' ? 'ltr' : 'rtl');
    }
  });
})();
