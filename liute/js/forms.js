/* Client-side validation only. Delivery needs a real endpoint: set formEndpoint in js/config.js (see README). */
window.LIUTE.initForms = function () {
  const { qs, qsa, config } = window.LIUTE;
  const form = qs('#enquiry-form'); if (!form) return;
  const status = qs('#form-status');
  const say = (msg, cls) => { status.hidden = false; status.className = 'status ' + cls; status.textContent = msg; };
  const check = (f) => {
    let ok = true;
    qsa('[required]', f).forEach(el => {
      const bad = !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value));
      el.setAttribute('aria-invalid', bad); const e = el.parentElement.querySelector('.err'); if (e) e.textContent = bad ? 'Please check this field.' : '';
      if (bad && ok) { el.focus(); } ok = ok && !bad;
    });
    return ok;
  };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!check(form)) { say('Some required fields need attention.', 'warn'); return; }
    if (!config.formEndpoint) { say('Your enquiry has not been sent: this form is not yet connected to a submission service. Please call or email us using the details on this page.', 'warn'); return; }
    const btn = qs('button[type=submit]', form); btn.disabled = true; say('Sending…', '');
    try {
      const r = await fetch(config.formEndpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
      if (!r.ok) throw new Error(r.status);
      form.reset(); say('Thank you. Your enquiry has been sent.', 'ok');
    } catch (err) { say('Sorry, the enquiry could not be sent. Please call or email us directly.', 'warn'); }
    btn.disabled = false;
  });
};
