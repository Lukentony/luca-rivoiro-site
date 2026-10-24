/* Miglioramento progressivo: contenuti e collegamenti funzionano anche senza JS. */
(() => {
  'use strict';
  const root = document.documentElement;
  const en = root.lang === 'en';
  const text = {
    copied: en ? 'Email copied.' : 'Email copiata.',
    copyFallback: en ? 'Copy unavailable. Select the address below or use the email link.' : 'Copia non disponibile. Seleziona l’indirizzo qui sotto o usa il collegamento email.',
    invalid: en ? 'Check the required fields.' : 'Controlla i campi obbligatori.',
    ready: en ? 'Draft ready: nothing has been sent. Open it in your email app to review and send.' : 'Bozza pronta: non è stato inviato nulla. Aprila nel programma email per controllarla e inviarla.',
    sending: en ? 'Sending…' : 'Invio in corso…',
    sent: en ? 'Message accepted by the contact service.' : 'Messaggio accettato dal servizio di contatto.',
    uncertain: en ? 'Delivery could not be confirmed. Your text is preserved. Check before retrying; you can also prepare an email draft.' : 'Non è possibile confermare la consegna. Il testo è conservato. Controlla prima di riprovare; puoi anche preparare una bozza email.',
  };
  function save(key, value) {
    try { localStorage.setItem(key, value); } catch {
      // Il sito rimane utilizzabile senza persistenza.
    }
  }
  function saved(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  const darkMedia = window.matchMedia('(prefers-color-scheme: dark)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const themeButton = document.querySelector('[data-theme-toggle]');
  function isDark() {
    return root.dataset.theme ? root.dataset.theme === 'dark' : darkMedia.matches;
  }
  function syncTheme() {
    themeButton?.setAttribute('aria-checked', String(isDark()));
  }
  themeButton?.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    save('portfolio-theme', next);
    syncTheme();
  });
  darkMedia.addEventListener('change', syncTheme);
  syncTheme();

  document.querySelectorAll('[data-lang-choice]').forEach(link => {
    link.addEventListener('click', () => {
      save('portfolio-lang', link.getAttribute('data-lang-choice'));
      if (location.hash) {
        const destination = new URL(link.href, location.href);
        destination.hash = location.hash;
        link.href = destination.href;
      }
    });
  });
  // Solo l'alias neutro ricorda la lingua; un URL IT/EN esplicito non viene mai sovrascritto.
  if (root.dataset.entry === 'true' && saved('portfolio-lang') === 'en') {
    const englishHome = root.dataset.englishHome;
    if (englishHome) location.replace(new URL(englishHome, location.href).href);
  }

  // Altezza reale dell'intestazione, condivisa fra ancore e sidebar. Nessun offset fisso duplicato.
  const header = document.querySelector('.site-header');
  if (header) {
    const syncHeaderHeight = () => root.style.setProperty('--header-height', `${Math.ceil(header.getBoundingClientRect().height)}px`);
    syncHeaderHeight();
    if ('ResizeObserver' in window) new ResizeObserver(syncHeaderHeight).observe(header);
    else window.addEventListener('resize', syncHeaderHeight, { passive: true });
  }

  // --- Menu dell'intestazione: su schermo stretto diventa un pannello richiudibile. ---
  const nav = document.querySelector('#nav-principale');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const narrowNav = window.matchMedia('(max-width: 760px)');
  const navLabelOpen = navToggle?.dataset.labelOpen || 'Apri il menu';
  const navLabelClose = navToggle?.dataset.labelClose || 'Chiudi il menu';
  function setMenu(open, moveFocus) {
    if (!nav || !navToggle) return;
    const collapsible = narrowNav.matches;
    const isOpen = collapsible && open;
    nav.hidden = collapsible && !isOpen;
    navToggle.hidden = !collapsible;
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? navLabelClose : navLabelOpen);
    if (moveFocus) (isOpen ? nav.querySelector('a') : navToggle)?.focus();
  }
  navToggle?.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    setMenu(open, open);
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (navToggle?.getAttribute('aria-expanded') !== 'true') return;
    setMenu(false, true);
  });
  nav?.addEventListener('click', event => {
    if (narrowNav.matches && event.target.closest('a')) setMenu(false, false);
  });
  document.addEventListener('click', event => {
    if (navToggle?.getAttribute('aria-expanded') !== 'true') return;
    if (event.target.closest('#nav-principale, [data-nav-toggle]')) return;
    setMenu(false, false);
  });
  narrowNav.addEventListener('change', () => setMenu(false, false));
  setMenu(false, false);

  // --- Intestazione compatta allo scorrimento, solo su schermo stretto. ---
  const headerEl = document.querySelector('.site-header');
  const narrowHeader = window.matchMedia('(max-width: 760px)');
  let compactFrame = null;
  function syncCompactHeader() {
    compactFrame = null;
    if (!headerEl) return;
    const compact = narrowHeader.matches && window.scrollY > 40;
    if (compact) headerEl.dataset.compact = 'true';
    else delete headerEl.dataset.compact;
  }
  function requestCompactHeader() {
    if (compactFrame !== null) return;
    compactFrame = requestAnimationFrame(syncCompactHeader);
  }
  window.addEventListener('scroll', requestCompactHeader, { passive: true });
  narrowHeader.addEventListener('change', requestCompactHeader);
  syncCompactHeader();

  // --- Voce di menu della sezione visibile, dove le sezioni esistono. ---
  const sectionLinks = [...document.querySelectorAll('#nav-principale a[href*="#"]')];
  const trackedSections = sectionLinks
    .map(link => ({ link, section: document.getElementById(link.hash.slice(1)) }))
    .filter(entry => entry.section);
  if (trackedSections.length && 'IntersectionObserver' in window) {
    const ratios = new Map();
    const markCurrent = () => {
      let bestId = null;
      let bestRatio = 0;
      for (const [id, ratio] of ratios) {
        if (ratio > bestRatio) { bestRatio = ratio; bestId = id; }
      }
      for (const { link, section } of trackedSections) {
        if (section.id === bestId) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      markCurrent();
    }, { threshold: [0, .2, .4, .6, .8, 1] });
    for (const { section } of trackedSections) observer.observe(section);
  }

  const effectsButton = document.querySelector('[data-effects-toggle]');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  // L'alone è visibile di default sui mouse, salvo scelta esplicita off o movimento ridotto.
  let effects = saved('portfolio-effects') !== 'off';
  let pointerFrame = null;
  let pendingPoint = null;
  // Il cerchio è unico e vive nella pagina: ogni scheda ne mostra la parte che la attraversa.
  const activeCards = new Set();
  const glowCards = Array.from(document.querySelectorAll('.card'));
  const GLOW_REACH = 200; // raggio visibile del gradiente (520px con stop al 55%)
  let cardRects = [];
  let rectsDirty = true;

  function resetGlow(card) {
    if (!card) return;
    // Si toglie solo l'attributo: rimuovere anche le coordinate farebbe tornare il gradiente
    // al centro predefinito mentre l'opacità sta ancora sfumando, cioè un lampo verde al centro.
    delete card.dataset.pointerActive;
  }
  function clearSpotlight() {
    if (pointerFrame !== null) cancelAnimationFrame(pointerFrame);
    pointerFrame = null;
    pendingPoint = null;
    for (const card of activeCards) resetGlow(card);
    activeCards.clear();
    setCursorGlow(null);
  }
  function measureCards() {
    cardRects = glowCards.map(card => ({ card, rect: card.getBoundingClientRect() }));
    rectsDirty = false;
  }
  let lastPoint = null;
  let scrollTimer = null;
  // Pallino da 10px: mostra la luce quando il puntatore è fuori dalle schede.
  const cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  cursorGlow.setAttribute('aria-hidden', 'true');
  document.body.append(cursorGlow);
  let cursorShown = false;
  function setCursorGlow(x, y) {
    if (x === null || x === undefined) {
      if (cursorShown) {
        cursorShown = false;
        cursorGlow.dataset.visible = 'false';
      }
      return;
    }
    // Posizione prima della comparsa: mai un frame nella posizione vecchia.
    cursorGlow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (!cursorShown) {
      cursorShown = true;
      cursorGlow.dataset.visible = 'true';
    }
  }
  function updateGlow(x, y) {
    lastPoint = { x, y };
    if (rectsDirty) measureCards();
    let insideCard = false;
    for (const entry of cardRects) {
      const rect = entry.rect;
      if (!rect.width || !rect.height) continue;
      const dx = Math.max(rect.left - x, 0, x - rect.right);
      const dy = Math.max(rect.top - y, 0, y - rect.bottom);
      const away = dx || dy ? Math.hypot(dx, dy) : 0;
      if (away === 0) insideCard = true;
      if (away > GLOW_REACH) {
        if (activeCards.delete(entry.card)) resetGlow(entry.card);
        continue;
      }
      // Stessa posizione del puntatore per tutte: ogni finestra ne ritaglia la sua porzione,
      // così fra due schede vicine il cerchio si vede su entrambe senza stacco.
      entry.card.style.setProperty('--pointer-x', `${x - rect.left}px`);
      entry.card.style.setProperty('--pointer-y', `${y - rect.top}px`);
      entry.card.dataset.pointerActive = 'true';
      activeCards.add(entry.card);
    }
    // Dentro una scheda parla il cerchio grande: fuori resta il pallino.
    setCursorGlow(insideCard ? null : x, insideCard ? null : y);
  }
  function scheduleUpdate(point) {
    if (!point) return;
    pendingPoint = point;
    if (pointerFrame !== null) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = null;
      const next = pendingPoint;
      pendingPoint = null;
      if (next && document.body.dataset.effects === 'on') updateGlow(next.x, next.y);
    });
  }
  window.addEventListener('pointermove', event => {
    if (document.body.dataset.effects !== 'on' || event.pointerType === 'touch') return;
    scheduleUpdate({ x: event.clientX, y: event.clientY });
  }, { passive: true });
  // Dopo uno scorrimento la luce resta ferma dov'è: si ricalcola una volta, con lo stesso puntatore,
  // così anche le schede che entrano in portata si accendono senza muovere il mouse.
  const invalidateRects = () => {
    rectsDirty = true;
    if (scrollTimer !== null) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      scrollTimer = null;
      if (lastPoint) scheduleUpdate(lastPoint);
    }, 140);
  };
  window.addEventListener('scroll', invalidateRects, { passive: true });
  window.addEventListener('resize', invalidateRects);
  // Un cambio di layout (per esempio un <details> aperto) sposta le schede: i rettangoli vanno rifatti.
  if ('ResizeObserver' in window) new ResizeObserver(invalidateRects).observe(document.body);
  window.addEventListener('blur', clearSpotlight);
  document.addEventListener('pointerleave', clearSpotlight);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearSpotlight();
  });
  function syncEffects() {
    const enabled = effects && finePointer.matches && !reducedMotion.matches;
    document.body.dataset.effects = enabled ? 'on' : 'off';
    effectsButton?.setAttribute('aria-checked', String(enabled));
    if (!enabled) clearSpotlight();
  }
  effectsButton?.addEventListener('click', () => {
    effects = !effects;
    save('portfolio-effects', effects ? 'on' : 'off');
    syncEffects();
  });
  reducedMotion.addEventListener('change', syncEffects);
  finePointer.addEventListener('change', syncEffects);
  syncEffects();

  const address = document.querySelector('[data-email-address]')?.textContent?.trim();
  const copyButton = document.querySelector('[data-copy-email]');
  copyButton?.addEventListener('click', async () => {
    const status = document.querySelector('[data-copy-status]');
    if (!status || !address) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(address);
      status.textContent = text.copied;
    } catch {
      status.textContent = text.copyFallback;
      const selectable = document.querySelector('[data-email-address]');
      if (selectable) {
        const range = document.createRange();
        range.selectNodeContents(selectable);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  });

  const demo = document.querySelector('[data-guardian-demo]');
  if (demo) {
    const buttons = [...demo.querySelectorAll('[data-scenario]')];
    const output = demo.querySelector('[data-demo-result]');
    const command = demo.querySelector('[data-demo-command]');
    const title = demo.querySelector('[data-demo-title]');
    const description = demo.querySelector('[data-demo-description]');
    for (const button of buttons) {
      button.addEventListener('click', () => {
        if (!output || !command || !title || !description) return;
        buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        command.textContent = button.getAttribute('data-command');
        title.textContent = button.getAttribute('data-title');
        description.textContent = button.getAttribute('data-description');
        output.setAttribute('data-tone', button.getAttribute('data-tone'));
      });
    }
    demo.querySelector('[data-demo-controls]')?.removeAttribute('hidden');
  }

  const form = document.querySelector('[data-contact-form]');
  if (form && address) {
    const status = form.querySelector('[data-form-status]');
    const submit = form.querySelector('[type=submit]');
    const draft = form.querySelector('[data-mail-draft]');
    const prepare = form.querySelector('[data-prepare-draft]');
    const endpoint = form.getAttribute('data-contact-endpoint');
    const allowedEndpoint = 'https://contatti.lukentony.it/webhook/contatto';
    let pending = false;
    form.hidden = false;
    function payload() {
      return Object.fromEntries(['nome', 'email', 'messaggio', 'website'].map(name => [name, String(new FormData(form).get(name) || '').trim()]));
    }
    function makeDraft(data) {
      if (!draft) return;
      const subject = encodeURIComponent(`Portfolio — ${data.nome}`);
      const body = encodeURIComponent(`${data.messaggio}\n\n— ${data.nome} (${data.email})`);
      draft.setAttribute('href', `mailto:${address}?subject=${subject}&body=${body}`);
      draft.hidden = false;
    }
    function announce(message) {
      if (status) { status.textContent = message; status.hidden = false; }
    }
    function valid() {
      if (!form.reportValidity()) { announce(text.invalid); return false; }
      const data = payload();
      if (!data.nome || !data.messaggio) { announce(text.invalid); return false; }
      return true;
    }
    prepare?.addEventListener('click', () => {
      if (!valid()) return;
      makeDraft(payload());
      announce(text.ready);
    });
    form.addEventListener('input', () => {
      // Una bozza non deve conservare di nascosto dati precedenti alle modifiche dell'utente.
      if (draft) { draft.hidden = true; draft.removeAttribute('href'); }
    });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (pending || !valid()) return;
      const data = payload();
      if (data.website) return;
      if (!endpoint) { makeDraft(data); announce(text.ready); return; }
      if (endpoint !== allowedEndpoint) { announce(text.uncertain); return; }
      pending = true;
      if (submit) submit.disabled = true;
      announce(text.sending);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: controller.signal, credentials: 'omit', redirect: 'error' });
        if (!response.ok) throw new Error(`Contact HTTP ${response.status}`);
        announce(text.sent);
        form.reset();
        if (draft) { draft.hidden = true; draft.removeAttribute('href'); }
      } catch {
        // Un timeout non prova la mancata consegna: niente retry o apertura mailto automatici.
        announce(text.uncertain);
      } finally {
        clearTimeout(timer);
        pending = false;
        if (submit) submit.disabled = false;
      }
    });
  }
})();
