/* main.js — Lingua e tema (minimo) */
function setLang(l) {
  document.documentElement.setAttribute('lang', l);
  localStorage.setItem('lang', l);
  var it = document.getElementById('lang-it');
  var en = document.getElementById('lang-en');
  it.classList.toggle('active', l === 'it');
  en.classList.toggle('active', l === 'en');
  it.setAttribute('aria-pressed', l === 'it');
  en.setAttribute('aria-pressed', l === 'en');
}
function toggleTheme() {
  var h = document.documentElement;
  var n = h.getAttribute('data-theme') === 'dark' ? '' : 'dark';
  h.setAttribute('data-theme', n);
  localStorage.setItem('theme', n);
}
(function(){
  var l = localStorage.getItem('lang');
  if (l === 'en') setLang('en');
  var t = localStorage.getItem('theme');
  if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
})();
