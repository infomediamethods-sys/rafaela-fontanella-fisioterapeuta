/* movimento.js — movimento DESTE site, reproduzido de thephysiosphere.co.uk (Kit de Design, seção "Movimento").
   - Herói: entrada escalonada (rótulo .2s, H1 .4s, texto .6s, botões .8s; lado direito em fade 1,2s a .5s).
   - Grupos .surgir: filhos sobem 32px com +0,1s entre irmãos; ao terminar, a classe sai para os hovers voltarem a ter a
     transição própria (lição Guilherme: .revelar no cartão com hover).
   - "Ver mais +" das situações e acordeão das dúvidas abrindo por altura (.45s) com o "+" girando (CSS).
   main.js e base.css não se editam. Funções (Ver mais, acordeão) funcionam com reduced-motion; só a animação some. */
(function () {
  'use strict';
  var reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* "Ver mais +" das situações */
  var mais = document.querySelector('[data-ver-mais]');
  if (mais) {
    var lista = document.getElementById(mais.getAttribute('aria-controls'));
    mais.addEventListener('click', function () {
      var abrir = lista.hidden;
      lista.hidden = !abrir;
      mais.setAttribute('aria-expanded', abrir ? 'true' : 'false');
      mais.textContent = abrir ? 'Ver menos −' : 'Ver mais +';
      if (abrir && !reduzir) {
        Array.prototype.forEach.call(lista.children, function (li, n) {
          li.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
            { duration: 400, delay: n * 60, easing: 'ease', fill: 'backwards' });
        });
      }
    });
  }

  /* Acordeão: abre e fecha por altura */
  document.querySelectorAll('.acordeao details').forEach(function (d) {
    var resumo = d.querySelector('summary');
    var corpo = d.querySelector('.acordeao__resposta');
    resumo.addEventListener('click', function (e) {
      if (reduzir || !corpo.animate) return;
      e.preventDefault();
      if (d.open) {
        var h = corpo.offsetHeight;
        d.classList.add('fechando');
        var a = corpo.animate([{ height: h + 'px' }, { height: '0px' }], { duration: 450, easing: 'cubic-bezier(.25,.1,.25,1)' });
        a.onfinish = function () { d.open = false; d.classList.remove('fechando'); };
      } else {
        d.open = true;
        var alvo = corpo.offsetHeight;
        corpo.animate([{ height: '0px' }, { height: alvo + 'px' }], { duration: 450, easing: 'cubic-bezier(.25,.1,.25,1)' });
      }
    });
  });

  /* Fotos já decodificadas antes de entrar na tela (ajuste de 19/10/2026: rolagem rápida dava tranco quando uma
     foto grande era decodificada no instante em que aparecia). Vale para celular e computador. */
  var predecodificar = function (img) {
    if (!img.decode) return;
    var ir = function () { img.decode().catch(function () {}); };
    if (img.complete && img.naturalWidth) ir(); else img.addEventListener('load', ir, { once: true });
  };
  window.addEventListener('load', function () { document.querySelectorAll('main img').forEach(predecodificar); });

  if (reduzir) return;

  /* Herói: entrada ao carregar */
  var entradas = document.querySelectorAll('.entrar');
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { entradas.forEach(function (el) { el.classList.add('visivel'); }); });
  });

  /* Grupos com escalonamento */
  var grupos = document.querySelectorAll('.surgir');
  if (!('IntersectionObserver' in window)) {
    grupos.forEach(function (g) { g.classList.remove('surgir'); });
    return;
  }
  var obs = new IntersectionObserver(function (itens) {
    itens.forEach(function (it) {
      if (!it.isIntersecting) return;
      var g = it.target;
      g.classList.add('visivel');
      obs.unobserve(g);
      var maior = 0;
      Array.prototype.forEach.call(g.children, function (c) {
        var i = parseFloat(getComputedStyle(c).getPropertyValue('--i')) || 0;
        if (i > maior) maior = i;
      });
      setTimeout(function () { g.classList.remove('surgir', 'visivel'); }, 700 + maior * 100 + 100);
    });
  }, { threshold: 0.12 });
  grupos.forEach(function (g) { obs.observe(g); });
})();
