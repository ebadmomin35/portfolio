/* snake.js - builder 6. Cyber Snake modal (DESIGN_SPEC C.8, game rules "final").
   Exposes window.Portfolio.initSnake, openSnake, closeSnake and nothing else.
   openSnake/closeSnake are defined at load time and initialise lazily, so the
   core Ctrl/Cmd+K handler and navbar button work whatever the boot order. */
(function () {
  'use strict';

  window.Portfolio = window.Portfolio || {};
  var P = window.Portfolio;

  var N = 20;                     // grid cells per side
  var START_X = 6, START_Y = 10;  // head position at start (snake of length 3, moving right)
  var START_LEN = 3;
  var POINTS = 10;                // per food (reference: 10, 20, 30 ...)
  var TICK_START = 120;           // ms per step
  var TICK_STEP = 3;              // ms faster per food eaten
  var TICK_MIN = 60;
  var DEATH_MS = 200;             // danger flash before the game over overlay
  var CLOSE_MS = 200;             // close animation length
  var SWIPE_MIN = 24;             // px
  var BEST_KEY = 'ep-snake-best';
  // Colours; FOOD, HEAD and DANGER are overwritten from tokens.css in ensureInit.
  var FOOD_COLOR = '#06b6d4';     // --ep-accent
  var HEAD_COLOR = '#7af2ff';     // --ep-accent-soft
  var DANGER_COLOR = '#ff667f';   // --ep-danger
  var BODY_COLOR = 'rgba(139, 92, 246, 0.9)';

  var DIRS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };
  var KEY_DIR = {
    arrowup: 'up', w: 'up',
    arrowdown: 'down', s: 'down',
    arrowleft: 'left', a: 'left',
    arrowright: 'right', d: 'right'
  };

  var reduceMQ = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var touchMQ = window.matchMedia ? window.matchMedia('(hover: none)') : null;
  function reduced() { return !!(reduceMQ && reduceMQ.matches); }
  function isTouch() { return !!(touchMQ && touchMQ.matches); }

  // Module state
  var inited = false;
  var el = {};
  var ctx = null;
  var bgCanvas = null;
  var cssSize = 0, cell = 0, dpr = 1;

  var state = 'ready';            // ready | running | paused | dying | over
  var snake = [];                 // snake[0] is the head
  var dir = DIRS.right;
  var queue = [];                 // buffered direction changes (max 2)
  var food = null;
  var score = 0, eaten = 0, best = 0;
  var acc = 0, lastT = 0, rafId = 0;
  var deathTimer = 0, closeTimer = 0;
  var lastFocus = null;
  var touchX = 0, touchY = 0, touchActive = false;
  var announceAt = 0, announceTimer = 0;

  /* ---------- Helpers ---------- */
  function q(sel) { return el.dialog.querySelector(sel); }

  function isOpen() { return !!(el.dialog && el.dialog.open); }

  function loadBest() {
    try {
      var v = parseInt(window.localStorage.getItem(BEST_KEY), 10);
      return isFinite(v) && v > 0 ? v : 0;
    } catch (err) {
      return 0;
    }
  }

  function saveBest() {
    try {
      window.localStorage.setItem(BEST_KEY, String(best));
    } catch (err) {
      /* storage blocked or full: keep playing, just do not persist */
    }
  }

  function tickMs() {
    return Math.max(TICK_MIN, TICK_START - TICK_STEP * eaten);
  }

  function roundRectPath(c, x, y, w, h, r) {
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  /* ---------- Game logic ---------- */
  function spawnFood() {
    var free = [];
    var taken = [];
    var i;
    for (i = 0; i < N * N; i++) taken.push(false);
    for (i = 0; i < snake.length; i++) taken[snake[i].y * N + snake[i].x] = true;
    for (i = 0; i < N * N; i++) if (!taken[i]) free.push(i);
    if (!free.length) return null;
    var idx = free[Math.floor(Math.random() * free.length)];
    return { x: idx % N, y: Math.floor(idx / N) };
  }

  // Buffer a direction. Compares against the last buffered direction (or the
  // current one), so a fast double-tap cannot reverse the snake into itself.
  function queueDir(d) {
    var last = queue.length ? queue[queue.length - 1] : dir;
    if (d.x === last.x && d.y === last.y) return;
    if (d.x === -last.x && d.y === -last.y) return;
    if (queue.length >= 2) return;
    queue.push(d);
  }

  function step() {
    if (queue.length) dir = queue.shift();
    var head = snake[0];
    var nx = head.x + dir.x;
    var ny = head.y + dir.y;
    if (nx < 0 || ny < 0 || nx >= N || ny >= N) { die(); return; }

    var grow = !!food && nx === food.x && ny === food.y;
    // The tail cell is vacated this step unless we grow, so it is not a collision.
    var limit = grow ? snake.length : snake.length - 1;
    for (var i = 0; i < limit; i++) {
      if (snake[i].x === nx && snake[i].y === ny) { die(); return; }
    }

    snake.unshift({ x: nx, y: ny });
    if (grow) {
      score += POINTS;
      eaten += 1;
      if (score > best) { best = score; saveBest(); }
      food = spawnFood();
      bump();
      updateScore();
      announce();
      if (!food) { die(); return; }   // board completely filled
    } else {
      snake.pop();
    }
  }

  function die() {
    state = 'dying';
    if (el.live) el.live.textContent = 'Game over. Score ' + score + '.';
    clearTimeout(deathTimer);
    deathTimer = setTimeout(function () {
      deathTimer = 0;
      state = 'over';
      updateScore();
      updateOverlay();
    }, DEATH_MS);
  }

  // Full reset to the start state (overlay shows "PRESS ENTER TO START").
  function reset() {
    clearTimeout(deathTimer);
    deathTimer = 0;
    snake = [];
    for (var i = 0; i < START_LEN; i++) snake.push({ x: START_X - i, y: START_Y });
    dir = DIRS.right;
    queue = [];
    score = 0;
    eaten = 0;
    acc = 0;
    food = spawnFood();
    state = 'ready';
    updateScore();
    updateOverlay();
  }

  // Start, restart (from game over) or resume (from pause).
  function begin() {
    if (state === 'dying' || state === 'running') return;
    if (state === 'over') reset();
    state = 'running';
    acc = 0;
    updateOverlay();
  }

  function pause() {
    if (state === 'running') {
      state = 'paused';
      updateOverlay();
    }
  }

  /* ---------- Rendering ---------- */
  function sizeCanvas() {
    if (!el.board || !el.canvas || !ctx) return;
    var w = el.board.clientWidth;           // excludes the 1px border
    if (!w) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cssSize = w;
    cell = w / N;
    el.canvas.width = Math.round(w * dpr);
    el.canvas.height = Math.round(w * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildBackground();
  }

  // Faint dot grid, drawn once per resize and blitted each frame.
  function buildBackground() {
    bgCanvas = document.createElement('canvas');
    bgCanvas.width = Math.round(cssSize * dpr);
    bgCanvas.height = Math.round(cssSize * dpr);
    var c = bgCanvas.getContext('2d');
    if (!c) { bgCanvas = null; return; }
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (var y = 0; y < N; y++) {
      for (var x = 0; x < N; x++) {
        c.beginPath();
        c.arc((x + 0.5) * cell, (y + 0.5) * cell, 0.9, 0, Math.PI * 2);
        c.fill();
      }
    }
  }

  function draw(now) {
    if (!ctx || !cssSize) return;
    ctx.clearRect(0, 0, cssSize, cssSize);
    if (bgCanvas) ctx.drawImage(bgCanvas, 0, 0, cssSize, cssSize);
    // Start screen: the board shows only the dot grid, no snake or food under the text (B3).
    if (state === 'ready') return;

    // Food: cyan dot, 70% of the cell diameter, glowing. Pulses +/-8% every 900ms.
    if (food) {
      var pulse = reduced() ? 1 : 1 + 0.08 * Math.sin(((now || 0) / 900) * Math.PI * 2);
      var r = cell * 0.35 * pulse;
      ctx.save();
      ctx.shadowColor = FOOD_COLOR;
      ctx.shadowBlur = 12;
      ctx.fillStyle = FOOD_COLOR;
      ctx.beginPath();
      ctx.arc((food.x + 0.5) * cell, (food.y + 0.5) * cell, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Snake: rounded segments, violet body, violet-to-cyan head gradient.
    var dying = state === 'dying';
    var pad = 1.5;
    var size = cell - pad * 2;
    var rad = Math.min(4, size / 2);
    for (var i = snake.length - 1; i >= 0; i--) {
      var s = snake[i];
      var x = s.x * cell + pad;
      var y = s.y * cell + pad;
      ctx.beginPath();
      roundRectPath(ctx, x, y, size, size, rad);
      if (dying) {
        ctx.fillStyle = DANGER_COLOR;
      } else if (i === 0) {
        ctx.fillStyle = HEAD_COLOR;
      } else {
        ctx.fillStyle = BODY_COLOR;
      }
      ctx.fill();
    }
  }

  function updateScore() {
    if (el.score) el.score.textContent = String(score);
    if (el.best) el.best.textContent = String(best);
    if (el.overScore) el.overScore.textContent = 'Final Score: ' + score;
  }

  function bump() {
    if (!el.score || reduced()) return;
    el.score.classList.remove('is-bump');
    void el.score.offsetWidth;          // restart the keyframe
    el.score.classList.add('is-bump');
  }

  // Overlay content per state: start, paused, or game over. Hidden while running or dying.
  function updateOverlay() {
    var touch = isTouch();
    var showStart = state === 'ready' || state === 'paused';
    var showOver = state === 'over';
    if (el.overlay) el.overlay.hidden = !(showStart || showOver);
    if (el.start) el.start.hidden = !showStart;
    if (el.over) el.over.hidden = !showOver;
    if (state === 'ready') {
      if (el.startTitle) el.startTitle.textContent = 'Cyber Snake';
      if (el.startSub) el.startSub.textContent = 'Navigate the neon snake & collect energy orbs!';
      if (el.startBtn) el.startBtn.textContent = 'START GAME';
    } else if (state === 'paused') {
      if (el.startTitle) el.startTitle.textContent = 'Paused';
      if (el.startSub) el.startSub.textContent = touch
        ? 'Tap the board to resume.'
        : 'Press Space or Enter to resume.';
      if (el.startBtn) el.startBtn.textContent = 'RESUME';
    }
    if (el.hint) el.hint.textContent = touch ? 'TAP D-PAD' : 'USE ARROWS / D-PAD';
  }

  /* ---------- Score announcements (throttled to 1s) ---------- */
  function announce() {
    var wait = 1000 - (Date.now() - announceAt);
    if (wait <= 0) { doAnnounce(); return; }
    if (!announceTimer) {
      announceTimer = setTimeout(function () {
        announceTimer = 0;
        doAnnounce();
      }, wait);
    }
  }

  function doAnnounce() {
    announceAt = Date.now();
    var msg = 'Score ' + score;
    if (el.canvas) el.canvas.setAttribute('aria-label', 'Snake board. ' + msg + '.');
    if (el.live) el.live.textContent = msg;
  }

  /* ---------- Loop ---------- */
  function frame(now) {
    rafId = window.requestAnimationFrame(frame);
    if (!lastT) lastT = now;
    var dt = Math.min(now - lastT, 100);
    lastT = now;
    if (state === 'running') {
      acc += dt;
      var guard = 0;
      while (acc >= tickMs() && state === 'running' && guard < 4) {
        acc -= tickMs();
        guard += 1;
        step();
      }
    }
    draw(now);
  }

  function startLoop() {
    if (rafId) return;
    lastT = 0;
    rafId = window.requestAnimationFrame(frame);
  }

  function stopLoop() {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  /* ---------- Input ---------- */
  function onKeyDown(e) {
    if (!isOpen()) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;   // leave browser and core shortcuts alone
    var k = typeof e.key === 'string' ? e.key.toLowerCase() : '';

    var name = KEY_DIR[k];
    if (name) {
      e.preventDefault();                              // no page scroll while open
      if (state === 'ready') begin();
      if (state === 'running' || state === 'paused') queueDir(DIRS[name]);
      return;
    }

    if (k === ' ' || k === 'spacebar') {
      e.preventDefault();                              // no page scroll, no button activation
      if (state === 'running') pause();
      else if (state === 'ready' || state === 'paused' || state === 'over') begin();
      return;
    }

    if (k === 'enter') {
      // Enter starts, restarts or resumes. While running it is left to native
      // button activation (close button, D-pad keys).
      if (state === 'running' || state === 'dying') return;
      e.preventDefault();
      begin();
    }
    // Escape is handled by the dialog's native cancel event.
  }

  function onBoardClick() {
    if (state === 'ready' || state === 'paused') begin();
  }

  function onDpad(e) {
    var b = e.target && e.target.closest ? e.target.closest('[data-dir]') : null;
    if (!b) return;
    var d = DIRS[b.getAttribute('data-dir')];
    if (!d) return;
    if (state === 'ready' || state === 'over') begin();
    if (state === 'running' || state === 'paused') queueDir(d);
  }

  function onTouchStart(e) {
    var t = e.touches && e.touches[0];
    if (!t) return;
    touchX = t.clientX;
    touchY = t.clientY;
    touchActive = true;
  }

  function onTouchEnd(e) {
    if (!touchActive) return;
    touchActive = false;
    var t = e.changedTouches && e.changedTouches[0];
    if (!t) return;
    var dx = t.clientX - touchX;
    var dy = t.clientY - touchY;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_MIN) return;   // a tap, not a swipe
    var d = Math.abs(dx) > Math.abs(dy)
      ? (dx > 0 ? DIRS.right : DIRS.left)
      : (dy > 0 ? DIRS.down : DIRS.up);
    if (state === 'ready') begin();
    if (state === 'running' || state === 'paused') queueDir(d);
  }

  /* ---------- Open / close ---------- */
  function onClosed() {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = 0; }
    document.body.classList.remove('ep-snake-open');
    el.dialog.classList.remove('is-open', 'is-closing');
    stopLoop();
    pause();
    var target = lastFocus;
    lastFocus = null;
    if (target && target.isConnected && typeof target.focus === 'function') {
      target.focus({ preventScroll: true });
    }
  }

  function openSnake() {
    if (!ensureInit()) return;
    var dlg = el.dialog;

    if (dlg.open) {
      // Re-opened during the close animation: cancel the close.
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = 0;
        dlg.classList.remove('is-closing');
        dlg.classList.add('is-open');
      }
      return;
    }

    lastFocus = document.activeElement;
    dlg.showModal();
    document.body.classList.add('ep-snake-open');
    sizeCanvas();
    updateScore();
    updateOverlay();

    dlg.classList.remove('is-closing');
    void dlg.offsetWidth;                  // commit the closed style so the open transition runs
    dlg.classList.add('is-open');
    startLoop();
    // Focus the close button (spec). Enter still starts the game from the ready state.
    if (el.close) el.close.focus({ preventScroll: true });
  }

  function finishClose() {
    if (el.dialog && el.dialog.open) el.dialog.close();
  }

  function closeSnake() {
    if (!inited || !isOpen()) return;
    if (closeTimer) return;                // already closing
    pause();
    el.dialog.classList.remove('is-open');
    el.dialog.classList.add('is-closing');
    if (reduced()) { finishClose(); return; }
    closeTimer = setTimeout(function () {
      closeTimer = 0;
      finishClose();
    }, CLOSE_MS);
  }

  /* ---------- Init (idempotent) ---------- */
  function bind() {
    el.dialog.addEventListener('cancel', function (e) {
      // Escape: run our close animation instead of the native instant close.
      e.preventDefault();
      closeSnake();
    });
    el.dialog.addEventListener('close', onClosed);
    el.close.addEventListener('click', closeSnake);
    el.startBtn.addEventListener('click', begin);
    el.again.addEventListener('click', begin);
    el.board.addEventListener('click', onBoardClick);
    el.dpad.addEventListener('click', onDpad);
    el.board.addEventListener('touchstart', onTouchStart, { passive: true });
    el.board.addEventListener('touchend', onTouchEnd, { passive: true });
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) pause();
    });
    window.addEventListener('resize', function () {
      if (isOpen()) sizeCanvas();
    }, { passive: true });
    if (touchMQ) {
      var onTouchChange = function () { updateOverlay(); };
      if (touchMQ.addEventListener) touchMQ.addEventListener('change', onTouchChange);
      else if (touchMQ.addListener) touchMQ.addListener(onTouchChange);
    }
  }

  function ensureInit() {
    if (inited) return true;
    el.dialog = document.getElementById('ep-snake');
    if (!el.dialog || typeof el.dialog.showModal !== 'function') return false;
    el.canvas = q('.ep-snake__canvas');
    el.board = q('.ep-snake__board');
    el.score = q('.ep-snake__score');
    el.best = q('.ep-snake__best');
    el.hint = q('.ep-snake__hint');
    el.overlay = q('.ep-snake__overlay');
    el.start = q('.ep-snake__start');
    el.startTitle = q('.ep-snake__start-title');
    el.startSub = q('.ep-snake__start-sub');
    el.startBtn = q('.ep-snake__start-btn');
    el.over = q('.ep-snake__over');
    el.overScore = q('.ep-snake__over-score');
    el.again = q('.ep-snake__again');
    el.close = q('.ep-snake__close');
    el.dpad = q('.ep-snake__dpad');
    el.live = q('.ep-snake__live');
    if (!el.canvas || !el.board || !el.close || !el.dpad) return false;
    ctx = el.canvas.getContext ? el.canvas.getContext('2d') : null;
    if (!ctx) return false;

    // Colours from tokens (fallbacks above if a token is missing).
    var cs = window.getComputedStyle(el.dialog);
    var tok = function (name, fallback) {
      var v = cs.getPropertyValue(name).trim();
      return v || fallback;
    };
    FOOD_COLOR = tok('--ep-accent', FOOD_COLOR);
    HEAD_COLOR = tok('--ep-accent-soft', HEAD_COLOR);
    DANGER_COLOR = tok('--ep-danger', DANGER_COLOR);

    best = loadBest();
    bind();
    inited = true;
    reset();
    return true;
  }

  P.initSnake = function initSnake() {
    ensureInit();
  };
  P.openSnake = openSnake;
  P.closeSnake = closeSnake;
})();
