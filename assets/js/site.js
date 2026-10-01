/* FoxyPartners — site.js */

// Mobile nav toggle
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.hidden = expanded;
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!nav.hidden && !toggle.contains(e.target) && !nav.contains(e.target)) {
      toggle.setAttribute('aria-expanded', 'false');
      nav.hidden = true;
    }
  });
})();

// Current-page nav highlight
(function () {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.setAttribute('aria-current', 'page');
    }
  });
})();

// Dynamic year
document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// Ticker animation — subtle pulsing numbers
(function () {
  const metrics = document.querySelectorAll('[data-metric]');
  if (!metrics.length) return;
  metrics.forEach(el => {
    const base = parseInt(el.dataset.metric, 10);
    setInterval(() => {
      const delta = (Math.random() - 0.3) * base * 0.03;
      const newVal = Math.max(base * 0.8, Math.round(base + delta));
      const prefix = el.dataset.prefix ? '$' : '';
      el.textContent = prefix + newVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }, 3400 + Math.random() * 2000);
  });
})();

// Scroll-triggered fade-in
(function () {
  if (!window.IntersectionObserver) return;
  const els = document.querySelectorAll('.card, .pillar, .step, .stat__n');
  const style = document.createElement('style');
  style.textContent = `
    .js-fade { opacity: 0; transform: translateY(18px); transition: opacity .5s ease, transform .5s ease; }
    .js-fade.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);
  els.forEach((el, i) => {
    el.classList.add('js-fade');
    el.style.transitionDelay = (i % 3) * 80 + 'ms';
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();

// Apply form submit (dummy)
(function () {
  const form = document.getElementById('apply-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    setTimeout(() => {
      form.innerHTML = `<div class="card" style="text-align:center;padding:40px"><div style="font-size:48px;margin-bottom:16px">🎉</div><h3>Application received!</h3><p style="margin-top:12px;color:var(--fg-2)">Your dedicated affiliate manager will be in touch within 24 hours. You can also reach us on Telegram: <a href="https://t.me/FoxyPartnersBot">@FoxyPartnersBot</a></p></div>`;
    }, 1200);
  });
})();
