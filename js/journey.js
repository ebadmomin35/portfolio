/* journey.js - builder 5. Spec C.6.
   Scroll-linked centre line (scaleY), dots activate as the line reaches them,
   each item reveals once when it enters view. Reduced motion: everything shown at once. */
(function () {
  'use strict';

  window.Portfolio = window.Portfolio || {};
  var P = window.Portfolio;

  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
  function toArray(list) { return Array.prototype.slice.call(list || []); }

  P.initJourney = function initJourney() {
    var section = document.querySelector('.ep-journey');
    if (!section) return;
    var timeline = section.querySelector('.ep-journey__timeline');
    var line = section.querySelector('.ep-journey__line');
    var items = toArray(section.querySelectorAll('.ep-journey__item'));
    if (!timeline || !items.length) return;

    var dots = items.map(function (item) { return item.querySelector('.ep-journey__dot'); });
    var reduced = !!P.reducedMotion;

    if (reduced) {
      items.forEach(function (item) { item.classList.add('is-visible'); });
      dots.forEach(function (dot) { if (dot) dot.classList.add('is-active'); });
      if (line) line.style.transform = 'scaleY(1)';
      return;
    }

    /* Item reveal, once per item */
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      }, { threshold: 0.2 });
      items.forEach(function (item) { io.observe(item); });
    } else {
      items.forEach(function (item) { item.classList.add('is-visible'); });
    }

    /* Line fill: p = fraction of the timeline scrolled past the viewport centre.
       The line's leading end sits at the viewport centre; dots above it are active. */
    var queued = false;
    function update() {
      queued = false;
      var r = timeline.getBoundingClientRect();
      var mid = window.innerHeight / 2;
      var p = r.height > 0 ? clamp((mid - r.top) / r.height, 0, 1) : 0;
      if (line) line.style.transform = 'scaleY(' + p.toFixed(4) + ')';
      var lineEnd = r.top + r.height * p;
      dots.forEach(function (dot) {
        if (!dot) return;
        var dr = dot.getBoundingClientRect();
        var cy = dr.top + dr.height / 2;
        dot.classList.toggle('is-active', cy <= lineEnd);
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
  };
})();
