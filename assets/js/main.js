/* =========================================
   main.js — Dark mode, lingua toggle
   Minimo, zero dipendenze
   ========================================= */

// ---- Language Toggle ----
function toggleLang() {
  var html = document.documentElement;
  var current = html.getAttribute('lang');
  var next = (current === 'it') ? 'en' : 'it';
  html.setAttribute('lang', next);
  localStorage.setItem('lang', next);
  updateLang();
}

function updateLang() {
  var lang = document.documentElement.getAttribute('lang');
  // Update all elements with data-en attribute
  var els = document.querySelectorAll('[data-en]');
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    var en = el.getAttribute('data-en');
    var it = el.getAttribute('data-it');
    if (lang === 'en' && en) {
      el.textContent = en;
    } else if (lang === 'it' && it) {
      el.textContent = it;
    }
  }
  // Update aria-label on lang toggle button
  var btn = document.querySelector('.lang-toggle');
  if (btn) {
    btn.setAttribute('aria-label',
      lang === 'en' ? 'Switch to Italian' : 'Switch to English');
  }
}

// ---- Dark Mode Toggle ----
function toggleTheme() {
  var html = document.documentElement;
  var current = html.getAttribute('data-theme');
  var next = (current === 'dark') ? '' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon();
}

function updateThemeIcon() {
  var icon = document.getElementById('theme-icon');
  if (!icon) return;
  var theme = document.documentElement.getAttribute('data-theme');
  icon.textContent = (theme === 'dark') ? '\u2600' : '\u263e';
}

// ---- Init ----
(function() {
  // Restore language preference
  var savedLang = localStorage.getItem('lang');
  if (savedLang) {
    document.documentElement.setAttribute('lang', savedLang);
  }
  // Update elements
  updateLang();
  updateThemeIcon();
})();
