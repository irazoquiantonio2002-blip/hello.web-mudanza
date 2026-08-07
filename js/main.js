/* ==========================================================================
   MUDANZAS CRUZ — main.js
   Loader, navegación, animaciones scroll, typewriter, contadores,
   partículas, parallax y envío del formulario a WhatsApp.
   ========================================================================== */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '525510598484';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    document.body.classList.add('loading');
    runLoader();
    setupNavbar();
    setupMobileMenu();
    buildMarquee();
    setupRevealObserver();
    setupWordReveal();
    typewriterHero();
    setupCounters();
    setupParallax();
    setupParticles('hero-canvas', { density: 0.00009, colorA: '213,0,50', colorB: '0,65,180', link: true });
    setupParticles('stats-canvas', { density: 0.00006, colorA: '213,0,50', colorB: '0,65,180', link: false });
    setupParticles('cta-particles', { density: 0.00006, colorA: '255,255,255', colorB: '213,0,50', link: false });
    setupWhatsAppForm();
    document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
  }

  /* ---------------- LOADER ---------------- */
  function runLoader() {
    var loader = document.getElementById('loader');
    var shutter = document.getElementById('loader-shutter');
    var fill = document.querySelector('.loader-bar-fill');
    if (!loader) { document.body.classList.add('loaded'); return; }

    var progress = 0;
    var timer = setInterval(function () {
      progress += Math.random() * 14;
      if (progress > 96) progress = 96;
      if (fill) fill.style.width = progress + '%';
    }, 170);

    window.addEventListener('load', finish);
    // Nunca dejar la pantalla en blanco: si algo tarda, forzamos cierre a los 5.5s.
    var safety = setTimeout(finish, 5500);

    var done = false;
    function finish() {
      if (done) return;
      done = true;
      clearTimeout(safety);
      clearInterval(timer);
      if (fill) fill.style.width = '100%';

      setTimeout(function () {
        loader.classList.add('is-hidden');
        if (shutter) shutter.classList.add('is-lifted');
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
        setTimeout(function () {
          loader.style.display = 'none';
          if (shutter) shutter.style.display = 'none';
        }, 1500);
      }, 480);
    }
  }

  /* ---------------- NAVBAR ---------------- */
  function setupNavbar() {
    var nav = document.getElementById('navbar');
    if (!nav) return;
    var toggle = function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });

    var links = document.querySelectorAll('.nav-links a[href^="#"]');
    var sections = Array.prototype.map.call(links, function (a) {
      return document.querySelector(a.getAttribute('href'));
    }).filter(Boolean);

    function onScrollSpy() {
      var pos = window.scrollY + 160;
      var current = sections[0];
      sections.forEach(function (sec) { if (sec.offsetTop <= pos) current = sec; });
      links.forEach(function (a) {
        a.classList.toggle('active', current && a.getAttribute('href') === '#' + current.id);
      });
    }
    window.addEventListener('scroll', onScrollSpy, { passive: true });
    onScrollSpy();
  }

  /* ---------------- MOBILE MENU ---------------- */
  function setupMobileMenu() {
    var btn = document.getElementById('hamburger');
    var menu = document.getElementById('mob-menu');
    var backdrop = document.getElementById('mob-backdrop');
    if (!btn || !menu) return;

    function close() {
      btn.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      backdrop && backdrop.classList.remove('open');
      document.body.classList.remove('lock');
    }
    function open() {
      btn.setAttribute('aria-expanded', 'true');
      menu.classList.add('open');
      backdrop && backdrop.classList.add('open');
      document.body.classList.add('lock');
    }
    btn.addEventListener('click', function () {
      menu.classList.contains('open') ? close() : open();
    });
    backdrop && backdrop.addEventListener('click', close);
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
  }

  /* ---------------- MARQUEE ---------------- */
  function buildMarquee() {
    var el = document.getElementById('marquee');
    if (!el) return;
    var items = [
      'Mudanzas Residenciales', 'Mudanzas Comerciales', 'Embalaje Profesional', 'Manejo de Carga Pesada',
      'Cobertura CDMX', 'Área Metropolitana', 'Atención 24/7', 'Sin Estrés ni Sorpresas'
    ];
    var html = '';
    for (var r = 0; r < 2; r++) {
      items.forEach(function (t) { html += '<span>' + t + ' <i class="fa-solid fa-circle"></i></span>'; });
    }
    el.innerHTML = html;
  }

  /* ---------------- SCROLL REVEAL ---------------- */
  function setupRevealObserver() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    items.forEach(function (item) { io.observe(item); });
  }

  function setupWordReveal() {
    var titles = document.querySelectorAll('.word-reveal');
    titles.forEach(function (title) {
      var text = title.textContent;
      title.innerHTML = text.split(' ').map(function (w, i) {
        return '<span style="transition-delay:' + (i * 0.05) + 's">' + w + '&nbsp;</span>';
      }).join('');
    });
    if (!titles.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    titles.forEach(function (t) { io.observe(t); });
  }

  /* ---------------- HERO TYPEWRITER ---------------- */
  function typewriterHero() {
    var lines = document.querySelectorAll('.hero-title .line > span');
    if (!lines.length) return;

    lines.forEach(function (span, i) {
      setTimeout(function () {
        span.style.transition = 'transform .95s cubic-bezier(.16,.84,.44,1)';
        span.style.transform = 'translateY(0)';
      }, 900 + i * 260);
    });

    var accent = document.querySelector('.hero-title .accent');
    if (!accent) return;
    var full = accent.getAttribute('data-text') || accent.textContent;
    accent.setAttribute('data-text', full);

    setTimeout(function () {
      accent.textContent = '';
      var caret = document.createElement('span');
      caret.className = 'type-caret';
      caret.textContent = ' ';
      accent.appendChild(caret);
      var i = 0;
      var typer = setInterval(function () {
        accent.insertBefore(document.createTextNode(full[i]), caret);
        i++;
        if (i >= full.length) { clearInterval(typer); setTimeout(function () { caret.remove(); }, 1600); }
      }, 65);
    }, 900 + lines.length * 260 + 200);
  }

  /* ---------------- COUNTERS ---------------- */
  function setupCounters() {
    var nums = document.querySelectorAll('.stat-num[data-count]');
    if (!nums.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io.observe(n); });
  }

  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = (el.getAttribute('data-count').split('.')[1] || '').length;
    var duration = 1800;
    var startTime = null;
    var textNode = el.querySelector('.count-val') || el;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      textNode.textContent = decimals ? value.toFixed(decimals) : Math.round(value);
      if (progress < 1) requestAnimationFrame(step);
      else textNode.textContent = decimals ? target.toFixed(decimals) : target;
    }
    requestAnimationFrame(step);
  }

  /* ---------------- PARALLAX (fixed con movimiento real, cross-device) ---------------- */
  function setupParallax() {
    var layers = Array.prototype.slice.call(document.querySelectorAll('.hero-bg, .why-bg, .stats-bg, .cta-band-bg'));
    if (!layers.length) return;
    var ticking = false;

    function update() {
      var vh = window.innerHeight;
      layers.forEach(function (layer) {
        var rect = layer.parentElement.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        var progress = (rect.top) / vh;
        var shift = progress * 60;
        layer.style.transform = 'translateY(' + shift.toFixed(1) + 'px) scale(1.12)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------------- PARTICULAS ---------------- */
  function setupParticles(canvasId, opts) {
    var canvas = document.getElementById(canvasId);
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var w, h, dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      var parent = canvas.parentElement;
      w = parent.offsetWidth; h = parent.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.min(Math.round(w * h * opts.density), 90);
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w, y: Math.random() * h,
          r: Math.random() * 1.6 + 0.6,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          c: Math.random() > 0.5 ? opts.colorA : opts.colorB,
          a: Math.random() * 0.5 + 0.25
        });
      }
    }

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(function (p) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + p.c + ',' + p.a + ')';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      if (opts.link) {
        for (var i = 0; i < particles.length; i++) {
          for (var j = i + 1; j < particles.length; j++) {
            var a = particles[i], b = particles[j];
            var dx = a.x - b.x, dy = a.y - b.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              ctx.strokeStyle = 'rgba(213,0,50,' + (0.12 * (1 - dist / 120)) + ')';
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
          }
        }
      }
      if (!reduceMotion) requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
  }

  /* ---------------- FORMULARIO -> WHATSAPP ---------------- */
  function setupWhatsAppForm() {
    var form = document.getElementById('wa-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (document.getElementById('f-name') || {}).value || '';
      var interest = (document.getElementById('f-interest') || {}).value || '';
      var msg = (document.getElementById('f-msg') || {}).value || '';

      var text = 'Hola, soy ' + name + '. Quiero solicitar: ' + interest + '. Detalle de mi mudanza: ' + msg;
      var url = 'https://api.whatsapp.com/send/?phone=' + WHATSAPP_NUMBER + '&text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener');
    });
  }
})();
