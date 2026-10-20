/* About photo slider (wipe transition), partner logo marquee, approach image swap. */
window.LIUTE.initSliders = function () {
  const { qs, qsa, reduced } = window.LIUTE;
  // --- About slider ---
  const sl = qs('.slider');
  if (sl) {
    const slides = qsa('.s', sl), bar = qs('.sl-bar', sl), cnt = qs('.sl-count b', sl); let i = 0, t = 0, down = 0;
    const show = (n) => {
      const nx = (n + slides.length) % slides.length; if (nx === i) return;
      const old = slides[i]; slides.forEach(s => s.classList.remove('prev')); old.classList.remove('on'); old.classList.add('prev');
      slides[nx].classList.add('on'); i = nx; cnt.textContent = String(i + 1).padStart(2, '0');
      setTimeout(() => old.classList.remove('prev'), 1250); run();
    };
    const run = () => { clearTimeout(t); bar.classList.remove('run'); void bar.offsetWidth; if (!reduced) { bar.classList.add('run'); t = setTimeout(() => show(i + 1), 5500); } };
    qsa('.sl-b', sl).forEach(b => b.addEventListener('click', () => show(i + +b.dataset.dir)));
    sl.addEventListener('pointerdown', e => (down = e.clientX)); sl.addEventListener('pointerup', e => { const d = e.clientX - down; if (down && Math.abs(d) > 50) show(i + (d < 0 ? 1 : -1)); down = 0; });
    sl.addEventListener('mouseenter', () => { clearTimeout(t); bar.classList.remove('run'); }); sl.addEventListener('mouseleave', run);
    sl.addEventListener('keydown', e => { if (e.key === 'ArrowRight') show(i + 1); if (e.key === 'ArrowLeft') show(i - 1); });
    slides[0].classList.add('on'); run();
  }
  // --- Partner marquee: repeat the logos so each half is wider than the viewport, then duplicate for a seamless loop ---
  const list = qs('.ptn-list');
  if (list && !reduced) {
    const base = [...list.children], run = list.parentElement;
    const group = base.length * ((window.innerWidth < 900 ? 200 : Math.min(270, Math.max(200, innerWidth * .2))) + 20);
    const reps = Math.max(1, Math.ceil(innerWidth / group) + 1);
    for (let r = 1; r < reps; r++) base.forEach(li => list.append(li.cloneNode(true)));
    const copy = list.cloneNode(true); copy.setAttribute('aria-hidden', 'true'); copy.querySelectorAll('img').forEach(im => (im.alt = '', im.loading = 'eager')); run.append(copy);
  }
  // --- Approach: image follows the active statement ---
  const items = qsa('.ai'), media = qsa('.am');
  if (items.length) {
    const set = (k) => { items.forEach((x, j) => x.classList.toggle('on', j === k)); media.forEach((m, j) => m.classList.toggle('on', j === k)); };
    items.forEach((it, k) => { it.addEventListener('mouseenter', () => set(k)); it.addEventListener('focus', () => set(k)); });
    if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) set(items.indexOf(e.target)); }), { rootMargin: '-42% 0px -42% 0px' }); items.forEach(it => io.observe(it)); }
  }
};
