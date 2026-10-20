/* Entry point: shared helpers + bootstraps. Each module registers itself on window.LIUTE. */
window.LIUTE = window.LIUTE || {};
(() => {
  const L = window.LIUTE;
  L.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  L.saveData = !!(navigator.connection && navigator.connection.saveData);
  L.fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  L.qs = (s, r = document) => r.querySelector(s);
  L.qsa = (s, r = document) => [...r.querySelectorAll(s)];
  if (!L.reduced) document.documentElement.classList.add('js');
  // Populate any element that needs live config values (static fallbacks already in HTML).
  const c = L.config;
  if (c) L.qsa('[data-cfg="year"]').forEach(e => (e.textContent = new Date().getFullYear()));
  // Hero background video: only loads when a source is configured, motion allowed and data saver off.
  const v = L.qs('[data-hero-video]');
  if (v && c && c.heroVideo && !L.reduced && !L.saveData) {
    v.src = c.heroVideo; v.muted = true; v.loop = true; v.playsInline = true;
    v.addEventListener('canplay', () => { v.classList.add('ready'); v.play().catch(() => {}); }, { once: true });
    v.addEventListener('error', () => v.remove());
  } else if (v) v.remove();
  ['initNavigation', 'initAnimations', 'initScrollEffects', 'initInteractions', 'initHero', 'initSliders', 'initHome', 'initHomeFx', 'initGallery', 'initForms'].forEach(fn => {
    try { L[fn] && L[fn](); } catch (e) { console.error('LIUTE', fn, e); }
  });
})();
