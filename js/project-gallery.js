/* Gallery category filter + accessible lightbox. */
window.LIUTE.initGallery = function () {
  const { qs, qsa } = window.LIUTE;
  const items = qsa('.g-item'); if (!items.length) return;
  qsa('.filters button').forEach(b => b.addEventListener('click', () => {
    qsa('.filters button').forEach(x => x.setAttribute('aria-pressed', x === b));
    items.forEach(i => (i.hidden = b.dataset.f !== 'all' && i.dataset.cat !== b.dataset.f));
  }));
  const lb = qs('.lightbox'); if (!lb) return;
  const img = qs('img', lb), cap = qs('figcaption', lb); let last;
  const close = () => { lb.classList.remove('open'); last && last.focus(); };
  items.forEach(i => i.addEventListener('click', () => { last = i; const im = qs('img', i); img.src = im.src; img.alt = im.alt; cap.textContent = qs('.cap-in', i).textContent; lb.classList.add('open'); qs('.lb-x', lb).focus(); }));
  qs('.lb-x', lb).addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('open')) close(); });
};
