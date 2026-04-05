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


// ===== DOWNLOAD HANDLER =====
function handleDownload(e) {
  e.preventDefault();

  const overlay = document.getElementById('dl-overlay');
  const fill = document.getElementById('dl-fill');
  const pct = document.getElementById('dl-percent');

  overlay.classList.add('show');
  let progress = 0;
  fill.style.width = '0%';
  pct.textContent = '0%';

  const interval = setInterval(() => {
    const step =
      progress < 60 ? Math.random() * 8 + 4 :
      progress < 85 ? Math.random() * 3 + 1 :
      Math.random() * 0.8;

    progress = Math.min(progress + step, 92);
    fill.style.width = progress + '%';
    pct.textContent = Math.round(progress) + '%';
  }, 200);

  // Trigger actual download
  setTimeout(() => {
    window.location.href =
      'https://www.dropbox.com/scl/fi/7ml7fbnoaf9d2o9ev9n7d/Relynk.apk?rlkey=hq09wyb2pnu11zinb5wm8en48&st=7527fc93&dl=1';
  }, 800);

  // Complete progress bar
  setTimeout(() => {
    clearInterval(interval);
    fill.style.width = '100%';
    pct.textContent = '100%';
    setTimeout(() => overlay.classList.remove('show'), 900);
  }, 3200);
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