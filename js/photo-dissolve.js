/* photo-dissolve.js - hero portrait "disappearing photo" effect.
   Exposes window.Portfolio.initPhotoDissolve.
   A canvas overlay covers the bottom 38 percent of img.ep-hero__photo. Particles are sampled from the
   photo's own pixels, tinted toward violet with some white, rise and fade over 1.5 to 2.5 s. A soft CSS mask
   on the photo's bottom edge lets it break into them. Dust sparkles sit at the top right of the figure.
   Starts 1.5 s after ep:loaded, pauses off-screen. Reduced motion: no DOM changes, photo stays static. */
(function () {
  'use strict';

  window.Portfolio = window.Portfolio || {};
  var P = window.Portfolio;

  var reduceMQ = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  var VIOLET = [139, 92, 246];
  var WHITE = [240, 236, 255];
  var PARTICLE_FRACTION = 0.38;   // canvas covers the bottom 38 percent of the photo
  var START_DELAY_MS = 1500;      // after ep:loaded
  var MAX_PARTICLES = 1400;
  var MAX_DUST = 70;

  function initPhotoDissolve() {
    var reduced = !!(reduceMQ && reduceMQ.matches);
    if (reduced) return null;   // no particles, no mask change: static photo

    var figure = document.querySelector('.ep-hero__figure');
    var photo = figure ? figure.querySelector('img.ep-hero__photo') : null;
    if (!figure || !photo) return null;

    var pCanvas = document.createElement('canvas');
    pCanvas.className = 'ep-photo-dissolve ep-photo-dissolve--particles';
    pCanvas.setAttribute('aria-hidden', 'true');
    var dCanvas = document.createElement('canvas');
    dCanvas.className = 'ep-photo-dissolve ep-photo-dissolve--dust';
    dCanvas.setAttribute('aria-hidden', 'true');

    var pctx = pCanvas.getContext ? pCanvas.getContext('2d') : null;
    var dctx = dCanvas.getContext ? dCanvas.getContext('2d') : null;
    if (!pctx || !dctx) return null;

    figure.appendChild(pCanvas);
    figure.appendChild(dCanvas);

    var state = {
      w: 0, h: 0, dpr: 1,        // particle canvas, CSS px
      dw: 0, dh: 0,              // dust canvas, CSS px
      pixels: null, pixW: 0, pixH: 0, // sampled photo region (RGBA)
      particles: [], dust: [],
      lastT: 0, raf: 0, running: false,
      started: false, visible: true,
      p: 0, scrollQueued: false, lastP: -1   // scroll dissolve amount 0 (top of page) to 1 (hero scrolled away)
    };

    /* ---------- Scroll-linked dissolve ---------- */
    // p = how far the hero has scrolled out of view, from its bounding box (0 at top, 1 when fully gone).
    function readProgress() {
      var hero = document.querySelector('.ep-hero') || figure;
      var rect = hero.getBoundingClientRect();
      if (!rect.height) return state.p;
      return clamp(-rect.top / rect.height, 0, 1);
    }

    // Bottom-up dissolve: the opaque area shrinks upward as p rises; photo opacity is gone by p = 0.9.
    function applyPhotoDissolve() {
      if (!state.started) return;
      var p = state.p;
      if (Math.abs(p - state.lastP) < 0.001) return;
      state.lastP = p;
      var line = 110 - 120 * p;                     // % from the top of the photo; 110 = fully opaque
      var dissolve = 'linear-gradient(to bottom, #000 ' + line.toFixed(1) + '%, transparent ' +
        (line + 18).toFixed(1) + '%)';
      var base = 'linear-gradient(to right, transparent 0, #000 12%, #000 88%, transparent 100%), ' +
        'linear-gradient(to bottom, #000 66%, rgba(0,0,0,0.55) 84%, transparent 100%)';
      var mask = base + ', ' + dissolve;
      photo.style.webkitMaskImage = mask;
      photo.style.maskImage = mask;
      photo.style.webkitMaskComposite = 'source-in';
      photo.style.maskComposite = 'intersect';
      photo.style.opacity = clamp(1 - (p - 0.5) / 0.4, 0, 1).toFixed(3);
    }

    function updateScroll() {
      state.scrollQueued = false;
      state.p = readProgress();
      applyPhotoDissolve();
    }

    function onScroll() {
      if (state.scrollQueued) return;
      state.scrollQueued = true;
      window.requestAnimationFrame(updateScroll);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- Sampling and layout ---------- */
    function sampleRegion() {
      state.pixels = null;
      var pw = Math.round(photo.clientWidth);
      var ph = Math.round(photo.clientHeight);
      if (!pw || !ph || !photo.complete || !photo.naturalWidth) return false;
      var off = document.createElement('canvas');
      off.width = pw;
      off.height = ph;
      var octx = off.getContext('2d', { willReadFrequently: true });
      if (!octx) return false;
      octx.drawImage(photo, 0, 0, pw, ph);
      var y0 = Math.floor(ph * (1 - PARTICLE_FRACTION));
      var rh = ph - y0;
      try {
        state.pixels = octx.getImageData(0, y0, pw, rh).data;
      } catch (err) {
        // Tainted canvas (not served over http): fall back to violet and white particles.
        state.pixels = null;
      }
      state.pixW = pw;
      state.pixH = rh;
      return true;
    }

    function layout() {
      var pw = photo.clientWidth;
      var ph = photo.clientHeight;
      if (!pw || !ph) return false;
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Particle canvas: match the photo's bottom region exactly.
      state.w = pw;
      state.h = Math.max(1, Math.round(ph * PARTICLE_FRACTION));
      pCanvas.width = Math.round(state.w * state.dpr);
      pCanvas.height = Math.round(state.h * state.dpr);
      // Pin the canvas to the photo's own box: bottom 38 percent of the photo, not the figure.
      pCanvas.style.left = photo.offsetLeft + 'px';
      pCanvas.style.top = (photo.offsetTop + ph * (1 - PARTICLE_FRACTION)) + 'px';
      pCanvas.style.bottom = 'auto';
      pCanvas.style.width = pw + 'px';
      pCanvas.style.height = state.h + 'px';
      pctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

      // Dust canvas: sized from the figure.
      var fw = figure.clientWidth;
      var fh = figure.clientHeight;
      state.dw = Math.max(1, Math.round(fw * 0.46));
      state.dh = Math.max(1, Math.round(fh * 0.42));
      dCanvas.width = Math.round(state.dw * state.dpr);
      dCanvas.height = Math.round(state.dh * state.dpr);
      dctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

      sampleRegion();
      return true;
    }

    /* ---------- Particles ---------- */
    function sampleColour(x, y) {
      // x, y in particle-canvas CSS px. Returns [r, g, b, a] from the photo, or null for transparent pixels.
      if (!state.pixels) return [VIOLET[0], VIOLET[1], VIOLET[2], 255];
      var sx = clamp(Math.floor(x * state.pixW / state.w), 0, state.pixW - 1);
      var sy = clamp(Math.floor(y * state.pixH / state.h), 0, state.pixH - 1);
      var i = (sy * state.pixW + sx) * 4;
      var a = state.pixels[i + 3];
      if (a < 60) return null;
      return [state.pixels[i], state.pixels[i + 1], state.pixels[i + 2], a];
    }

    function spawnParticle() {
      // Canvas y of the current dissolve line (null when the line is above the particle layer).
      var lineFrac = (110 - 120 * state.p) / 100;
      var lineY = null;
      var cf = (lineFrac - (1 - PARTICLE_FRACTION)) / PARTICLE_FRACTION;
      if (cf >= 0 && cf <= 1) lineY = cf * state.h;
      for (var attempt = 0; attempt < 3; attempt++) {
        var x = rand(0, state.w);
        // Density rises toward the bottom edge: heavier near y = h.
        var y = state.h - Math.pow(Math.random(), 1.7) * state.h;
        // As p rises, more particles come from the dissolve line itself.
        if (lineY !== null && Math.random() < 0.6 * state.p) {
          y = clamp(lineY + rand(-0.04, 0.08) * state.h, 0, state.h);
        }
        var src = sampleColour(x, y);
        if (!src) continue;
        // Mostly violet, with white highlights. A little of the photo's own colour is kept.
        var tint = Math.random() < 0.15 ? WHITE : VIOLET;
        var k = tint === WHITE ? 0.9 : 0.85;
        var lift = [lerp(src[0], 255, 0.1), lerp(src[1], 255, 0.1), lerp(src[2], 255, 0.1)];
        var base = [
          lerp(lift[0], tint[0], k),
          lerp(lift[1], tint[1], k),
          lerp(lift[2], tint[2], k)
        ];
        state.particles.push({
          x: x,
          y: y,
          vx: rand(-6, 6),
          vy: -rand(0.15, 0.35) * state.h,   // upward lift, scaled to the canvas height
          size: rand(2.0, 3.8),
          life: 0,
          maxLife: rand(1.5, 2.5),
          alpha: rand(0.9, 1),
          col: base
        });
        return;
      }
    }

    function drawParticles(dt) {
      pctx.clearRect(0, 0, state.w, state.h);
      // Spawn at a steady rate: about one particle per 2.5 CSS px of width per second.
      // Rate and brightness follow p: sparse and dim at p = 0 (ambient), denser and brighter as the photo goes.
      var rate = (state.w / 1.6) * (0.5 + 1.5 * state.p);
      var bright = 0.6 + 0.4 * state.p;
      state.spawnAcc = (state.spawnAcc || 0) + rate * dt;
      while (state.spawnAcc >= 1 && state.particles.length < MAX_PARTICLES) {
        spawnParticle();
        state.spawnAcc -= 1;
      }
      if (state.particles.length >= MAX_PARTICLES) state.spawnAcc = 0;

      var alive = [];
      for (var i = 0; i < state.particles.length; i++) {
        var p = state.particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) continue;
        p.x += p.vx * dt + Math.sin(p.life * 2 + p.size) * 2 * dt;
        p.y += p.vy * dt;
        var t = p.life / p.maxLife;
        var fade = Math.min(1, t * 6) * Math.pow(1 - t, 0.8);
        var a = Math.min(1, p.alpha * fade * bright);
        if (a > 0.01 && p.y > -p.size && p.x > -p.size && p.x < state.w + p.size) {
          pctx.fillStyle = 'rgba(' + Math.round(p.col[0]) + ',' + Math.round(p.col[1]) + ',' +
            Math.round(p.col[2]) + ',' + a.toFixed(3) + ')';
          pctx.fillRect(p.x, p.y, p.size, p.size);
        }
        alive.push(p);
      }
      state.particles = alive;
    }

    /* ---------- Dust ---------- */
    function seedDust() {
      state.dust = [];
      for (var i = 0; i < MAX_DUST; i++) {
        state.dust.push({
          x: rand(0, state.dw),
          y: rand(0, state.dh),
          vx: rand(-3, 3),
          vy: rand(-5, -1),
          size: rand(1.2, 2.4),
          phase: rand(0, Math.PI * 2),
          freq: rand(0.6, 1.6),
          white: Math.random() < 0.4
        });
      }
    }

    function drawDust(dt, t) {
      dctx.clearRect(0, 0, state.dw, state.dh);
      for (var i = 0; i < state.dust.length; i++) {
        var d = state.dust[i];
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        if (d.y < -2) d.y = state.dh + 2;
        if (d.x < -2) d.x = state.dw + 2;
        if (d.x > state.dw + 2) d.x = -2;
        var tw = 0.5 + 0.5 * Math.sin(t * d.freq + d.phase);
        var a = 0.25 + 0.6 * tw;
        var c = d.white ? WHITE : VIOLET;
        dctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a.toFixed(3) + ')';
        dctx.fillRect(d.x, d.y, d.size, d.size);
      }
    }

    /* ---------- Loop and visibility ---------- */
    function frame(now) {
      state.raf = 0;
      if (!state.running) return;
      var t = now / 1000;
      var dt = state.lastT ? Math.min(0.05, t - state.lastT) : 0;
      state.lastT = t;
      drawParticles(dt);
      drawDust(dt, t);
      state.raf = window.requestAnimationFrame(frame);
    }

    function start() {
      if (state.running || !state.started || !state.visible || document.hidden) return;
      state.running = true;
      state.lastT = 0;
      state.raf = window.requestAnimationFrame(frame);
    }

    function stop() {
      state.running = false;
      if (state.raf) window.cancelAnimationFrame(state.raf);
      state.raf = 0;
    }

    function begin() {
      if (state.started) return;
      state.started = true;
      if (!layout()) {
        // Layout not ready yet: retry on the next frame.
        state.started = false;
        window.requestAnimationFrame(begin);
        return;
      }
      seedDust();
      figure.classList.add('is-photo-dissolving');
      state.p = readProgress();
      state.lastP = -1;
      applyPhotoDissolve();
      start();
    }

    var resizeQueued = false;
    window.addEventListener('resize', function () {
      if (!state.started || resizeQueued) return;
      resizeQueued = true;
      window.requestAnimationFrame(function () {
        resizeQueued = false;
        layout();
      });
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        state.visible = entries[entries.length - 1].isIntersecting;
        if (state.visible) start(); else stop();
      });
      io.observe(figure);
    }

    // Start 1.5 s after the entrance (ep:loaded), mirroring the hero entrance timing.
    function schedule() {
      window.setTimeout(begin, START_DELAY_MS);
    }
    if (document.body && document.body.getAttribute('data-loading') === 'false') {
      schedule();
    } else {
      document.addEventListener('ep:loaded', schedule, { once: true });
      // Safety net: core always dispatches ep:loaded, but never leave the effect unstarted.
      window.setTimeout(function () { if (!state.started) schedule(); }, 15000);
    }

    return { begin: begin, stop: stop, start: start, layout: layout };
  }

  P.initPhotoDissolve = initPhotoDissolve;

  try {
    initPhotoDissolve();
  } catch (err) {
    if (window.console) console.error('[Portfolio] photo dissolve failed:', err);
  }
})();
