/* Inner pages: hero parallax, card tilt, in-page nav scrollspy, multi-step quote form. */
window.LIUTE.initPages = function () {
  const { qs, qsa, reduced, fine, config } = window.LIUTE;
  const bg = qs('.ph-bg');
  if (bg && !reduced) { let t = 0; addEventListener('scroll', () => { if (!t) t = requestAnimationFrame(() => { t = 0; if (scrollY < innerHeight * 1.2) bg.style.transform = `translate3d(0,${scrollY * .22}px,0)`; }); }, { passive: true }); }
  if (fine && !reduced) qsa('.fc').forEach(c => { c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = `translateY(-8px) perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`; }); c.addEventListener('pointerleave', () => (c.style.transform = '')); });
  const links = qsa('.subnav a');
  if (links.length && 'IntersectionObserver' in window) {
    const secs = links.map(a => qs(a.getAttribute('href'))).filter(Boolean);
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && scrollY > 300) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(s => io.observe(s));
  }
};
window.LIUTE.initQuote = function () {
  const { qs, qsa, config } = window.LIUTE;
  const f = qs('#quote-form'); if (!f) return;
  const steps = qsa('.qs', f), prog = qsa('.qp li', f), back = qs('#qback'), next = qs('#qnext'), send = qs('#qsend'), st = qs('#form-status'); let i = 0;
  const say = (m, c) => { st.hidden = false; st.className = 'status ' + c; st.textContent = m; };
  const valid = () => { let ok = true; qsa('[required]', steps[i]).forEach(el => { const bad = !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value)); el.setAttribute('aria-invalid', bad); const e = el.parentElement.querySelector('.err'); if (e) e.textContent = bad ? 'Please check this field.' : ''; if (bad && ok) el.focus(); ok = ok && !bad; }); return ok; };
  const review = () => { const d = new FormData(f), g = k => d.getAll(k).join(', ') || 'Not provided', rows = [['Name', g('name')], ['Company', g('company')], ['Email', g('email')], ['Phone', g('phone')], ['Services', g('service')], ['Facility', g('sector')], ['Type of work', g('type')], ['Timeline', g('timeline')], ['Budget', g('budget')], ['Scope', g('message')]]; const dl = qs('#qreview'); dl.innerHTML = ''; rows.forEach(([a, b]) => { const t = document.createElement('dt'), v = document.createElement('dd'); t.textContent = a; v.textContent = b; dl.append(t, v); }); };
  const show = n => { i = n; steps.forEach((s, k) => s.classList.toggle('on', k === i)); prog.forEach((p, k) => { p.classList.toggle('on', k === i); p.classList.toggle('done', k < i); }); back.hidden = i === 0; next.hidden = i === steps.length - 1; send.hidden = i !== steps.length - 1; st.hidden = true; if (i === steps.length - 1) review(); f.scrollIntoView({ block: 'start', behavior: 'smooth' }); };
  next.addEventListener('click', () => { if (valid()) show(i + 1); }); back.addEventListener('click', () => show(i - 1));
  f.addEventListener('submit', async e => {
    e.preventDefault();
    if (!config.formEndpoint) { say('Your request has not been sent: this form is not yet connected to a submission service. Please call or email us using the details on this page.', 'warn'); return; }
    send.disabled = true; say('Sending...', '');
    try { const r = await fetch(config.formEndpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(f) }); if (!r.ok) throw 0; f.reset(); show(0); say('Thank you. Your request has been sent.', 'ok'); } catch (x) { say('Sorry, the request could not be sent. Please call or email us directly.', 'warn'); }
    send.disabled = false;
  });
};
