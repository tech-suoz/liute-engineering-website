/* Hero: crossfading backgrounds + every word on the slide changes with them (kicker, headline, paragraph). */
window.LIUTE.initHero = function () {
  const { qs, qsa, reduced, fine } = window.LIUTE;
  const hx = qs('#hero'); if (!hx) return;
  const data = JSON.parse(hx.dataset.slides), slides = qsa('.sl', hx), segs = qsa('.seg', hx);
  const K = qs('#hxK'), H = qs('#hxH'), Pp = qs('#hxP'), N = qs('#hxN');
  const CH = 'ABCDEFGHJKLMNOPRSTUVWXYZ0123456789';
  let scr = 0;
  const scramble = (el, text) => {
    if (reduced) { el.textContent = text; return; }
    cancelAnimationFrame(scr); let f = 0; const total = 26;
    const tick = () => { f++; let o = ''; for (let k = 0; k < text.length; k++) o += (text[k] === ' ' || k < (f / total) * text.length * 1.2) ? text[k] : CH[(Math.random() * CH.length) | 0]; el.textContent = o; if (f < total + 6) scr = requestAnimationFrame(tick); else el.textContent = text; };
    tick();
  };
  const letters = (el, text) => { let k = 0; el.innerHTML = text.split(' ').map(w => `<span class="w">${[...w].map(c => `<span class="c" style="--k:${k++}">${c}</span>`).join('')}</span>`).join(' '); el.setAttribute('aria-label', text); };
  let i = 0, timer = 0, busy = false;
  const go = (n, first) => {
    const nx = (n + data.length) % data.length; if (busy && !first) return;
    const apply = () => {
      i = nx; const d = data[i];
      slides.forEach((s, k) => s.classList.toggle('on', k === i));
      segs.forEach((s, k) => { s.classList.remove('on'); if (k === i) { void s.offsetWidth; s.classList.add('on'); } });
      if (N) N.textContent = '0' + (i + 1);
      scramble(K, d.k); letters(H, d.h); H.classList.remove('out');
      Pp.textContent = d.p; Pp.classList.remove('swap');
    };
    if (first || reduced) { apply(); return; }
    busy = true; H.classList.add('out'); Pp.classList.add('swap');
    setTimeout(() => { apply(); busy = false; }, 520);
  };
  const stop = () => clearInterval(timer);
  const start = () => { stop(); if (!reduced) timer = setInterval(() => go(i + 1), 7000); };
  segs.forEach((s, k) => s.addEventListener('click', () => { go(k); start(); }));
  go(0, true); start();
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  if (fine && !reduced) hx.addEventListener('pointermove', e => { const r = hx.getBoundingClientRect(); hx.style.setProperty('--mx', e.clientX - r.left + 'px'); hx.style.setProperty('--my', e.clientY - r.top + 'px'); }, { passive: true });
  if (reduced) return;
  // faint circuit traces with travelling pulses (paused off-screen)
  const cv = qs('.hx-canvas', hx), ctx = cv.getContext('2d'); let W, H2, paths = [], raf = 0, last = 0, on = true, dpr = 1;
  const build = () => {
    dpr = Math.min(devicePixelRatio || 1, 1.5); W = cv.width = hx.clientWidth * dpr; H2 = cv.height = hx.clientHeight * dpr;
    const step = Math.round(84 * dpr), n = W < 800 ? 6 : 12; paths = [];
    for (let p = 0; p < n; p++) {
      let x = ((Math.random() * W / step) | 0) * step, y = ((Math.random() * H2 / step) | 0) * step, hz = Math.random() < .5; const pts = [[x, y]];
      for (let s = 0; s < 6; s++) { const len = (((Math.random() * 5) | 0) + 2) * step * (Math.random() < .5 ? -1 : 1); if (hz) x = Math.max(0, Math.min(W, x + len)); else y = Math.max(0, Math.min(H2, y + len)); pts.push([x, y]); hz = !hz; }
      const seg = []; let L = 0; for (let k = 1; k < pts.length; k++) { const d = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); seg.push(d); L += d; }
      if (L > 0) paths.push({ pts, seg, L, t: Math.random() * L, sp: (60 + Math.random() * 90) * dpr });
    }
  };
  const at = (p, t) => { let d = t; for (let k = 0; k < p.seg.length; k++) { if (d <= p.seg[k]) { const a = p.pts[k], b = p.pts[k + 1], r = p.seg[k] ? d / p.seg[k] : 0; return [a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r]; } d -= p.seg[k]; } return p.pts[p.pts.length - 1]; };
  const frame = (ts) => {
    const dt = Math.min((ts - last) / 1000 || .016, .05); last = ts; ctx.clearRect(0, 0, W, H2); ctx.lineWidth = dpr;
    for (const p of paths) {
      ctx.strokeStyle = 'rgba(120,175,255,.14)'; ctx.beginPath(); p.pts.forEach((q, k) => (k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke();
      p.t += p.sp * dt; if (p.t > p.L) p.t = 0;
      for (let k = 0; k < 5; k++) { const q = at(p, Math.max(0, p.t - k * 9 * dpr)); ctx.fillStyle = `rgba(160,208,255,${.8 - k * .15})`; ctx.beginPath(); ctx.arc(q[0], q[1], (2.8 - k * .3) * dpr, 0, 6.283); ctx.fill(); }
    }
    raf = on ? requestAnimationFrame(frame) : 0;
  };
  build(); raf = requestAnimationFrame(frame);
  new IntersectionObserver(es => { on = es[0].isIntersecting; if (on && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }).observe(hx);
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 200); });
};
