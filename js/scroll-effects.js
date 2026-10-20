/* GSAP + ScrollTrigger: parallax and the scroll-linked engineering process. Falls back to IntersectionObserver. */
window.LIUTE.initScrollEffects = function () {
  const { qs, qsa, reduced } = window.LIUTE;
  const steps = qsa('.pstep'), imgs = qsa('.proc-visual img'), bar = qs('.proc-bar');
  const setStep = (i) => { steps.forEach((s, k) => s.classList.toggle('on', k <= i)); imgs.forEach((im, k) => im.classList.toggle('on', k === Math.min(i, imgs.length - 1))); };
  if (!steps.length && !qsa('[data-parallax]').length) return;
  if (reduced || !window.gsap || !window.ScrollTrigger) { // static fallback
    steps.forEach(s => s.classList.add('on')); imgs[0] && imgs[0].classList.add('on'); return;
  }
  gsap.registerPlugin(ScrollTrigger);
  qsa('[data-parallax]').forEach(el => gsap.fromTo(el, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
  if (steps.length) {
    steps.forEach((s, i) => ScrollTrigger.create({ trigger: s, start: 'top 60%', onEnter: () => setStep(i), onEnterBack: () => setStep(i), onLeaveBack: () => setStep(i - 1) }));
    if (bar) gsap.to(bar, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.proc-steps', start: 'top 60%', end: 'bottom 70%', scrub: true } });
    setStep(-1); imgs[0] && imgs[0].classList.add('on');
  }
  addEventListener('load', () => ScrollTrigger.refresh());
};
