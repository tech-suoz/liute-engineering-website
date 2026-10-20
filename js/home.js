/* Homepage only: cursor-following service preview, pinned horizontal field-work track, process line. */
window.LIUTE.initHome = function () {
  const { qs, qsa, fine, reduced } = window.LIUTE;
  // Service rows: floating preview follows the pointer (desktop only)
  const fl = qs('.sv-float');
  if (fl && fine && !reduced) {
    const imgs = qsa('img', fl); let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const tick = () => { x += (tx - x) * .16; y += (ty - y) * .16; fl.style.transform = `translate(${x}px,${y}px) rotate(${(tx - x) * .02}deg)`; raf = Math.abs(tx - x) + Math.abs(ty - y) > .2 ? requestAnimationFrame(tick) : 0; };
    qsa('.sv a').forEach((a, i) => {
      a.addEventListener('mouseenter', () => { imgs.forEach((m, k) => m.classList.toggle('on', k === i)); fl.classList.add('on'); });
      a.addEventListener('mouseleave', () => fl.classList.remove('on'));
      a.addEventListener('mousemove', e => { tx = e.clientX + 28; ty = e.clientY - 150; if (!raf) raf = requestAnimationFrame(tick); });
    });
  }
  // Pinned horizontal track (desktop, GSAP available). Otherwise it is a native swipe row.
  const track = qs('.hw-track');
  if (track && window.gsap && window.ScrollTrigger && !reduced && matchMedia('(min-width:901px)').matches) {
    gsap.registerPlugin(ScrollTrigger);
    const dist = () => track.scrollWidth - innerWidth;
    gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.hw', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: .8, invalidateOnRefresh: true, anticipatePin: 1 } });
  }
  // Process line fills when it scrolls into view
  const pr = qs('.pr');
  if (pr) new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { pr.style.setProperty('--p', 1); o.disconnect(); } }), { threshold: .4 }).observe(pr);
};
/* Homepage extras: split-letter headings, scroll-filled statement, 3D tilt. */
window.LIUTE.initHomeFx = function () {
  const { qs, qsa, reduced, fine } = window.LIUTE;
  // Split section headings into words/letters; the heading keeps an aria-label for screen readers
  qsa('.h2x').forEach(h => {
    h.removeAttribute('data-reveal'); const t = h.textContent.trim(); h.setAttribute('aria-label', t); let k = 0;
    h.innerHTML = t.split(' ').map(w => `<span class="w" aria-hidden="true">${[...w].map(c => `<span class="ch" style="--k:${k++}">${c}</span>`).join('')}</span>`).join(' ');
    h.classList.add('split-ready');
    if (reduced || !('IntersectionObserver' in window)) return h.classList.add('in');
    new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { h.classList.add('in'); o.disconnect(); } }), { threshold: .3 }).observe(h);
  });
  // Statement: words light up as the pinned section scrolls
  const f = qs('[data-fill]');
  if (f) {
    const words = f.textContent.trim().split(/\s+/); f.setAttribute('aria-label', f.textContent.trim());
    f.innerHTML = words.map((w, i) => `<span aria-hidden="true"${/^(critical|assets\.|plan,|install,|test)/i.test(w) ? ' data-hot' : ''}>${w}</span>`).join(' ');
    const sp = qsa('span', f), sec = qs('#statement'); let tick = 0;
    const upd = () => { tick = 0; const r = sec.getBoundingClientRect(), p = Math.max(0, Math.min(1, -r.top / (r.height - innerHeight))); const n = Math.round(p * 1.15 * sp.length); sp.forEach((s, i) => { s.classList.toggle('on', i < n); s.classList.toggle('hot', i < n && s.hasAttribute('data-hot')); }); };
    if (reduced) sp.forEach(s => s.classList.add('on')); else { addEventListener('scroll', () => { if (!tick) tick = requestAnimationFrame(upd); }, { passive: true }); upd(); }
  }
  // 3D tilt on grid tiles (desktop only)
  if (fine && !reduced) qsa('.bt a,.in4 a').forEach(a => {
    a.addEventListener('pointermove', e => { const r = a.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; a.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateZ(0)`; });
    a.addEventListener('pointerleave', () => (a.style.transform = ''));
  });
};
