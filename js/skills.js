/* skills.js - builder 4. Section #skills (DESIGN_SPEC C.4).
   Marquee rows are CSS-driven. This module only:
   1. clones each row's chip list once (second copy aria-hidden) so the translate(-50%) loop is seamless,
   2. pauses rows that are off screen (IntersectionObserver toggles .is-paused),
   3. flashes the hover state on chip tap for touch devices (.is-hover).
   Under reduced motion no clone is needed (CSS shows the static wrapped rows) and no observer runs. */
(function () {
  'use strict';

  window.Portfolio = window.Portfolio || {};
  var P = window.Portfolio;

  function toArray(list) { return Array.prototype.slice.call(list || []); }

  function prefersReduced() {
    if (P.reducedMotion === true) return true;
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function cloneTracks(rows) {
    rows.forEach(function (row) {
      var track = row.querySelector('.ep-skills__track');
      if (!track || track.getAttribute('data-cloned') === 'true') return;
      toArray(track.children).forEach(function (li) {
        var copy = li.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        track.appendChild(copy);
      });
      track.setAttribute('data-cloned', 'true');
    });
  }

  function pauseOffscreen(rows) {
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('is-paused', !entry.isIntersecting);
      });
    }, { threshold: 0 });
    rows.forEach(function (row) { io.observe(row); });
  }

  function touchFlash(root) {
    root.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'touch') return;
      var chip = e.target && e.target.closest ? e.target.closest('.ep-skills__chip') : null;
      if (!chip) return;
      chip.classList.add('is-hover');
      window.setTimeout(function () { chip.classList.remove('is-hover'); }, 900);
    }, { passive: true });
  }

  P.initSkills = function initSkills() {
    var root = document.querySelector('.ep-skills');
    if (!root) return;
    var rows = toArray(root.querySelectorAll('.ep-skills__row'));
    if (!rows.length) return;

    var reduced = prefersReduced();
    if (!reduced) {
      cloneTracks(rows);
      pauseOffscreen(rows);
    }
    touchFlash(root);
  };
})();
