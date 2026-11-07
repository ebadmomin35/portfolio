/* contact.js - builder 5. Spec C.7 and Flag G-13.
   Terminal form: validates the four fields, then opens a prefilled mailto: link.
   No backend. The form also works without JS (native validation, mailto form action). */
(function () {
  'use strict';

  window.Portfolio = window.Portfolio || {};
  var P = window.Portfolio;

  var MAIL = 'ebadarmanmomin@gmail.com';
  var READY = 'Ready to send.';
  var TYPE_MS = 30;        // typing speed for the status line
  var RESET_MS = 3000;     // how long "Opening your mail app..." stays before it resets
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  P.initContact = function initContact() {
    var root = document.querySelector('.ep-contact');
    if (!root) return;
    var form = document.getElementById('ep-contact-form');
    var terminal = root.querySelector('.ep-contact__terminal');
    var statusWrap = root.querySelector('.ep-contact__status');
    var statusEl = root.querySelector('[data-status]');
    if (!form || !statusWrap || !statusEl) return;
    var submit = form.querySelector('.ep-contact__submit');
    var reduced = !!P.reducedMotion;

    var typeTimer = 0;
    var typeToken = 0;
    var resetTimer = 0;

    // JS does validation itself so it can show the custom messages.
    form.noValidate = true;

    function field(name) { return form.querySelector('[data-field="' + name + '"]'); }
    function fieldWrap(input) { return input ? input.closest('.ep-contact__field') : null; }

    /* ---------- Status line (typed, 30ms per character) ---------- */
    function typeText(text) {
      var token = ++typeToken;
      window.clearTimeout(typeTimer);
      if (reduced) {
        statusEl.textContent = text;
        return;
      }
      var i = 0;
      statusEl.textContent = '';
      (function step() {
        if (token !== typeToken) return;
        i += 1;
        statusEl.textContent = text.slice(0, i);
        if (i < text.length) typeTimer = window.setTimeout(step, TYPE_MS);
      })();
    }

    function setStatus(text, tone) {
      statusWrap.classList.remove('is-error', 'is-success');
      if (tone) statusWrap.classList.add(tone);
      typeText(text);
    }

    /* ---------- Validation ---------- */
    function markError(input, on) {
      var wrap = fieldWrap(input);
      if (wrap) wrap.classList.toggle('is-error', on);
      if (input) input.setAttribute('aria-invalid', on ? 'true' : 'false');
    }

    function clearErrors() {
      toArray(form.querySelectorAll('.ep-contact__field.is-error')).forEach(function (wrap) {
        wrap.classList.remove('is-error');
      });
      toArray(form.querySelectorAll('[aria-invalid="true"]')).forEach(function (el) {
        el.setAttribute('aria-invalid', 'false');
      });
    }

    // Returns the first failing field and its message, or null.
    function firstError() {
      var name = field('name');
      var email = field('email');
      var message = field('message');
      if (!name.value.trim()) return { input: name, text: 'Please enter your name.' };
      if (!EMAIL_RE.test(email.value.trim())) return { input: email, text: 'Please enter a valid email.' };
      if (message.value.trim().length < 10) return { input: message, text: 'Message needs at least 10 characters.' };
      return null;
    }

    function toArray(list) { return Array.prototype.slice.call(list || []); }

    /* ---------- Submit ---------- */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.classList.contains('is-sending')) return;

      clearErrors();
      var err = firstError();
      if (err) {
        markError(err.input, true);
        setStatus(err.text, 'is-error');
        err.input.focus();
        return;
      }

      var name = field('name').value.trim();
      var email = field('email').value.trim();
      var subject = field('subject').value.trim() || ('Portfolio enquiry from ' + name);
      var message = field('message').value.trim();
      var body = name + ' (' + email + ')\r\n\r\n' + message;
      var url = 'mailto:' + MAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      setStatus('Opening your mail app...', 'is-success');
      form.classList.add('is-sending');
      if (submit) submit.disabled = true;

      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(function () {
        form.classList.remove('is-sending');
        if (submit) submit.disabled = false;
        setStatus(READY, '');
      }, RESET_MS);

      window.location.href = url;
    });

    /* Editing a field clears its error; when no errors remain the status goes back to ready. */
    form.addEventListener('input', function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      var wrap = fieldWrap(t);
      if (wrap && wrap.classList.contains('is-error')) markError(t, false);
      if (statusWrap.classList.contains('is-error') && !form.querySelector('.ep-contact__field.is-error')) {
        setStatus(READY, '');
      }
    });

    /* ---------- Entrance: type "Ready to send." when the terminal comes into view ---------- */
    if (!reduced && terminal && 'IntersectionObserver' in window) {
      statusEl.textContent = '';
      var io = new IntersectionObserver(function (entries) {
        if (!entries[0] || !entries[0].isIntersecting) return;
        io.disconnect();
        typeText(READY);
      }, { threshold: 0.4 });
      io.observe(terminal);
    }
  };
})();
