/* Hero: crossfading backgrounds, scrambling headline word, circuit-trace canvas, pointer spotlight. */
window.LIUTE.initHero = function () {
  const { qs, qsa, reduced, fine } = window.LIUTE;
  const hx = qs('#hero'); if (!hx) return;
  const slides = qsa('.sl', hx), segs = qsa('.seg', hx), rot = qs('#rot'), words = JSON.parse(hx.dataset.words);
  // intro: split "We engineer" into letters
  const l1 = qs('.l1', hx); if (l1) { l1.innerHTML = [...l1.textContent].map((c, k) => `<b style="--k:${k}">${c === ' ' ? '&nbsp;' : c}</b>`).join(''); }
  const CH = 'ABCDEFGHJKLMNOPRSTUVWXYZ0123456789#%/<>';
  let scr = 0;
  const scramble = (text) => {
    if (reduced) { rot.textContent = text; return; }
    cancelAnimationFrame(scr); let f = 0; const total = 30;
    const tick = () => {
      f++; let out = '';
      for (let k = 0; k < text.length; k++) out += (text[k] === ' ' || k < (f / total) * text.length * 1.2) ? text[k] : CH[(Math.random() * CH.length) | 0];
      rot.textContent = out; if (f < total + 8) scr = requestAnimationFrame(tick); else rot.textContent = text;
    };
    tick();
  };
  let i = 0, timer = 0;
  const go = (n, first) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => { s.classList.toggle('on', k === i); });
    segs.forEach((s, k) => { s.classList.remove('on'); if (k === i) { void s.offsetWidth; s.classList.add('on'); } });
    if (!first) scramble(words[i % words.length]);
  };
  const start = () => { stop(); if (!reduced) timer = setInterval(() => go(i + 1), 6000); };
  const stop = () => clearInterval(timer);
  segs.forEach((s, k) => s.addEventListener('click', () => { go(k); start(); }));
  go(0, true); start();
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  // pointer spotlight
  if (fine && !reduced) hx.addEventListener('pointermove', e => { const r = hx.getBoundingClientRect(); hx.style.setProperty('--mx', e.clientX - r.left + 'px'); hx.style.setProperty('--my', e.clientY - r.top + 'px'); }, { passive: true });
  if (reduced) return;
  // circuit-trace canvas: faint Manhattan traces with travelling pulses; paused when off-screen
  const cv = qs('.hx-canvas', hx), ctx = cv.getContext('2d'); let W, H, paths = [], raf = 0, last = 0, on = true, dpr = 1;
  const build = () => {
    dpr = Math.min(devicePixelRatio || 1, 1.5); W = cv.width = hx.clientWidth * dpr; H = cv.height = hx.clientHeight * dpr;
    const step = Math.round(84 * dpr), n = W < 800 ? 7 : 15; paths = [];
    for (let p = 0; p < n; p++) {
      let x = ((Math.random() * W / step) | 0) * step, y = ((Math.random() * H / step) | 0) * step, horiz = Math.random() < .5; const pts = [[x, y]];
      for (let s = 0; s < 6; s++) { const len = (((Math.random() * 5) | 0) + 2) * step * (Math.random() < .5 ? -1 : 1); if (horiz) x = Math.max(0, Math.min(W, x + len)); else y = Math.max(0, Math.min(H, y + len)); pts.push([x, y]); horiz = !horiz; }
      const seg = []; let L = 0; for (let k = 1; k < pts.length; k++) { const d = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); seg.push(d); L += d; }
      if (L > 0) paths.push({ pts, seg, L, t: Math.random() * L, sp: (70 + Math.random() * 110) * dpr });
    }
  };
  const at = (p, t) => { let d = t; for (let k = 0; k < p.seg.length; k++) { if (d <= p.seg[k]) { const a = p.pts[k], b = p.pts[k + 1], r = p.seg[k] ? d / p.seg[k] : 0; return [a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r]; } d -= p.seg[k]; } return p.pts[p.pts.length - 1]; };
  const frame = (ts) => {
    const dt = Math.min((ts - last) / 1000 || .016, .05); last = ts; ctx.clearRect(0, 0, W, H); ctx.lineWidth = dpr;
    for (const p of paths) {
      ctx.strokeStyle = 'rgba(110,170,255,.16)'; ctx.beginPath(); p.pts.forEach((q, k) => (k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke();
      ctx.fillStyle = 'rgba(110,170,255,.35)'; p.pts.forEach(q => ctx.fillRect(q[0] - 2 * dpr, q[1] - 2 * dpr, 4 * dpr, 4 * dpr));
      p.t += p.sp * dt; if (p.t > p.L) p.t = 0;
      for (let k = 0; k < 6; k++) { const q = at(p, Math.max(0, p.t - k * 9 * dpr)); ctx.fillStyle = `rgba(150,205,255,${.9 - k * .15})`; ctx.beginPath(); ctx.arc(q[0], q[1], (3.2 - k * .3) * dpr, 0, 6.283); ctx.fill(); }
    }
    raf = on ? requestAnimationFrame(frame) : 0;
  };
  build(); raf = requestAnimationFrame(frame);
  new IntersectionObserver(es => { on = es[0].isIntersecting; if (on && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }).observe(hx);
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 200); });
};
