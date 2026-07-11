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
  var replayBtn = document.getElementById('term-replay');
  if (replayBtn) replayBtn.addEventListener('click', replayTerminal);
})();
