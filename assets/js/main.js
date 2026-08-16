/* main.js — Lingua e tema (minimo) */
function applyLangVisibility(l) {
  var itEls = document.querySelectorAll('.lang-it');
  var enEls = document.querySelectorAll('.lang-en');
  for (var i = 0; i < itEls.length; i++) itEls[i].hidden = (l !== 'it');
  for (var j = 0; j < enEls.length; j++) enEls[j].hidden = (l !== 'en');
}
function setLang(l) {
  document.documentElement.setAttribute('lang', l);
  localStorage.setItem('lang', l);
  applyLangVisibility(l);
  var it = document.getElementById('lang-it');
  var en = document.getElementById('lang-en');
  it.classList.toggle('active', l === 'it');
  en.classList.toggle('active', l === 'en');
  it.setAttribute('aria-pressed', l === 'it');
  en.setAttribute('aria-pressed', l === 'en');
  syncThemeButton();
}
function isDarkActive() {
  var t = document.documentElement.getAttribute('data-theme');
  if (t) return t === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
/* Il testo del bottone descrive l'azione (cosa succede se clicchi), non lo stato
   corrente: altrimenti "Scuro" resta scritto anche quando il tema e' gia' scuro
   e non e' chiaro se e' un'etichetta di stato o un invito a cliccare. */
var THEME_BTN_LABEL = {
  it: { toDark: 'Scuro', toLight: 'Chiaro' },
  en: { toDark: 'Dark', toLight: 'Light' }
};
function syncThemeButton() {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;
  var dark = isDarkActive();
  btn.setAttribute('aria-pressed', dark);
  var lang = document.documentElement.getAttribute('lang') || 'it';
  var label = document.getElementById('theme-btn-label');
  if (label) label.textContent = dark ? THEME_BTN_LABEL[lang].toLight : THEME_BTN_LABEL[lang].toDark;
}
function toggleTheme() {
  var next = isDarkActive() ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  syncThemeButton();
}
function replayTerminal() {
  var active = document.querySelector('.term-body:not([hidden])');
  if (!active) return;
  var lines = active.querySelectorAll('.term-line');
  for (var i = 0; i < lines.length; i++) lines[i].style.opacity = '0';
  var i = 0;
  (function next() {
    if (i >= lines.length) return;
    lines[i].style.opacity = '1';
    i++;
    setTimeout(next, 220);
  })();
}

/* ---- Form di contatto (POST a n8n via Cloudflare Tunnel, fallback mailto) ---- */
var CONTACT_ENDPOINT = 'https://contatti.lukentony.it/webhook/contatto';

function fingerprint() {
  var tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) {}
  return {
    referrer: document.referrer || '',
    pagina: window.location.pathname,
    browser: navigator.userAgent || '',
    lingua: navigator.language || '',
    timezone: tz,
    screen: (window.screen ? window.screen.width + 'x' + window.screen.height : '')
  };
}

function fallbackMailto(nome, email, messaggio) {
  var subj = encodeURIComponent('Progetto: ' + nome);
  var body = encodeURIComponent(messaggio + '\n\n— ' + nome + ' (' + email + ')');
  window.location.href = 'mailto:luca.rivoiro@gmail.com?subject=' + subj + '&body=' + body;
}

function setupContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var submit = document.getElementById('form-submit');
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var nome = document.getElementById('cf-nome').value.trim();
    var email = document.getElementById('cf-email').value.trim();
    var messaggio = document.getElementById('cf-messaggio').value.trim();
    var website = document.getElementById('cf-website').value.trim();
    if (!nome || !email || !messaggio) {
      status.hidden = false;
      status.textContent = document.documentElement.getAttribute('lang') === 'en' ? 'Fill in name, email and message.' : 'Compila nome, email e messaggio.';
      return;
    }
    submit.disabled = true;
    var payload = {
      nome: nome,
      email: email,
      messaggio: messaggio,
      website: website,
      fingerprint: fingerprint()
    };
    fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) {
      submit.disabled = false;
      if (r.ok) {
        status.hidden = false;
        status.textContent = document.documentElement.getAttribute('lang') === 'en' ? 'Message sent, thanks.' : 'Messaggio inviato, grazie.';
        form.reset();
      } else {
        throw new Error('n8n ha risposto ' + r.status);
      }
    }).catch(function () {
      submit.disabled = false;
      fallbackMailto(nome, email, messaggio);
    });
  });
}
(function(){
  var l = localStorage.getItem('lang') || 'it';
  var h = document.documentElement;
  h.setAttribute('lang', l);
  applyLangVisibility(l);
  var it = document.getElementById('lang-it');
  var en = document.getElementById('lang-en');
  if (it && en) {
    it.classList.toggle('active', l === 'it');
    en.classList.toggle('active', l === 'en');
    it.setAttribute('aria-pressed', l === 'it');
    en.setAttribute('aria-pressed', l === 'en');
  }
  syncThemeButton();
  setupContactForm();
  var replayBtn = document.getElementById('term-replay');
  if (replayBtn) replayBtn.addEventListener('click', replayTerminal);
})();
