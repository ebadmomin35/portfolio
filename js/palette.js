/* palette.js - builder 6. Command palette (work order E6 items 1 to 9).
   Exposes window.Portfolio.initPalette, openPalette and closePalette only.
   The markup (8 commands in reference order, footer hints) is static in
   index.html so the list reads without JavaScript. Opened by the navbar
   button and Ctrl/Cmd+K through window.Portfolio.openPalette (core, effects.js). */
(function () {
  'use strict';

  window.Portfolio = window.Portfolio || {};
  var P = window.Portfolio;

  var reduceMQ = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduced() { return !!(reduceMQ && reduceMQ.matches); }

  var inited = false;
  var el = {};
  var items = [];
  var lastFocus = null;

  /* ---------- List state ---------- */
  function visibleItems() {
    return items.filter(function (li) { return !li.hidden; });
  }

  function activeItem() {
    for (var i = 0; i < items.length; i++) {
      if (!items[i].hidden && items[i].getAttribute('aria-selected') === 'true') return items[i];
    }
    return null;
  }

  function setActive(li) {
    for (var i = 0; i < items.length; i++) {
      items[i].setAttribute('aria-selected', items[i] === li ? 'true' : 'false');
    }
    if (li) {
      el.input.setAttribute('aria-activedescendant', li.id);
      if (li.scrollIntoView) li.scrollIntoView({ block: 'nearest' });
    } else {
      el.input.removeAttribute('aria-activedescendant');
    }
  }

  function moveActive(delta) {
    var list = visibleItems();
    if (!list.length) return;
    var idx = list.indexOf(activeItem());
    var next;
    if (idx === -1) next = delta > 0 ? 0 : list.length - 1;
    else next = (idx + delta + list.length) % list.length;
    setActive(list[next]);
  }

  // Filter by label, case-insensitive. Highlight resets to the first visible item.
  function filter() {
    var q = el.input.value.trim().toLowerCase();
    for (var i = 0; i < items.length; i++) {
      var label = (items[i].getAttribute('data-label') || '').toLowerCase();
      items[i].hidden = !!q && label.indexOf(q) === -1;
    }
    var list = visibleItems();
    el.empty.hidden = list.length > 0;
    setActive(list[0] || null);
  }

  /* ---------- Run a command ---------- */
  function run(li) {
    if (!li) return;
    if (li.getAttribute('data-action') === 'snake') {
      closePalette();
      if (typeof P.openSnake === 'function') P.openSnake();
      return;
    }
    var href = li.getAttribute('data-href') || '';
    if (li.getAttribute('data-external') === 'true') {
      closePalette();
      window.open(href, '_blank', 'noopener');
      return;
    }
    closePalette();
    var target = href.charAt(0) === '#' ? document.querySelector(href) : null;
    if (target) {
      target.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
    }
  }

  /* ---------- Open / close ---------- */
  function isOpen() { return !!(el.dialog && el.dialog.open); }

  function onClosed() {
    document.body.classList.remove('ep-palette-open');
    var target = lastFocus;
    lastFocus = null;
    if (target && target.isConnected && typeof target.focus === 'function') {
      target.focus({ preventScroll: true });
    }
  }

  function openPalette() {
    if (!ensureInit()) return;
    if (isOpen()) return;
    lastFocus = document.activeElement;
    el.input.value = '';
    filter();
    el.dialog.showModal();
    document.body.classList.add('ep-palette-open');
    el.input.focus();
  }

  function closePalette() {
    if (!inited || !isOpen()) return;
    el.dialog.close();
  }

  /* ---------- Input ---------- */
  function onInputKey(e) {
    if (e.key === 'ArrowDown' || e.key === 'Down') {
      e.preventDefault();
      moveActive(1);
    } else if (e.key === 'ArrowUp' || e.key === 'Up') {
      e.preventDefault();
      moveActive(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(activeItem());
    }
    // Escape is the dialog's native cancel (closes, focus returns to the trigger).
  }

  function itemFromEvent(e) {
    var t = e.target;
    return t && t.closest ? t.closest('.ep-palette__item') : null;
  }

  function ensureInit() {
    if (inited) return true;
    el.dialog = document.getElementById('ep-palette');
    if (!el.dialog || typeof el.dialog.showModal !== 'function') return false;
    el.input = el.dialog.querySelector('.ep-palette__input');
    el.list = el.dialog.querySelector('.ep-palette__list');
    el.empty = el.dialog.querySelector('.ep-palette__empty');
    el.close = el.dialog.querySelector('.ep-palette__close');
    if (!el.input || !el.list || !el.empty || !el.close) return false;
    items = Array.prototype.slice.call(el.list.querySelectorAll('.ep-palette__item'));

    el.input.addEventListener('input', filter);
    el.input.addEventListener('keydown', onInputKey);
    el.list.addEventListener('mousemove', function (e) {
      var li = itemFromEvent(e);
      if (li && !li.hidden && li.getAttribute('aria-selected') !== 'true') setActive(li);
    });
    el.list.addEventListener('click', function (e) {
      var li = itemFromEvent(e);
      if (li && !li.hidden) run(li);
    });
    el.close.addEventListener('click', closePalette);
    // Click on the backdrop: the dialog element itself, not the panel inside it.
    el.dialog.addEventListener('click', function (e) {
      if (e.target === el.dialog) closePalette();
    });
    el.dialog.addEventListener('close', onClosed);

    inited = true;
    return true;
  }

  P.initPalette = function initPalette() {
    ensureInit();
  };
  P.openPalette = openPalette;
  P.closePalette = closePalette;
})();
