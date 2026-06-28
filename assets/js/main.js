/* =========================================
   main.js — Dark mode, lingua, accordion
   ========================================= */

// ---- Accordion toggle ----
function toggleProj(idx) {
  var body = document.getElementById('proj-' + idx);
  var arrow = document.getElementById('arrow-' + idx);
  if (!body || !arrow) return;
  var isOpen = body.classList.contains('open');
  // Close all
  var allBodies = document.querySelectorAll('.proj-body');
  var allArrows = document.querySelectorAll('.proj-arrow');
  for (var i = 0; i < allBodies.length; i++) {
    allBodies[i].classList.remove('open');
    if (allArrows[i]) allArrows[i].classList.remove('open');
  }
  // Open clicked (if was closed)
  if (!isOpen) {
    body.classList.add('open');
    arrow.classList.add('open');
  }
}

// ---- Language ----
function setLang(l) {
  var html = document.documentElement;
  html.setAttribute('lang', l);
  localStorage.setItem('lang', l);
  // Update active button
  document.getElementById('lang-it').classList.toggle('active', l === 'it');
  document.getElementById('lang-en').classList.toggle('active', l === 'en');
  // Update all translatable elements
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

// ---- Theme ----
function toggleTheme() {
  var html = document.documentElement;
  var current = html.getAttribute('data-theme');
  var next = (current === 'dark') ? '' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  var icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = (next === 'dark') ? '\u2600' : '\u263e';
}

// ---- Init ----
(function() {
  var savedLang = localStorage.getItem('lang');
  if (savedLang) setLang(savedLang);
  var savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  // Open first project by default on desktop
  if (window.innerWidth > 768) {
    toggleProj(0);
  }
})();
