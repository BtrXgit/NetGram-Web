// Smooth reveal: easeOutExpo style, once
const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((el) => {
    if (el.isIntersecting) {
      el.target.classList.add('on');
      revealObserver.unobserve(el.target);
    }
  }),
  { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Nav shadow
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

// Animated counters: smooth easeOutExpo
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
      animateCounter(entry.target, parseInt(entry.target.dataset.count, 10), entry.target.dataset.suffix || '');
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));

// Subtle parallax on hero window (desktop only, very gentle)
const heroRight = document.querySelector('.hero-right');
if (heroRight && matchMedia('(pointer:fine)').matches) {
  const win = document.querySelector('.app-window');
  document.querySelector('.hero-section').addEventListener('mousemove', (e) => {
    const r = heroRight.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / r.width;
    const y = (e.clientY - (r.top + r.height / 2)) / r.height;
    if (win) win.style.transform = `perspective(1200px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`;
  });
  document.querySelector('.hero-section').addEventListener('mouseleave', () => {
    if (win) win.style.transform = '';
  });
  if (win) win.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)';
}

// Active nav link: smooth underline via scrollspy
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
  // Click gives instant feedback with smooth underline
  navLinks.forEach((a) => {
    a.addEventListener('click', () => setActiveNav(a.getAttribute('href').slice(1)));
  });
}

function handleDownload(e) {
  e.preventDefault();
  const playStoreUrl = "https://play.google.com/store/apps/details?id=netgram.jasj.crm";
  if (/Android/i.test(navigator.userAgent)) window.location.href = playStoreUrl;
  else window.open(playStoreUrl, "_blank");
}

function openContact(planName) {
  const descEl = document.getElementById('contact-plan-desc');
  const footerEl = document.getElementById('contact-footer-note');
  if (planName) {
    descEl.innerHTML = `You've selected the <strong style="color:var(--ink);">${planName}</strong>. Contact us to complete your purchase and get activated quickly.`;
    footerEl.innerHTML = `Available <strong>Mon-Sat, 9 AM - 7 PM IST</strong>.<br/>Plans activate within minutes of payment confirmation.`;
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
