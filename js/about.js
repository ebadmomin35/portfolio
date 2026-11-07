/* about.js - builder 3. About section stat counters (DESIGN_SPEC C.3).
   Exposes window.Portfolio.initAbout. The markup already holds the final values,
   so without JS (or with reduced motion) the page shows the finished numbers.
   Counters start once the loader has finished and a cell is 60% visible. */
(function () {
  'use strict';

  window.Portfolio = window.Portfolio || {};
  var P = window.Portfolio;

  var COUNT_MS = 1600;
  var STAGGER_MS = 120;
  var THRESHOLD = 0.6;

  function reducedMotion() {
    if (typeof P.reducedMotion === 'boolean') return P.reducedMotion;
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function format(n) {
    return n.toLocaleString('en-US');
  }

  // Cubic ease-out: 1 - (1 - t)^3
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function countUp(el, target, delay) {
    window.setTimeout(function () {
      var start = null;
      function frame(now) {
        if (start === null) start = now;
        var t = Math.min(1, (now - start) / COUNT_MS);
        el.textContent = format(Math.round(target * easeOutCubic(t)));
        if (t < 1) {
          window.requestAnimationFrame(frame);
        } else {
          el.textContent = format(target);
        }
      }
      window.requestAnimationFrame(frame);
    }, delay);
  }

  P.initAbout = function initAbout() {
    var section = document.getElementById('about');
    if (!section) return;

    var cells = Array.prototype.slice.call(section.querySelectorAll('.ep-stat'));
    if (!cells.length) return;

    // Reduced motion or no IntersectionObserver: leave the final values from the markup.
    if (reducedMotion() || !('IntersectionObserver' in window)) return;

    var targets = {};
    cells.forEach(function (cell, i) {
      var num = cell.querySelector('[data-count]');
      if (!num) return;
      targets[i] = { el: num, value: parseInt(num.getAttribute('data-count'), 10) };
      num.textContent = '0';
    });

    var done = {};
    var io = null;

    function trigger(idx) {
      if (done[idx] || !targets[idx] || isNaN(targets[idx].value)) return;
      done[idx] = true;
      if (io) io.unobserve(cells[idx]);
      countUp(targets[idx].el, targets[idx].value, idx * STAGGER_MS);
    }

    // Fraction of an element that is inside the viewport (0 to 1).
    function visibleRatio(el) {
      var r = el.getBoundingClientRect();
      var area = r.width * r.height;
      if (!area) return 0;
      var w = Math.min(r.right, window.innerWidth) - Math.max(r.left, 0);
      var h = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      if (w <= 0 || h <= 0) return 0;
      return (w * h) / area;
    }

    function start() {
      // Cells already 60% visible at this point are counted right away (no observer wait).
      cells.forEach(function (cell, i) {
        if (targets[i] && visibleRatio(cell) >= THRESHOLD) trigger(i);
      });

      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || entry.intersectionRatio < THRESHOLD) return;
          trigger(cells.indexOf(entry.target));
        });
      }, { threshold: THRESHOLD });

      cells.forEach(function (cell, i) {
        if (targets[i] && !done[i]) io.observe(cell);
      });
    }

    // Entrance animations wait for the loader (ep:loaded fires when it starts to fade).
    if (document.body && document.body.dataset.loading === 'false') {
      start();
    } else {
      document.addEventListener('ep:loaded', start, { once: true });
    }
  };
})();
