/* hero.js - builder 2. Hero section (DESIGN_SPEC C.2). Defines window.Portfolio.initHero.
   - Splits the name into characters (entrance after ep:loaded, scramble on hover).
   - Whole-name scramble: letters of "Ebad Momin" scramble for about 1 s, then settle, on pointer enter.
   - Rotating subtitle: line 2 cycles through CV phrases every 3 s with a 400 ms vertical roll (D3).
   Works without JS: the markup is complete (first phrase present), and the hidden entrance state only applies once JS has armed the section.
   Reduced motion: no split, no scramble, no rotation. */
(function () {
  'use strict';

  window.Portfolio = window.Portfolio || {};
  var P = window.Portfolio;

  var reduceMQ = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var touchMQ = window.matchMedia ? window.matchMedia('(hover: none)') : null;

  var ROTATE_MS = 3000;                  // each phrase shows for about 3 s (reference cadence)
  var ROLL_MS = 400;                     // vertical roll duration (matches CSS keyframes)
  var SCRAMBLE_MS = 1000;                // whole-name scramble duration
  var SCRAMBLE_STEP_MS = 45;
  var GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+<>/=?';

  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function now() { return window.performance ? window.performance.now() : Date.now(); }

  /* ---------- Character split (name entrance and scramble) ---------- */
  function splitChars(el, state) {
    var text = '';
    var i;
    for (i = 0; i < el.childNodes.length; i++) {
      if (el.childNodes[i].nodeType === 3) text += el.childNodes[i].nodeValue;
    }
    if (!text) return;
    for (i = el.childNodes.length - 1; i >= 0; i--) {
      if (el.childNodes[i].nodeType === 3) el.removeChild(el.childNodes[i]);
    }
    var frag = document.createDocumentFragment();
    text.split('').forEach(function (ch) {
      var outer = document.createElement('span');
      outer.className = 'ep-hero__char';
      outer.setAttribute('aria-hidden', 'true');
      outer.style.setProperty('--i', String(state.index++));
      var inner = document.createElement('span');
      inner.className = 'ep-hero__char-inner';
      inner.textContent = ch;
      outer.appendChild(inner);
      frag.appendChild(outer);
      state.letters.push({ el: inner, ch: ch });
    });
    el.insertBefore(frag, el.firstChild);
  }

  /* ---------- Whole-name scramble on hover ---------- */
  function initNameScramble(nameEl, letters) {
    var n = letters.length;
    if (!n) return;
    var running = false;

    function run() {
      if (running) return;
      running = true;
      var t0 = now();
      (function step() {
        var p = clamp((now() - t0) / SCRAMBLE_MS, 0, 1);
        letters.forEach(function (l, i) {
          // Letters settle left to right; the last one settles at 85 percent of the duration.
          var settleAt = 0.15 + 0.7 * (n > 1 ? i / (n - 1) : 0);
          l.el.textContent = p >= settleAt ? l.ch : GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
        });
        if (p < 1) {
          window.setTimeout(step, SCRAMBLE_STEP_MS);
        } else {
          running = false;
        }
      })();
    }

    nameEl.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'touch') return;
      run();
    });

    // Touch devices have no hover: play once when the name first enters the viewport.
    if (touchMQ && touchMQ.matches && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            run();
            obs.disconnect();
          }
        });
      }, { threshold: 0.6 });
      io.observe(nameEl);
    }
  }

  /* ---------- Rotating subtitle (line 2) ---------- */
  function initRotor(root) {
    var words = Array.prototype.slice.call(root.querySelectorAll('.ep-hero__word'));
    if (words.length < 2) return;
    var idx = 0;
    words.forEach(function (w, i) { if (w.classList.contains('is-current')) idx = i; });

    window.setInterval(function () {
      if (document.hidden) return;
      var prev = words[idx];
      idx = (idx + 1) % words.length;
      var next = words[idx];
      prev.classList.remove('is-current', 'is-in');
      prev.classList.add('is-out');
      next.classList.remove('is-out');
      next.classList.add('is-current', 'is-in');
      window.setTimeout(function () {
        prev.classList.remove('is-out');
        next.classList.remove('is-in');
      }, ROLL_MS);
    }, ROTATE_MS);
  }


  /* ---------- Init ---------- */
  P.initHero = function initHero() {
    var root = document.querySelector('.ep-hero');
    if (!root) return;

    // Arming the section switches on the pre-entrance hidden state (CSS). Before this line the markup is fully visible.
    root.classList.add('is-armed');

    var reduced = !!(reduceMQ && reduceMQ.matches);
    var loaded = false;

    // Name: split into characters for the entrance and the scramble (skipped under reduced motion).
    var nameEl = root.querySelector('.ep-hero__name');
    if (!reduced && nameEl) {
      var state = { index: 0, letters: [] };
      Array.prototype.slice.call(nameEl.querySelectorAll('.ep-hero__name-base, .ep-hero__name-accent'))
        .forEach(function (el) {
          try { splitChars(el, state); } catch (err) { /* keep plain text */ }
        });
      try { initNameScramble(nameEl, state.letters); } catch (err) {
        if (window.console) console.error('[Portfolio] hero name effect failed:', err);
      }
    }

    if (!reduced) {
      try { initRotor(root); } catch (err) {
        if (window.console) console.error('[Portfolio] hero rotor failed:', err);
      }
    }

    function reveal() {
      if (loaded) return;
      loaded = true;
      root.classList.add('is-loaded');
    }

    if (reduced || document.body.getAttribute('data-loading') === 'false') {
      reveal();
    } else {
      document.addEventListener('ep:loaded', reveal, { once: true });
      // Safety net: core's loader always dispatches ep:loaded; never leave the hero hidden if it does not.
      window.setTimeout(reveal, 6000);
    }
  };
})();
