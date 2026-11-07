/* effects.js - core. Global effects (DESIGN_SPEC section D and C.1 navbar/progress).
   Exposes window.Portfolio.initEffects and window.Portfolio.reducedMotion.
   Each sub-effect is isolated in try/catch so one failure cannot stop the others. */
(function () {
  'use strict';

  window.Portfolio = window.Portfolio || {};
  var P = window.Portfolio;

  var reduceMQ = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var fineMQ = window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)') : null;

  P.reducedMotion = !!(reduceMQ && reduceMQ.matches);
  var reduced = P.reducedMotion;

  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function toArray(list) { return Array.prototype.slice.call(list || []); }

  /* ---------- Particles: violet dust drifting up, paused when hidden ---------- */
  function initParticles() {
    var canvas = document.getElementById('ep-particles');
    if (!canvas) return;
    if (reduced) { canvas.hidden = true; return; }
    var ctx = canvas.getContext ? canvas.getContext('2d') : null;
    if (!ctx) { canvas.hidden = true; return; }

    var COLOR = '139, 92, 246';   // brand violet
    var w = 0, h = 0, dpr = 1;
    var particles = [];
    var rafId = 0;

    function particleCount() { return window.innerWidth < 768 ? 36 : 70; }

    function makeParticle(scatter) {
      return {
        x: rand(0, w),
        y: scatter ? rand(0, h) : h + rand(0, 40),
        r: rand(0.6, 1.8),
        a: rand(0.15, 0.55),
        vx: rand(-0.06, 0.06),
        vy: -rand(0.05, 0.25),          // drifts upward
        period: rand(3000, 6000),       // twinkle period in ms
        phase: rand(0, Math.PI * 2)
      };
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = particleCount();
      while (particles.length < n) particles.push(makeParticle(true));
      if (particles.length > n) particles.length = n;
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -4) { p.y = h + 4; p.x = rand(0, w); }
        if (p.x < -4) p.x = w + 4;
        else if (p.x > w + 4) p.x = -4;
        var alpha = clamp(p.a + 0.1 * Math.sin((t / p.period) * Math.PI * 2 + p.phase), 0.05, 0.6);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + COLOR + ', ' + alpha.toFixed(3) + ')';
        ctx.fill();
      }
    }

    function loop(t) {
      draw(t || 0);
      rafId = window.requestAnimationFrame(loop);
    }
    function start() {
      if (!rafId && !document.hidden) rafId = window.requestAnimationFrame(loop);
    }
    function stop() {
      if (rafId) { window.cancelAnimationFrame(rafId); rafId = 0; }
    }

    resize();
    for (var i = 0; i < particles.length; i++) particles[i].y = rand(0, h);
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
    start();
  }

  /* ---------- Section-number parallax ---------- */
  function initParallax() {
    var nodes = toArray(document.querySelectorAll('[data-parallax]'));
    if (!nodes.length) return;
    if (reduced) {
      nodes.forEach(function (el) { el.style.setProperty('--py', '0px'); });
      return;
    }
    var queued = false;
    function update() {
      queued = false;
      var mid = window.innerHeight / 2;
      nodes.forEach(function (el) {
        // Measure the section head (parent), not the numeral itself, so its own translate does not feed back.
        var box = el.parentElement || el;
        var r = box.getBoundingClientRect();
        var py = (r.top + r.height / 2 - mid) * -0.08;
        el.style.setProperty('--py', py.toFixed(1) + 'px');
      });
    }
    function queue() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    }
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue, { passive: true });
    update();
  }

  /* ---------- Scroll reveal (.ep-reveal gets is-visible once) ---------- */
  function initReveal() {
    var items = toArray(document.querySelectorAll('.ep-reveal'));
    if (!items.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Navbar: active link and sliding indicator ---------- */
  function initNav() {
    var pill = document.querySelector('.ep-navbar__pill');
    var list = document.getElementById('ep-nav-list');
    var indicator = document.querySelector('.ep-navbar__indicator');
    var links = list ? toArray(list.querySelectorAll('[data-nav]')) : [];
    var sections = toArray(document.querySelectorAll('[data-nav-section]'));
    if (!pill || !links.length) return;

    var activeId = null;

    function activeLink() {
      for (var i = 0; i < links.length; i++) {
        if (links[i].classList.contains('is-active')) return links[i];
      }
      return null;
    }

    function moveIndicator() {
      if (!indicator) return;
      var link = activeLink();
      if (!link) return;
      var rect = link.getBoundingClientRect();
      if (!rect.width) return;               // hidden (mobile overlay closed)
      var pr = pill.getBoundingClientRect();
      var first = !pill.classList.contains('is-ready');
      if (first) indicator.style.transition = 'none';   // first placement snaps, no slide from 0
      indicator.style.left = (rect.left - pr.left - pill.clientLeft) + 'px';
      indicator.style.width = rect.width + 'px';
      indicator.style.top = (rect.top - pr.top - pill.clientTop) + 'px';
      indicator.style.height = rect.height + 'px';
      if (first) {
        void indicator.offsetWidth;                       // commit the snapped position
        indicator.style.transition = '';
        pill.classList.add('is-ready');
      }
    }

    function setActive(id) {
      if (!id) return;
      activeId = id;
      links.forEach(function (a) {
        var on = a.getAttribute('data-nav') === id;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
      moveIndicator();
    }

    links.forEach(function (a) {
      a.addEventListener('click', function () { setActive(a.getAttribute('data-nav')); });
    });

    if ('IntersectionObserver' in window && sections.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.getAttribute('data-nav-section'));
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
      sections.forEach(function (s) { io.observe(s); });
    }

    if (window.scrollY < 8) setActive('intro');
    window.addEventListener('resize', function () { moveIndicator(); }, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { moveIndicator(); }, function () {});
    }
    // Indicator is measured after layout; re-measure once more after the first frame.
    window.requestAnimationFrame(function () { moveIndicator(); });
  }

  /* ---------- Scroll progress bar ---------- */
  function initProgress() {
    var bar = document.getElementById('ep-progress-bar');
    if (!bar) return;
    var queued = false;
    function update() {
      queued = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    }
    function queue() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    }
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue, { passive: true });
    update();
  }

  /* ---------- Mobile menu overlay (Menu / Close) ---------- */
  function initMenu() {
    var btn = document.getElementById('ep-menu-toggle');
    var list = document.getElementById('ep-nav-list');
    if (!btn || !list) return;

    function isOpen() { return list.classList.contains('is-open'); }
    function open() {
      list.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      btn.textContent = 'Close';
      document.body.classList.add('ep-menu-open');
    }
    function close(returnFocus) {
      list.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = 'Menu';
      document.body.classList.remove('ep-menu-open');
      if (returnFocus) btn.focus();
    }

    btn.addEventListener('click', function () {
      if (isOpen()) close(false); else open();
    });

    // Clicking the overlay backdrop (the list itself) or any link closes it.
    list.addEventListener('click', function (e) {
      if (!isOpen()) return;
      if (e.target === list) { close(false); return; }
      var a = e.target && e.target.closest ? e.target.closest('a') : null;
      if (a) close(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) close(true);
    });

    // Leaving mobile width resets the overlay.
    var desktopMQ = window.matchMedia ? window.matchMedia('(min-width: 1024px)') : null;
    if (desktopMQ) {
      var onChange = function (e) { if (e.matches && isOpen()) close(false); };
      if (desktopMQ.addEventListener) desktopMQ.addEventListener('change', onChange);
      else if (desktopMQ.addListener) desktopMQ.addListener(onChange);
    }
  }

  /* ---------- Cmd+K / Ctrl+K and the navbar button open the command palette ---------- */
  function openPaletteSafe() {
    if (typeof P.openPalette !== 'function') return;
    try {
      P.openPalette();
    } catch (err) {
      if (window.console) console.error('[Portfolio] openPalette failed:', err);
    }
  }

  function initShortcut() {
    var isApple = /Mac|iPhone|iPad|iPod/.test(navigator.platform || '');
    var trigger = document.getElementById('ep-snake-trigger');
    if (trigger) {
      trigger.textContent = isApple ? '⌘K' : 'Ctrl K';
      trigger.setAttribute('aria-label', 'Open command palette');
      trigger.addEventListener('click', openPaletteSafe);
    }
    document.addEventListener('keydown', function (e) {
      if (!(e.metaKey || e.ctrlKey)) return;
      if (typeof e.key !== 'string' || e.key.toLowerCase() !== 'k') return;
      if (typeof P.openPalette !== 'function') return;   // palette not present: leave the browser shortcut alone
      e.preventDefault();
      openPaletteSafe();
    });
  }

  P.initEffects = function initEffects() {
    var steps = [
      initParticles,
      initParallax,
      initReveal,
      initNav,
      initProgress,
      initMenu,
      initShortcut
    ];
    steps.forEach(function (fn) {
      try {
        fn();
      } catch (err) {
        if (window.console) console.error('[Portfolio] effects: ' + fn.name + ' failed:', err);
      }
    });
  };
})();
