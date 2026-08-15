/* ═══════════════════════════════════════════════════════════════════════
   THE VARIANCE REPORT — behaviour
   No dependencies. Progressive enhancement: without JS every section
   renders in its final, readable state.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root = document.documentElement;
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = motionQuery.matches;
  motionQuery.addEventListener('change', function (e) { reduced = e.matches; });

  /* ── 1 · LOAD CHOREOGRAPHY ─────────────────────────────────────────
     Stagger index is authored in the DOM; wait on webfonts (capped) so
     the Didone masthead never animates mid-swap.                      */
  document.querySelectorAll('[data-seq]').forEach(function (el) {
    el.style.setProperty('--seq', el.getAttribute('data-seq'));
  });

  /* Never gate the reveal on requestAnimationFrame: frame callbacks are
     throttled in background tabs, and the cover would stay invisible until
     the tab is focused. Timers and promises still fire. */
  var started = false;
  function begin() {
    if (started) return;
    started = true;
    root.classList.remove('preload');
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(begin);
    setTimeout(begin, 700);
  } else {
    setTimeout(begin, 0);
  }

  /* ── 2 · SCROLL REVEALS ────────────────────────────────────────────
     One observer, unobserve on entry — nothing animates twice.        */
  var revealTargets = document.querySelectorAll('[data-reveal], [data-delta]');

  if (!('IntersectionObserver' in window) || reduced) {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
    countAllImmediately();
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-in');
        stagger(el);
        el.querySelectorAll('[data-count]').forEach(runCounter);
        obs.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }

  /* children of a revealed block cascade rather than arriving together */
  function stagger(el) {
    var kids = el.querySelectorAll(':scope > ol > li, :scope > ul > li, :scope > .rows > li');
    for (var i = 0; i < kids.length; i++) {
      kids[i].style.setProperty('--d', (i * 55) + 'ms');
    }
  }

  /* ── 3 · COUNTERS ──────────────────────────────────────────────────
     Figures resolve from zero — the model recalculating. Tabular
     numerals keep the width fixed so nothing reflows mid-count.       */
  var nf = new Intl.NumberFormat('en-IN');

  function runCounter(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';

    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    var suffix = el.getAttribute('data-suffix') || '';

    if (reduced) { el.textContent = nf.format(target) + suffix; return; }

    var duration = target > 999 ? 1500 : 1050;
    var start = 0;

    function frame(now) {
      if (!start) start = now;
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);          /* easeOutCubic */
      el.textContent = nf.format(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    el.textContent = nf.format(0) + suffix;
    requestAnimationFrame(frame);
  }

  function countAllImmediately() {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      el.dataset.counted = '1';
      el.textContent = nf.format(parseFloat(el.getAttribute('data-count'))) +
                       (el.getAttribute('data-suffix') || '');
    });
  }

  /* ── 4 · GROUND, RAIL & PROGRESS ───────────────────────────────────
     One rAF-throttled scroll handler drives all three: the fixed
     chrome inverts as the reader crosses a paper/ink boundary, the
     rail marks position, the hairline fills.                          */
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-section]'));
  var railLinks = Array.prototype.slice.call(document.querySelectorAll('[data-rail]'));
  var progressFill = document.getElementById('progressFill');
  var coverImg = document.querySelector('.cover__frame img');
  var cover = document.getElementById('cover');
  var wideQuery = window.matchMedia('(min-width: 900px)');
  var barH = 0;
  var ticking = false;
  var lastGround = '';
  var lastActive = '';

  function measure() {
    barH = parseFloat(getComputedStyle(root).getPropertyValue('--bar-h')) || 52;
  }

  function update() {
    ticking = false;
    var probe = barH + 2;

    /* which section owns the line just below the bar? */
    var current = sections[0];
    for (var i = 0; i < sections.length; i++) {
      var r = sections[i].getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) { current = sections[i]; break; }
      if (r.top > probe) break;
      current = sections[i];
    }

    var ground = current.getAttribute('data-bg') || 'ink';
    if (ground !== lastGround) { root.setAttribute('data-ground', ground); lastGround = ground; }

    var id = current.id;
    if (id !== lastActive) {
      lastActive = id;
      railLinks.forEach(function (a) {
        var on = a.getAttribute('data-rail') === id;
        if (on) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }

    /* progress */
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    if (progressFill) progressFill.style.transform = 'scaleX(' + p + ')';

    /* cover portrait drift — 6% of frame height, desktop only */
    if (coverImg && !reduced && wideQuery.matches) {
      var cr = cover.getBoundingClientRect();
      if (cr.bottom > 0) {
        var t = Math.min(Math.max(-cr.top / window.innerHeight, 0), 1);
        coverImg.style.transform = 'translate3d(0,' + (t * -34).toFixed(2) + 'px,0) scale(1.06)';
      }
    }
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  /* A frame callback queued while the tab is hidden can be dropped, which
     would strand `ticking` at true and freeze the ground inversion, rail and
     progress for the rest of the session. Clear the latch and resync whenever
     the page becomes visible again or is restored from the back/forward cache. */
  function resync() { ticking = false; measure(); update(); }

  measure();
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); onScroll(); }, { passive: true });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) resync(); });
  window.addEventListener('pageshow', resync);
  if (coverImg && !wideQuery.matches) coverImg.style.transform = '';
  wideQuery.addEventListener('change', function (e) {
    if (!e.matches && coverImg) coverImg.style.transform = '';
    onScroll();
  });

  /* ── 5 · CONTENTS SHEET ────────────────────────────────────────────── */
  var sheet = document.getElementById('contentsSheet');
  var sheetBtn = document.getElementById('contentsBtn');
  var sheetClose = document.getElementById('sheetClose');

  if (sheet && sheetBtn) {
    var lastFocus = null;

    var openSheet = function () {
      lastFocus = document.activeElement;
      sheet.hidden = false;
      /* force a reflow so the transition gets a start value — doing this
         synchronously rather than in rAF keeps the panel from opening
         invisible when frame callbacks are throttled (background tab) */
      void sheet.offsetWidth;
      sheet.classList.add('is-open');
      sheetBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      (sheetClose || sheet.querySelector('a')).focus();
    };

    var closeSheet = function () {
      sheet.classList.remove('is-open');
      sheetBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      /* transitionend plus a timeout backstop, so the panel is always
         removed from the tree even if the transition never fires */
      var done = function () {
        clearTimeout(closeTimer);
        sheet.removeEventListener('transitionend', done);
        sheet.hidden = true;
      };
      var closeTimer = setTimeout(done, 500);
      if (reduced) done(); else sheet.addEventListener('transitionend', done);
      if (lastFocus) lastFocus.focus();
    };

    sheetBtn.addEventListener('click', function () {
      sheet.hidden ? openSheet() : closeSheet();
    });
    if (sheetClose) sheetClose.addEventListener('click', closeSheet);
    sheet.addEventListener('click', function (e) { if (e.target === sheet) closeSheet(); });
    sheet.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeSheet); });

    document.addEventListener('keydown', function (e) {
      if (sheet.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); closeSheet(); return; }
      if (e.key !== 'Tab') return;

      /* keep focus inside the open sheet */
      var focusables = sheet.querySelectorAll('a[href], button:not([disabled])');
      if (!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ── 6 · ANCHORS ───────────────────────────────────────────────────
     Honour reduced-motion for in-page jumps and move real focus to the
     destination so keyboard users land where the page scrolled.       */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      if (history.replaceState) history.replaceState(null, '', id);
    });
  });
})();
