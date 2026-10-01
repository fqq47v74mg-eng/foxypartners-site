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

// Ticker animation — live nudge with directional colour flash
(function () {
  const metrics = document.querySelectorAll('[data-metric]');
  if (!metrics.length) return;
  metrics.forEach(el => {
    let current = parseInt(el.dataset.metric, 10);
    const base = current;
    const update = () => {
      const delta = (Math.random() - 0.38) * base * 0.04;
      const going_up = delta > 0;
      current = Math.max(base * 0.75, current + delta);
      const prefix = el.dataset.prefix ? '$' : '';
      el.textContent = prefix + current.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      el.classList.remove('ticker-flash-up', 'ticker-flash-down');
      void el.offsetWidth; // reflow to restart animation
      el.classList.add(going_up ? 'ticker-flash-up' : 'ticker-flash-down');
      setTimeout(update, 4000 + Math.random() * 1200);
    };
    setTimeout(update, 2000 + Math.random() * 3000);
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
