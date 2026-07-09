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
}
function isDarkActive() {
  var t = document.documentElement.getAttribute('data-theme');
  if (t) return t === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
function syncThemeButton() {
  var btn = document.getElementById('theme-toggle');
  if (btn) btn.setAttribute('aria-pressed', isDarkActive());
}
function toggleTheme() {
  var next = isDarkActive() ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  syncThemeButton();
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
})();
