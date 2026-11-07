/* projects.js - builder 4. Section #work (DESIGN_SPEC C.5).
   Pointer effects, for mouse and pen only (touch never gets them), and never under reduced motion:
   - the glow (.ep-projects__spotlight) moves to the card corner nearest the pointer (left/top 0% or 100%);
   - a pressed-tab 3D look: the card tilts (--rx / --ry) so the corner under the pointer sinks in and the
     opposite sides rise; an inner shadow (--sx / --sy) sits on the pressed corner; the shading
     (--px / --py) follows the pointer. CSS reads these variables and transitions them.
   Pointer moves are throttled to one write per frame.
   The card items also get their own reveal observer (threshold 0), so a card is never left hidden
   when the visitor stops scrolling just short of it. */
(function () {
  'use strict';

  window.Portfolio = window.Portfolio || {};
  var P = window.Portfolio;
  var TILT = 3.5; /* maximum tilt in degrees at a corner */
  var SHADE = 5;  /* maximum inner-shadow offset in px */

  function toArray(list) { return Array.prototype.slice.call(list || []); }

  /* Handlers sit on the item wrapper (the grid cell), which does not move with the card's tilt.
     Listening on the tilting card made the pointer leave and re-enter near the corners (flicker). */
  function attachPointerEffects(item) {
    var card = item.querySelector('.ep-projects__card');
    var glow = card.querySelector('.ep-projects__spotlight');
    var frame = 0;
    var pending = null;

    function write() {
      frame = 0;
      if (!pending) return;
      var r = item.getBoundingClientRect();
      var w = r.width || 1;
      var h = r.height || 1;
      var fx = Math.min(1, Math.max(0, pending.x / w)); /* 0 at the left edge, 1 at the right */
      var fy = Math.min(1, Math.max(0, pending.y / h)); /* 0 at the top, 1 at the bottom */
      if (glow) {
        glow.style.left = fx >= 0.5 ? '100%' : '0%';
        glow.style.top = fy >= 0.5 ? '100%' : '0%';
      }
      card.style.setProperty('--px', (fx * 100).toFixed(1) + '%');
      card.style.setProperty('--py', (fy * 100).toFixed(1) + '%');
      /* Pointer bottom-right: the bottom sinks (rotateX negative), the right side sinks (rotateY positive). */
      card.style.setProperty('--rx', (-(fy - 0.5) * 2 * TILT).toFixed(2) + 'deg');
      card.style.setProperty('--ry', ((fx - 0.5) * 2 * TILT).toFixed(2) + 'deg');
      card.style.setProperty('--sx', ((fx - 0.5) * 2 * SHADE).toFixed(2) + 'px');
      card.style.setProperty('--sy', ((fy - 0.5) * 2 * SHADE).toFixed(2) + 'px');
    }

    function schedule(e) {
      var r = item.getBoundingClientRect();
      pending = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (!frame) frame = window.requestAnimationFrame(write);
    }

    item.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      item.classList.add('is-hover');
      schedule(e);
    });

    item.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      schedule(e);
    });

    item.addEventListener('pointerleave', function () {
      item.classList.remove('is-hover');
    });
  }

  /* Reveal the card items as soon as any part of them enters the view (threshold 0, trigger 10% early).
     effects.js reveals .ep-reveal at 15% visibility; a card whose top sits just below the fold could stay hidden. */
  function revealItems(root) {
    var items = toArray(root.querySelectorAll('.ep-projects__item.ep-reveal'));
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px 10% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  P.initProjects = function initProjects() {
    var root = document.querySelector('.ep-projects');
    if (!root) return;
    revealItems(root);
    var items = toArray(root.querySelectorAll('.ep-projects__item'));
    if (!items.length) return;

    var reduced = P.reducedMotion === true ||
      !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var fine = window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)') : null;
    if (reduced || !fine || !fine.matches) return;

    items.forEach(attachPointerEffects);
  };
})();
