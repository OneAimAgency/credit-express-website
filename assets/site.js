/* Credit Express v3 · shared behaviour: WhatsApp routing, navigation, booking picker, phone action bar, reveals. */
(function(){
  var root = document.documentElement;
  /* WhatsApp line: main business number from the current live site (to confirm with the client) */
  var PHONE = '17868199447';
  /* When the real booking system exists, put its link here and "Reservar consulta" goes straight to it. */
  var BOOKING_URL = '';
  var MSG = {
    general:'Hola, quiero agendar mi consulta gratis con Credit Express',
    specialist:'Hola, quiero hablar con un especialista de Credit Express',
    decode:'Hola, quiero que me ayuden a entender mi reporte de crédito',
    repair:'Hola, me interesa la reparación de crédito',
    rebuild:'Hola, me interesa la reconstrucción y el monitoreo de mi crédito',
    debt:'Hola, necesito ayuda con deudas, cobradores o bancarrota',
    loans:'Hola, quiero prepararme para un préstamo o financiamiento',
    vehicle:'Hola, quiero prepararme para financiar un auto, moto, jet ski o casa',
    referral:'Hola, quiero información del programa de referidos',
    team:'Hola, quiero hablar con el equipo de Credit Express'
  };
  function wa(text){ return 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(text); }
  document.querySelectorAll('[data-wa]').forEach(function(a){ a.href = wa(MSG[a.dataset.wa] || MSG.general); a.target = '_blank'; a.rel = 'noopener'; });

  /* Servicios mega menu */
  document.querySelectorAll('.dd').forEach(function(dd){
    var btn = dd.querySelector('button'), menu = dd.querySelector('.mega'), t;
    function open(v){ btn.setAttribute('aria-expanded', String(v)); menu.hidden = !v; }
    btn.addEventListener('click', function(){ open(menu.hidden); });
    dd.addEventListener('mouseenter', function(){ if (matchMedia('(hover:hover)').matches){ clearTimeout(t); open(true); } });
    dd.addEventListener('mouseleave', function(){ if (matchMedia('(hover:hover)').matches){ t = setTimeout(function(){ open(false); }, 200); } });
    dd.addEventListener('keydown', function(e){ if (e.key === 'Escape'){ open(false); btn.focus(); } });
    document.addEventListener('click', function(e){ if (!dd.contains(e.target)) open(false); });
    if (location.hash === '#services') open(true);
  });

  /* phone menu */
  var burger = document.querySelector('.burger'), mnav = document.getElementById('mnav');
  function menu(v){ burger.setAttribute('aria-expanded', String(v)); mnav.hidden = !v; document.body.style.overflow = v ? 'hidden' : ''; }
  burger.addEventListener('click', function(){ menu(mnav.hidden); });
  mnav.addEventListener('click', function(e){ if (e.target.closest('a')) menu(false); });
  addEventListener('keydown', function(e){ if (e.key === 'Escape' && !mnav.hidden){ menu(false); burger.focus(); } });
  addEventListener('resize', function(){ if (innerWidth > 980 && !mnav.hidden) menu(false); });
  if (location.hash === '#menu') menu(true);

  /* links waiting on client info */
  var note = document.getElementById('soon-note'), nt;
  document.addEventListener('click', function(e){
    var a = e.target.closest('a[data-soon]'); if (!a) return;
    e.preventDefault(); note.hidden = false; clearTimeout(nt); nt = setTimeout(function(){ note.hidden = true; }, 3200);
  });

  /* prototype notes */
  var tg = document.getElementById('notes-toggle');
  function notes(on){ root.classList.toggle('notes-off', !on); tg.setAttribute('aria-pressed', String(on)); tg.textContent = 'Notas: ' + (on ? 'ON' : 'OFF'); }
  tg.addEventListener('click', function(){ notes(root.classList.contains('notes-off')); });
  /* developer notes only with ?notes=1 */
  if (!/[?&]notes=1/.test(location.search)) tg.hidden = true; else notes(true);

  /* calm reveal, once */
  var rv = document.querySelectorAll('.rv');
  if (root.classList.contains('static') || !('IntersectionObserver' in window)) rv.forEach(function(el){ el.classList.add('in'); });
  else { var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin:'0px 0px -8% 0px' }); rv.forEach(function(el){ io.observe(el); }); }

  /* phone action bar: after the first screen, hidden over the closing section */
  var bar = document.querySelector('.abar'), close = document.querySelector('.close') || document.querySelector('.ft');
  function barUpdate(){ bar.classList.toggle('on', scrollY > innerHeight * .5 && close.getBoundingClientRect().top > innerHeight * .85); }
  addEventListener('scroll', barUpdate, { passive:true }); barUpdate();

  /* booking picker: Monday–Saturday, 9 a.m.–7 p.m. starts (office closes at 8) */
  var DAYS = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  var MON = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  document.querySelectorAll('[data-book]').forEach(function(box){
    var daysEl = box.querySelector('.days'), timesEl = box.querySelector('.times'), go = box.querySelector('.book-go'), label = go.querySelector('span');
    var pick = { d:null, t:null }, d = new Date(), list = [];
    d.setHours(0,0,0,0);
    while (list.length < 6){ d.setDate(d.getDate() + 1); if (d.getDay() !== 0) list.push(new Date(d)); }
    list.forEach(function(x, i){
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role','radio'); b.setAttribute('aria-checked','false');
      b.innerHTML = '<small>' + DAYS[x.getDay()].slice(0,3) + '</small><b>' + x.getDate() + '</b><small>' + MON[x.getMonth()] + '</small>';
      b.addEventListener('click', function(){ pick.d = x; mark(daysEl, b); update(); });
      daysEl.appendChild(b);
    });
    for (var h = 9; h <= 19; h++){
      (function(h){
        var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role','radio'); b.setAttribute('aria-checked','false');
        var txt = ((h + 11) % 12 + 1) + ':00 ' + (h < 12 ? 'a. m.' : 'p. m.');
        b.textContent = txt; b.addEventListener('click', function(){ pick.t = txt; mark(timesEl, b); update(); });
        timesEl.appendChild(b);
      })(h);
    }
    function mark(group, b){ group.querySelectorAll('button').forEach(function(x){ x.setAttribute('aria-checked', String(x === b)); }); }
    function update(){
      var ready = pick.d && pick.t;
      go.setAttribute('aria-disabled', String(!ready));
      if (!ready){ label.textContent = pick.d ? 'Ahora elige la hora' : 'Elige un día y una hora'; go.href = '#'; return; }
      var when = DAYS[pick.d.getDay()] + ' ' + pick.d.getDate() + ' de ' + MON[pick.d.getMonth()] + ' a las ' + pick.t;
      label.textContent = 'Reservar consulta · ' + when;
      if (BOOKING_URL){ go.href = BOOKING_URL; }
      else { go.href = wa('Hola, quiero reservar mi consulta gratis con Credit Express para el ' + when + '. Mi nombre es: '); go.target = '_blank'; go.rel = 'noopener'; }
    }
    go.addEventListener('click', function(e){ if (go.getAttribute('aria-disabled') === 'true'){ e.preventDefault(); daysEl.querySelector('button').focus(); } });
  });
})();
/* Así trabajamos: the counter follows the step you are reading */
(function(){
  var now = document.querySelector('[data-now]'), steps = document.querySelectorAll('.how-steps li');
  if (!steps.length || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ steps.forEach(function(s){ s.classList.toggle('on', s === e.target); }); if (now) now.textContent = e.target.dataset.n; } }); }, { rootMargin:'-45% 0px -45% 0px' });
  steps.forEach(function(s){ io.observe(s); });
})();

