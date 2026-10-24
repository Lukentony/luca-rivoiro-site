/* Prima del CSS: preferenza valida, altrimenti tema del dispositivo. Storage opzionale. */
(() => {
  document.documentElement.classList.add('has-js');
  try {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'light' || saved === 'dark') document.documentElement.dataset.theme = saved;
  } catch {
    // Con storage bloccato rimane utilizzabile il tema del sistema.
  }
})();
