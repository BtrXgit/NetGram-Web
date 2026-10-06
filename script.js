/* ─── Reveal Observer: handles .reveal, .reveal-left, .reveal-right, .reveal-scale ─── */
const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((el) => {
    if (el.isIntersecting) {
      el.target.classList.add('on');
      revealObserver.unobserve(el.target);
    }
  }),
  { threshold: 0.07, rootMargin: '0px 0px -28px 0px' }
);
document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
  .forEach((el) => revealObserver.observe(el));

/* ─── Stagger child cards inside .fg (feature grid) ─── */
document.querySelectorAll('.fg').forEach((grid) => {
  const cards = grid.querySelectorAll('.fc');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
  });
});

/* ─── Pricing tier-fill bars: animate width when visible ─── */
const tierFillObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Force a reflow so CSS transition fires
      entry.target.style.width = '0%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          entry.target.style.removeProperty('width');
        });
      });
      tierFillObserver.unobserve(entry.target);
    }
  }),
  { threshold: 0.5 }
);
document.querySelectorAll('.ptier-fill').forEach((el) => {
  // Keep the width at 0 initially; CSS defines the target width via class
  el.style.width = '0%';
  tierFillObserver.observe(el);
});

/* ─── Nav: shadow + background on scroll ─── */
const nav = document.getElementById('nav');
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      nav.classList.toggle('scrolled', window.scrollY > 24);
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/* ─── Animated counters: smooth easeOutExpo ─── */
function animateCounter(el, target, suffix = '') {
  const duration = 1600;
  const start = performance.now();
  function update(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
    el.textContent = Math.round(target * eased).toLocaleString('en-IN') + suffix;
    if (p < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = '1';
      animateCounter(
        entry.target,
        parseInt(entry.target.dataset.count, 10),
        entry.target.dataset.suffix || ''
      );
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));

/* ─── Parallax tilt on hero window (desktop only) ─── */
const heroRight = document.querySelector('.hero-right');
if (heroRight && matchMedia('(pointer:fine)').matches) {
  const win = document.querySelector('.app-window');
  const heroSection = document.querySelector('.hero-section');
  if (win) win.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)';
  heroSection && heroSection.addEventListener('mousemove', (e) => {
    const r = heroRight.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / r.width;
    const y = (e.clientY - (r.top + r.height / 2)) / r.height;
    if (win) win.style.transform = `perspective(1200px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`;
  });
  heroSection && heroSection.addEventListener('mouseleave', () => {
    if (win) win.style.transform = '';
  });
}

/* ─── Mini-card entrance stagger on hover of hero-right ─── */
const miniCards = document.querySelectorAll('.mini-card');
miniCards.forEach((card, i) => {
  card.style.animationDelay = `${0.3 + i * 0.15}s`;
});

/* ─── Scrollspy: active nav link ─── */
const navLinks = document.querySelectorAll('.nav-links a');
const spySections = ['features', 'olt', 'customers', 'pricing']
  .map((id) => document.getElementById(id))
  .filter(Boolean);
function setActiveNav(id) {
  navLinks.forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
  });
}
if (spySections.length && navLinks.length) {
  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveNav(entry.target.id);
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );
  spySections.forEach((s) => spyObserver.observe(s));
  navLinks.forEach((a) => {
    a.addEventListener('click', () => setActiveNav(a.getAttribute('href').slice(1)));
  });
}

/* ─── Pricing card hover: subtle inner glow ─── */
document.querySelectorAll('.pc:not(.best)').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, #f8f8ff 0%, #ffffff 55%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

/* ─── OLT dots: stagger on hover ─── */
const oltDots = document.querySelector('.olt-dots');
if (oltDots) {
  const dotsArr = Array.from(oltDots.querySelectorAll('i'));
  oltDots.addEventListener('mouseenter', () => {
    dotsArr.forEach((dot, i) => {
      setTimeout(() => {
        dot.style.transform = 'scaleY(1.4)';
        setTimeout(() => { dot.style.transform = ''; }, 200);
      }, i * 30);
    });
  });
}

/* ─── Download handler ─── */
function handleDownload(e) {
  e.preventDefault();
  const playStoreUrl = "https://play.google.com/store/apps/details?id=netgram.jasj.crm";
  if (/Android/i.test(navigator.userAgent)) window.location.href = playStoreUrl;
  else window.open(playStoreUrl, "_blank");
}

/* ─── Contact modal ─── */
function openContact(planName) {
  const descEl = document.getElementById('contact-plan-desc');
  const footerEl = document.getElementById('contact-footer-note');
  if (planName && planName !== 'Support') {
    descEl.innerHTML = `You've selected the <strong style="color:var(--ink);">${planName}</strong>. Contact us to complete your purchase and get activated quickly.`;
    footerEl.innerHTML = `Available <strong>Mon-Sat, 9 AM - 7 PM IST</strong>.<br/>Plans activate within minutes of payment confirmation.`;
  } else {
    descEl.innerHTML = `Interested in Relynk? Reach out and we'll get you activated right away.`;
    footerEl.innerHTML = `Available <strong>Mon-Sat, 9 AM - 7 PM IST</strong>.<br/>We respond within a few hours.`;
  }
  document.getElementById('contact-overlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeContact() {
  document.getElementById('contact-overlay').classList.remove('show');
  document.body.style.overflow = '';
}
function closeContactIfBg(e) {
  if (e.target === document.getElementById('contact-overlay')) closeContact();
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeContact(); });