/* booking tabs: Reservar · WhatsApp · Llamar */
(function(){
  document.querySelectorAll('.tabs').forEach(function(list){
    var tabs = [].slice.call(list.querySelectorAll('[role="tab"]'));
    function sel(t){ tabs.forEach(function(x){ var on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; document.getElementById(x.getAttribute('aria-controls')).hidden = !on; }); }
    tabs.forEach(function(t, i){
      t.addEventListener('click', function(){ sel(t); });
      t.addEventListener('keydown', function(e){ var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (d){ e.preventDefault(); var n = tabs[(i + d + tabs.length) % tabs.length]; sel(n); n.focus(); } });
    });
  });
})();
/* swipe galleries: native swipe on touch, drag + arrows + keys with a mouse, never automatic */
(function(){
  var still = document.documentElement.classList.contains('static');
  document.querySelectorAll('[data-carousel]').forEach(function(tr){
    var box = tr.closest('section') || document, items = [].slice.call(tr.children);
    var prev = box.querySelector('.prev'), next = box.querySelector('.next'), count = box.querySelector('.count b');
    var pos = function(i){ return items[i].offsetLeft - items[0].offsetLeft; };
    var cur = function(){ var x = tr.scrollLeft, b = 0, d = Infinity; items.forEach(function(el, i){ var dd = Math.abs(pos(i) - x); if (dd < d){ d = dd; b = i; } }); return b; };
    var go = function(i){ i = Math.max(0, Math.min(items.length - 1, i)); tr.scrollTo({ left:pos(i), behavior: still ? 'auto' : 'smooth' }); };
    var sync = function(){ if (count) count.textContent = String(cur() + 1).padStart(2, '0'); if (prev) prev.disabled = tr.scrollLeft < 8; if (next) next.disabled = tr.scrollLeft > tr.scrollWidth - tr.clientWidth - 8; };
    if (prev) prev.addEventListener('click', function(){ go(cur() - 1); });
    if (next) next.addEventListener('click', function(){ go(cur() + 1); });
    tr.addEventListener('scroll', sync, { passive:true });
    tr.addEventListener('keydown', function(e){ if (e.key === 'ArrowRight'){ e.preventDefault(); go(cur() + 1); } if (e.key === 'ArrowLeft'){ e.preventDefault(); go(cur() - 1); } });
    var sx = 0, sl = 0, on = false, mv = 0, st = 0;
    tr.addEventListener('pointerdown', function(e){ if (e.pointerType !== 'mouse' || e.button !== 0) return; on = true; mv = 0; sx = e.clientX; sl = tr.scrollLeft; st = cur(); tr.classList.add('drag'); tr.setPointerCapture(e.pointerId); });
    tr.addEventListener('pointermove', function(e){ if (on){ mv = e.clientX - sx; tr.scrollLeft = sl - mv; } });
    var end = function(){ if (!on) return; on = false; tr.classList.remove('drag'); go(Math.abs(mv) > 50 ? st + (mv < 0 ? 1 : -1) : st); };
    tr.addEventListener('pointerup', end); tr.addEventListener('pointercancel', end);
    sync();
  });
})();
