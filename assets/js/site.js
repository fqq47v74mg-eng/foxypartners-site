/* FoxyPartners — site.js */

// Mobile nav toggle
// FIX: the menu rendered expanded on load at mobile widths because nothing set
// `hidden` until the first click. sync() now runs on load and on resize.
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#site-nav');
  if (!toggle || !nav) return;

  const mq = window.matchMedia('(max-width: 1000px)');
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
  const sync = () => { nav.hidden = mq.matches && !isOpen(); };

  toggle.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', String(!isOpen()));
    sync();
  });

  document.addEventListener('click', (e) => {
    if (isOpen() && !toggle.contains(e.target) && !nav.contains(e.target)) {
      toggle.setAttribute('aria-expanded', 'false');
      sync();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      toggle.setAttribute('aria-expanded', 'false'); sync(); toggle.focus();
    }
  });

  nav.addEventListener('click', (e) => {
    if (mq.matches && e.target.closest('a')) {
      toggle.setAttribute('aria-expanded', 'false'); sync();
    }
  });

  mq.addEventListener('change', sync);
  sync();
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

// Animated counter on scroll
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const isDecimal = String(target).includes('.');
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = isDecimal ? (target * ease).toFixed(1) : Math.round(target * ease);
    el.textContent = el.dataset.prefix ? el.dataset.prefix + val : val + (el.dataset.suffix || '');
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('[data-count]').forEach(el => {
      animateCounter(el, parseFloat(el.dataset.count));
    });
    io.unobserve(e.target);
  });
}, { threshold: .3 });
document.querySelectorAll('.stats').forEach(el => io.observe(el));

// Section reveal animations
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: .12 });
document.querySelectorAll('.card, .pillar, .step, .tl-step, .testi').forEach(el => { el.classList.add('reveal'); revealObs.observe(el); });

// Scroll-triggered fade-in (legacy, kept for compatibility)
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

// Apply form submit — Formspree
(function () {
  const form = document.getElementById('apply-form');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = 'Sending…';
    const data = new FormData(form);
    try {
      const res = await fetch('https://formspree.io/f/xwkgpvnq', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.innerHTML = `<div class="card" style="text-align:center;padding:48px 32px"><div style="font-size:56px;margin-bottom:20px">🎉</div><h3 style="margin-bottom:12px">Application received!</h3><p style="color:var(--fg-2);max-width:48ch;margin-inline:auto">Your dedicated AM will be in touch within 24 hours via email or Telegram. For faster response, message us directly at <a href="https://t.me/FoxyPartnersBot">@FoxyPartnersBot</a>.</p></div>`;
      } else {
        const json = await res.json().catch(() => ({}));
        const msg = (json.errors || []).map(x => x.message).join(', ') || 'Submission error';
        btn.disabled = false;
        btn.innerHTML = originalText;
        const err = form.querySelector('.form-error') || (() => {
          const d = document.createElement('p');
          d.className = 'form-error';
          d.style.cssText = 'color:#f66;font-size:14px;margin-top:-8px;font-family:var(--mono)';
          form.insertBefore(d, btn.parentElement);
          return d;
        })();
        err.textContent = '⚠️ ' + msg + ' — please try again or contact us on Telegram.';
      }
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = originalText;
      const errEl = form.querySelector('.form-error') || (() => {
        const d = document.createElement('p');
        d.className = 'form-error';
        d.style.cssText = 'color:#f66;font-size:14px;margin-top:-8px;font-family:var(--mono)';
        form.insertBefore(d, btn.parentElement);
        return d;
      })();
      errEl.textContent = '⚠️ Network error. Please try again or reach us on Telegram.';
    }
  });
})();

// Smooth scroll for anchor links
(function () {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

// Back to top button
(function () {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
  document.body.appendChild(btn);
  const toggle = () => btn.classList.toggle('visible', window.scrollY > 400);
  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();
