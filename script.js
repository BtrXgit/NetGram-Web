// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((el) => {
    if (el.isIntersecting) el.target.classList.add('on');
  }),
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));


// ===== NAV SCROLL EFFECT =====
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });


// ===== ANIMATED COUNTERS =====
function animateCounter(el, target, suffix = '') {
  const duration = 1400;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = '1';
      const target = parseInt(entry.target.dataset.count);
      const suffix = entry.target.dataset.suffix || '';
      animateCounter(entry.target, target, suffix);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));


function handleDownload(e) {
  e.preventDefault();

  const playStoreUrl = "https://play.google.com/store/apps/details?id=netgram.jasj.crm";

  if (/Android/i.test(navigator.userAgent)) {
    window.location.href = playStoreUrl;
  } else {
    window.open(playStoreUrl, "_blank");
  }
}


// ===== CONTACT POPUP =====
function openContact(planName) {
  const descEl = document.getElementById('contact-plan-desc');
  const footerEl = document.getElementById('contact-footer-note');

  descEl.innerHTML = `You've selected the <strong style="color:var(--navy);">${planName}</strong>. Contact us to complete your purchase and get activated instantly.`;
  footerEl.innerHTML = `Available <strong>Mon–Sat, 9 AM – 7 PM IST</strong>.<br/>We'll activate your plan within minutes of payment confirmation.`;

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

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeContact();
});