/* ===========================================================================
   polish.js — drives the gated scroll-reveal defined in polish.css.

   Deferred, tiny, dependency-free. The head bootstrap has already added
   `html.reveal-on` (only when IntersectionObserver exists and motion is
   allowed) and armed a failsafe timer. Here we clear that failsafe, then
   reveal each major <section> as it enters the viewport. Anything already
   in/above the fold is revealed on load, and a short timeout guarantees
   nothing is ever left hidden.
   =========================================================================== */
(function () {
  "use strict";
  var root = document.documentElement;

  // Let the head bootstrap know JS is alive; stop it from un-gating early.
  if (window.__polRevealFailsafe) {
    clearTimeout(window.__polRevealFailsafe);
    window.__polRevealFailsafe = null;
  }

  // Gating is off (no IO / reduced motion / bootstrap didn't run) => nothing to do.
  if (!root.classList.contains("reveal-on")) return;

  var sections = [].slice.call(document.querySelectorAll("main > section"));
  if (!sections.length) return;

  function reveal(el) { el.classList.add("pol-in"); }

  if (!("IntersectionObserver" in window)) {
    sections.forEach(reveal);
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        reveal(e.target);
        io.unobserve(e.target);
      }
    });
  }, { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  var fold = window.innerHeight * 0.92;
  sections.forEach(function (el) {
    // Reveal immediately what's already in or above the first viewport.
    if (el.getBoundingClientRect().top < fold) reveal(el);
    else io.observe(el);
  });

  // Belt-and-suspenders: never leave a section hidden.
  setTimeout(function () { sections.forEach(reveal); }, 1600);
})();
