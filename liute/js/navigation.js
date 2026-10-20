/* Mega menu (hover + click + keyboard), mobile drawer, solid header on scroll. */
window.LIUTE.initNavigation = function () {
  const { qs, qsa } = window.LIUTE;
  const header = qs('.site-header');
  const onScroll = () => header.classList.toggle('solid', scrollY > 24 || header.dataset.solid === '1');
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const triggers = qsa('.nav-link[aria-controls]');
  let timer;
  const closeAll = (except) => triggers.forEach(t => {
    if (t === except) return;
    t.setAttribute('aria-expanded', 'false'); qs('#' + t.getAttribute('aria-controls')).classList.remove('open');
  });
  const open = (t) => { clearTimeout(timer); closeAll(t); t.setAttribute('aria-expanded', 'true'); qs('#' + t.getAttribute('aria-controls')).classList.add('open'); };
  triggers.forEach(t => {
    const item = t.closest('.nav-item');
    t.addEventListener('click', () => (t.getAttribute('aria-expanded') === 'true' ? closeAll() : open(t)));
    if (window.LIUTE.fine) {
      item.addEventListener('mouseenter', () => open(t));
      item.addEventListener('mouseleave', () => { timer = setTimeout(() => closeAll(), 140); });
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeAll(); closeMobile(); } });
  document.addEventListener('click', e => { if (!e.target.closest('.nav-item')) closeAll(); });
  // Mobile drawer
  const burger = qs('.burger'), m = qs('#mnav');
  function closeMobile() { if (!m) return; m.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); burger.textContent = 'MENU'; document.body.style.overflow = ''; }
  burger && burger.addEventListener('click', () => {
    const o = m.classList.toggle('open');
    burger.setAttribute('aria-expanded', o); burger.textContent = o ? 'CLOSE' : 'MENU'; document.body.style.overflow = o ? 'hidden' : '';
  });
};
