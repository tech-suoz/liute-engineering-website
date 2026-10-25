/* Services preview, capability showcase, magnetic buttons, custom cursor, FAQ. */
window.LIUTE.initInteractions = function () {
  const { qs, qsa, fine, reduced } = window.LIUTE;
  // Services: hovering/focusing a row swaps the sticky preview image
  const rows = qsa('.svc-list a'), prev = qsa('.svc-preview img');
  rows.forEach((a, i) => { const on = () => { rows.forEach(r => r.classList.remove('on')); a.classList.add('on'); prev.forEach((p, k) => p.classList.toggle('on', k === i)); }; a.addEventListener('mouseenter', on); a.addEventListener('focus', on); });
  if (prev[0]) prev[0].classList.add('on'); if (rows[0]) rows[0].classList.add('on');
  // Capability showcase: markers + tabs share one state (works on touch and keyboard)
  const panel = qs('#sc-panel'), mk = qsa('[data-cap]');
  if (panel && mk.length) {
    const data = JSON.parse(qs('#cap-data').textContent);
    const show = (k) => { const d = data[k]; panel.innerHTML = '<h3></h3><p class="muted"></p>'; panel.firstChild.textContent = d.t; panel.lastChild.textContent = d.d; mk.forEach(m => m.setAttribute('aria-selected', m.dataset.cap === k)); };
    mk.forEach(m => m.addEventListener('click', () => show(m.dataset.cap)));
    show(mk[0].dataset.cap);
  }
  // Magnetic buttons + cursor label (desktop, motion allowed)
  if (fine && !reduced) {
    qsa('[data-magnetic]').forEach(b => {
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .28}px)`; });
      b.addEventListener('pointerleave', () => (b.style.transform = ''));
    });
    const dot = document.createElement('div'); dot.className = 'cursor-dot'; dot.setAttribute('aria-hidden', 'true'); document.body.append(dot);
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const loop = () => { x += (tx - x) * .22; y += (ty - y) * .22; dot.style.transform = `translate(${x}px,${y}px)`; raf = (Math.abs(tx - x) + Math.abs(ty - y) > .1) ? requestAnimationFrame(loop) : 0; };
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; dot.classList.add('on'); if (!raf) raf = requestAnimationFrame(loop); }, { passive: true });
    document.addEventListener('pointerover', e => { const g = e.target.closest('[data-cursor]'); dot.classList.toggle('big', !!g); dot.textContent = g ? g.dataset.cursor : ''; });
    document.addEventListener('mouseleave', () => dot.classList.remove('on'));
  }
  // FAQ: one open at a time, animated height
  const f = qsa('.faq details');
  f.forEach(d => d.addEventListener('toggle', () => { if (d.open) f.forEach(o => o !== d && (o.open = false)); }));
};
