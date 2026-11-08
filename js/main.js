/* main.js - core. Boot sequence on DOMContentLoaded:
   1. initEffects (particles, parallax, reveal, nav, progress, menu, shortcut)
   2. each section module init<Name> that exists (typeof guard + try/catch per module)
   3. smooth anchor scrolling
   4. loader (0 -> 100, fade, then ep:loaded dispatched on document at fade start)
   Each step is isolated so one broken module cannot break the page. */
(function () {
  'use strict';

  window.Portfolio = window.Portfolio || {};
  var P = window.Portfolio;

  var MODULES = ['initHero', 'initAbout', 'initSkills', 'initProjects', 'initJourney', 'initContact', 'initPalette', 'initSnake'];
  var reduceMQ = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function reducedNow() { return !!(reduceMQ && reduceMQ.matches); }

  function report(label, err) {
    if (window.console) console.error('[Portfolio] ' + label + ' failed:', err);
  }

  function runSafe(label, fn) {
    try {
      fn();
    } catch (err) {
      report(label, err);
    }
  }


  /* ---------- Loader ---------- */
  function runLoader() {
    var body = document.body;
    var loader = document.getElementById('ep-loader');
    var countEl = document.getElementById('ep-loader-count');
    var reduced = reducedNow();

    var COUNT_MS = reduced ? 300 : 6000;   // reference loader is about 6 s; reduced motion jumps quickly
    var HOLD_MS = reduced ? 0 : 900;       // pause at 100% (full name revealed) before the fade
    var FADE_MS = reduced ? 300 : 600;
    var fadeStarted = false;
    var startTime = null;

    // Reference checkpoints (normalised time -> percent): 40% at 1 s, 91% at 5 s, 100% at 6 s.
    // Each segment eases out, so the count slows down near the end.
    var STOPS = [[0, 0], [1 / 6, 0.40], [5 / 6, 0.91], [1, 1]];
    function countAt(t) {
      for (var i = 0; i < STOPS.length - 1; i++) {
        var a = STOPS[i], b = STOPS[i + 1];
        if (t <= b[0]) {
          var u = (t - a[0]) / (b[0] - a[0]);
          var e = 1 - (1 - u) * (1 - u);
          return a[1] + (b[1] - a[1]) * e;
        }
      }
      return 1;
    }

    function setCount(n) {
      if (countEl) countEl.textContent = n + '%';
    }

    // Liquid fill: the surface sits at the level for p (0 to 100, same value as the counter).
    // Front layer scrolls 2.5 waves per 1.6 s; back layer is slower (2.6 s) and fainter.
    // Both sway slightly. Amplitude is zero at 0% and 100%, and the clip is removed at 100%.
    var logoEl = loader ? loader.querySelector('.ep-loader__logo') : null;
    var frontEl = loader ? loader.querySelector('.ep-loader__fill:not(.ep-loader__fill--back)') : null;
    var backEl = loader ? loader.querySelector('.ep-loader__fill--back') : null;

    function wavePath(W, H, level, amp, phase, tilt, waves) {
      var k = 2 * Math.PI * waves / W;
      var d = 'M0 ' + H;
      for (var x = 0; x <= W; x += 6) {
        var y = level + amp * Math.sin(k * x + phase) + tilt * (x / W - 0.5);
        d += ' L' + x.toFixed(1) + ' ' + Math.max(0, Math.min(H, y)).toFixed(1);
      }
      return d + ' L' + W + ' ' + H + ' Z';
    }

    function drawFill(p, secs) {
      if (!frontEl || !logoEl) return;
      if (p >= 100) {
        frontEl.style.clipPath = 'none';
        if (backEl) backEl.style.display = 'none';
        return;
      }
      var W = logoEl.offsetWidth, H = logoEl.offsetHeight;
      if (!W || !H) return;
      var level = H * (1 - p / 100);
      var amp = reduced ? 0 : Math.max(2, H * 0.045) * Math.min(1, p / 15) * Math.min(1, (100 - p) / 10);
      var frontPhase = reduced ? 0 : 2 * Math.PI * secs / 1.6;
      var frontTilt = reduced ? 0 : 3 * Math.sin(2 * Math.PI * secs / 3.1);
      frontEl.style.clipPath = "path('" + wavePath(W, H, level, amp, frontPhase, frontTilt, 2.5) + "')";
      if (backEl) {
        var backPhase = reduced ? 0 : -2 * Math.PI * secs / 2.6 + 1.3;
        var backTilt = reduced ? 0 : -2 * Math.sin(2 * Math.PI * secs / 4.3);
        backEl.style.clipPath = "path('" + wavePath(W, H, level + 2, amp * 0.7, backPhase, backTilt, 2.5) + "')";
      }
    }

    function removeLoader() {
      if (loader) loader.hidden = true;
    }

    function startFade() {
      if (fadeStarted) return;
      fadeStarted = true;
      body.dataset.loading = 'false';
      try {
        document.dispatchEvent(new CustomEvent('ep:loaded'));
      } catch (err) {
        report('ep:loaded dispatch', err);
      }
      if (!loader) return;
      loader.style.transitionDuration = FADE_MS + 'ms';
      loader.classList.add('is-fading');
      window.setTimeout(removeLoader, FADE_MS + 30);
    }

    function tick(now) {
      if (fadeStarted) return;
      if (startTime === null) startTime = now;
      var elapsed = now - startTime;
      var t = Math.min(1, elapsed / COUNT_MS);
      var pct = countAt(t) * 100;
      setCount(Math.round(pct));
      drawFill(pct, elapsed / 1000);
      if (t < 1) {
        window.requestAnimationFrame(tick);
      } else {
        setCount(100);
        drawFill(100, 0);
        window.setTimeout(startFade, HOLD_MS);
      }
    }

    if (!loader) {
      startFade();
      return;
    }

    window.requestAnimationFrame(tick);
    // Watchdog: if frames never arrive (hidden tab, odd browser), finish anyway so the page is never stuck.
    window.setTimeout(function () {
      if (!fadeStarted) {
        setCount(100);
        drawFill(100, 0);
        startFade();
      }
    }, COUNT_MS + 2500);
  }

  /* ---------- Smooth anchor scrolling ---------- */
  function initAnchors() {
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var hash = a.getAttribute('href');
      if (!hash || hash === '#') return;
      var target = null;
      try {
        target = document.getElementById(decodeURIComponent(hash.slice(1)));
      } catch (err) {
        target = null;
      }
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reducedNow() ? 'auto' : 'smooth', block: 'start' });
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', hash);
      }
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    runSafe('initEffects', function () {
      if (typeof P.initEffects === 'function') P.initEffects();
    });

    MODULES.forEach(function (name) {
      runSafe(name, function () {
        if (typeof P[name] === 'function') P[name]();
      });
    });

    runSafe('anchors', initAnchors);
    runSafe('loader', runLoader);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
