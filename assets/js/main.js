/* =========================================
   main.js — Lingua, tema
   ========================================= */

function setLang(l) {
  var html = document.documentElement;
  html.setAttribute('lang', l);
  localStorage.setItem('lang', l);
  // Buttons
  document.getElementById('lang-it').classList.toggle('active', l === 'it');
  document.getElementById('lang-en').classList.toggle('active', l === 'en');
  // Translate
  var els = document.querySelectorAll('[data-en]');
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    if (l === 'en' && el.getAttribute('data-en')) {
      el.innerHTML = el.getAttribute('data-en');
    } else if (l === 'it' && el.getAttribute('data-it')) {
      el.innerHTML = el.getAttribute('data-it');
    }
  }
}

function toggleTheme() {
  var html = document.documentElement;
  var next = html.getAttribute('data-theme') === 'dark' ? '' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

// Init
(function() {
  // Store original Italian text as data-it for all translatable elements
  var els = document.querySelectorAll('[data-en]');
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    if (!el.getAttribute('data-it')) {
      el.setAttribute('data-it', el.innerHTML);
    }
  }
  // Restore saved language
  var savedLang = localStorage.getItem('lang');
  if (savedLang === 'en') setLang('en');
  // Restore saved theme
  var savedTheme = localStorage.getItem('theme');
  var html = document.documentElement; if (savedTheme === 'dark') html.setAttribute('data-theme', 'dark');
})();
