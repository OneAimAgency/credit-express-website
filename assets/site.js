/* Credit Express v3 · shared behaviour: WhatsApp routing, navigation, booking picker, phone action bar, reveals. */
(function(){
  var root = document.documentElement;
  /* WhatsApp line: main business number from the current live site (to confirm with the client) */
  var PHONE = '17867361427';
  /* When the real booking system exists, put its link here and "Reservar consulta" goes straight to it. */
  var BOOKING_URL = '';
  var MSG = {
    general:'Hola Erick, quiero agendar mi consulta gratis con Credit Express.',
    specialist:'Hola Erick, quiero hablar con un especialista de Credit Express.',
    decode:'Hola Erick, me interesa su ayuda. Quiero entender mi reporte de crédito.',
    repair:'Hola Erick, me interesa su ayuda. Quiero reparar mi crédito.',
    rebuild:'Hola Erick, me interesa su ayuda. Quiero reconstruir mi crédito y darle seguimiento.',
    debt:'Hola Erick, me interesa su ayuda. Necesito ayuda con deudas o cobradores.',
    loans:'Hola Erick, me interesa su ayuda. Quiero prepararme para un préstamo o financiamiento.',
    vehicle:'Hola Erick, me interesa su ayuda. Quiero prepararme para financiar lo que quiero comprar.',
    referral:'Hola Erick, me interesa su ayuda. Quiero información del programa de referidos.',
    team:'Hola Erick, quiero hablar con el equipo de Credit Express.',
    s_repair:'Hola Erick, me interesa su ayuda. Quiero reparar mi crédito.',
    s_rebuild:'Hola Erick, me interesa su ayuda. Quiero reconstruir mi crédito con un plan, paso a paso.',
    s_monitor:'Hola Erick, me interesa su ayuda. Me interesa el monitoreo de mi crédito.',
    s_bureaus:'Hola Erick, me interesa su ayuda. Quiero que revisen mis reportes de los 3 bureaus.',
    s_cards:'Hola Erick, me interesa su ayuda. Quiero prepararme para sacar una tarjeta de crédito.',
    s_edu:'Hola Erick, me interesa su ayuda. Quiero aprender cómo funciona el crédito.',
    s_consol:'Hola Erick, me interesa su ayuda. Tengo varias deudas y quiero saber sobre consolidación.',
    s_bk:'Hola Erick, me interesa su ayuda. Estoy pensando en la bancarrota y quiero entender mis opciones.',
    s_collect:'Hola Erick, me interesa su ayuda. Tengo acreedores o cobradores y necesito ayuda.',
    s_personal:'Hola Erick, me interesa su ayuda. Estoy buscando un préstamo personal y quiero preparar mi crédito.',
    s_business:'Hola Erick, me interesa su ayuda. Estoy buscando un préstamo para mi negocio.',
    s_sba:'Hola Erick, me interesa su ayuda. Me interesa un SBA loan para mi negocio.',
    s_funding:'Hola Erick, me interesa su ayuda. Estoy buscando capital (business funding) para mi negocio.',
    s_auto:'Hola Erick, me interesa su ayuda. Estoy buscando comprar un auto y quiero preparar mi crédito para financiarlo.',
    s_home:'Hola Erick, me interesa su ayuda. Estoy buscando comprar una casa y quiero preparar mi crédito.',
    s_moto:'Hola Erick, me interesa su ayuda. Estoy buscando comprar una motocicleta y quiero preparar mi crédito para financiarla.',
    s_jetski:'Hola Erick, me interesa su ayuda. Estoy buscando comprar un jet ski y quiero preparar mi crédito para financiarlo.'
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
