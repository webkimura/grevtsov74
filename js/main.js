/* Минимальный JS: только то, что нельзя сделать HTML/CSS */
(function () {
  'use strict';

  /* Мобильное меню */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  function closeMenu() {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeMenu();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* Тема: светлая по умолчанию, тёмная по выбору + круговая волна (View Transitions) */
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  function syncToggle() {
    toggle.setAttribute('aria-pressed', root.getAttribute('data-theme') === 'dark' ? 'true' : 'false');
  }
  function applyTheme() {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    if (next === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    try { localStorage.setItem('theme', next); } catch (e) { }
    syncToggle();
  }
  toggle.addEventListener('click', function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduce) { applyTheme(); return; }
    var r = toggle.getBoundingClientRect();
    var x = r.left + r.width / 2, y = r.top + r.height / 2;
    var vt = document.startViewTransition(applyTheme);
    vt.ready.then(function () {
      var maxR = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      document.documentElement.animate(
        { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + maxR + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 450, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(function () { });
  });
  syncToggle();

  /* Актуальный год в подвале */
  document.getElementById('year').textContent = new Date().getFullYear();
})();

/* Одноразовый каскад карточек: волна при первом появлении, далее всегда непрозрачны */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.grid>.card, .case, .steps>li, .flow>li');
  if (reduce || !('IntersectionObserver' in window)) return;
  targets.forEach(function (el) { el.classList.add('js-reveal'); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  targets.forEach(function (el) { io.observe(el); });
})();

/* Sticky-CTA: видна после hero, скрывается у секции контактов */
(function () {
  var bar = document.getElementById('mobile-cta');
  var hero = document.querySelector('.hero');
  var contacts = document.getElementById('contacts');
  if (!bar || !hero || !contacts) return;
  var pastHero = false, atContacts = false;
  function update() { bar.classList.toggle('is-visible', pastHero && !atContacts); }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { pastHero = !e[0].isIntersecting; update(); }, { threshold: 0 }).observe(hero);
    new IntersectionObserver(function (e) { atContacts = e[0].isIntersecting; update(); }, { threshold: 0.1 }).observe(contacts);
  } else {
    pastHero = true; update();
  }
})();

/* theme-color браузера в цвет активной темы */
(function () {
  var meta = document.getElementById('meta-theme');
  var toggle = document.getElementById('theme-toggle');
  if (!meta) return;
  function sync() {
    meta.setAttribute('content', document.documentElement.getAttribute('data-theme') === 'dark' ? '#0D1424' : '#ffffff');
  }
  if (toggle) toggle.addEventListener('click', sync);
  sync();
})();