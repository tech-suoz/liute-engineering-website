/* Lightweight viewport-triggered reveals + hero line drawing (CSS does the work). */
window.LIUTE.initAnimations = function () {
  const { qsa, reduced } = window.LIUTE;
  const els = qsa('[data-reveal],[data-mask]');
  if (reduced || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  els.forEach(e => { if (e.hasAttribute('data-mask')) { // clip-path hides the element from IntersectionObserver, so watch its parent instead
    const par = e.parentElement; new IntersectionObserver((es, o) => es.forEach(x => { if (x.isIntersecting) { e.classList.add('in'); o.disconnect(); } }), { rootMargin: '0px 0px -8% 0px' }).observe(par); } else io.observe(e); });
  qsa('.draw').forEach(p => { const l = Math.ceil(p.getTotalLength ? p.getTotalLength() : 1200); p.style.setProperty('--len', l); p.classList.add('line-draw'); });
};
