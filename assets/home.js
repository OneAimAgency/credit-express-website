/* Home: testimonial track (locked section) and the ONE signature moment (Tu crédito, descifrado).
   Result galleries use the shared [data-carousel] behaviour in site.js. */
(function(){
  var root = document.documentElement, STILL = root.classList.contains('static');

  /* testimonials: swipe on phones; drag, arrows and keys on desktop. Never automatic. */
  var track = document.querySelector('.track');
  if (track){
    var stories = [].slice.call(track.querySelectorAll('.story'));
    var prev = document.querySelector('.proof .prev'), next = document.querySelector('.proof .next'), count = document.querySelector('.proof .count b');
    var pos = function(i){ return stories[i].offsetLeft - stories[0].offsetLeft; };
    var current = function(){ var x = track.scrollLeft, best = 0, d = Infinity; stories.forEach(function(s, i){ var dd = Math.abs(pos(i) - x); if (dd < d){ d = dd; best = i; } }); return best; };
    var goTo = function(i){ i = Math.max(0, Math.min(stories.length - 1, i)); track.scrollTo({ left:pos(i), behavior: STILL ? 'auto' : 'smooth' }); };
    var sync = function(){ count.textContent = String(current() + 1).padStart(2, '0'); prev.disabled = track.scrollLeft < 8; next.disabled = track.scrollLeft > track.scrollWidth - track.clientWidth - 8; };
    prev.addEventListener('click', function(){ goTo(current() - 1); });
    next.addEventListener('click', function(){ goTo(current() + 1); });
    track.addEventListener('scroll', sync, { passive:true });
    track.addEventListener('keydown', function(e){ if (e.key === 'ArrowRight'){ e.preventDefault(); goTo(current() + 1); } if (e.key === 'ArrowLeft'){ e.preventDefault(); goTo(current() - 1); } });
    var sx = 0, sl = 0, dragging = false, moved = 0, startIdx = 0;
    track.addEventListener('pointerdown', function(e){ if (e.pointerType !== 'mouse' || e.button !== 0) return; dragging = true; moved = 0; sx = e.clientX; sl = track.scrollLeft; startIdx = current(); track.classList.add('drag'); track.setPointerCapture(e.pointerId); });
    track.addEventListener('pointermove', function(e){ if (!dragging) return; moved = e.clientX - sx; track.scrollLeft = sl - moved; });
    var end = function(){ if (!dragging) return; dragging = false; track.classList.remove('drag'); goTo(Math.abs(moved) > 60 ? startIdx + (moved < 0 ? 1 : -1) : startIdx); };
    track.addEventListener('pointerup', end); track.addEventListener('pointercancel', end);
    sync();
  }

  /* Tu crédito, descifrado: one word at a time.
     The report word gets highlighted → its meaning appears in plain Spanish → what Credit Express does. */
  var dx = document.querySelector('.dx');
  if (!dx || STILL || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var mm = gsap.matchMedia();

  mm.add('(min-width: 981px)', function(){
    dx.classList.add('pin');
    var cards = [].slice.call(dx.querySelectorAll('.dxc')), rail = [].slice.call(dx.querySelectorAll('.dx-rail li'));
    gsap.set(cards, { autoAlpha:0 }); gsap.set(cards[0], { autoAlpha:1 });
    cards.forEach(function(c){ var l = c.querySelectorAll('.lbl'); gsap.set([l[1], c.querySelector('.dxm'), c.querySelector('.do')], { autoAlpha:0, y:18 }); gsap.set(c.querySelector('.term span'), { '--hl':'0%' }); });
    var tl = gsap.timeline({ defaults:{ ease:'power2.out' }, scrollTrigger:{ trigger:'.dx-stage', start:'top top', end:function(){ return '+=' + Math.round(innerHeight * 3.6); }, pin:true, scrub:0.5, invalidateOnRefresh:true } });
    cards.forEach(function(c, i){
      var b = i * 10, l = c.querySelectorAll('.lbl');
      if (i > 0) tl.fromTo(c, { autoAlpha:0, y:30 }, { autoAlpha:1, y:0, duration:1, immediateRender:false }, b);
      tl.fromTo(c.querySelector('.term span'), { '--hl':'0%' }, { '--hl':'100%', duration:2, ease:'none', immediateRender:false }, b + .8);
      tl.fromTo([l[1], c.querySelector('.dxm')], { autoAlpha:0, y:18 }, { autoAlpha:1, y:0, duration:1.4, immediateRender:false }, b + 3);
      tl.fromTo(c.querySelector('.do'), { autoAlpha:0, y:18 }, { autoAlpha:1, y:0, duration:1.4, immediateRender:false }, b + 5);
      if (i < cards.length - 1) tl.to(c, { autoAlpha:0, y:-30, duration:1, ease:'power2.in' }, b + 9);
    });
    tl.to({}, { duration:1.5 });
    tl.eventCallback('onUpdate', function(){ var idx = Math.min(cards.length - 1, Math.floor(tl.time() / 10)); rail.forEach(function(r, i){ r.classList.toggle('on', i === idx); }); });
    rail[0].classList.add('on');
    if (/^#shot-dx-(\d+)$/.test(location.hash)){ tl.scrollTrigger.disable(false); tl.progress(+RegExp.$1 / 100); }
    return function(){ dx.classList.remove('pin'); rail.forEach(function(r){ r.classList.remove('on'); }); };
  });

  /* phones: no pinning; each word highlights as it scrolls into view */
  mm.add('(max-width: 980px)', function(){
    dx.querySelectorAll('.dxc').forEach(function(c){
      gsap.fromTo(c.querySelector('.term span'), { '--hl':'0%' }, { '--hl':'100%', ease:'none', scrollTrigger:{ trigger:c, start:'top 85%', end:'top 50%', scrub:0.4 } });
      gsap.fromTo([c.querySelector('.dxm'), c.querySelector('.do')], { autoAlpha:0, y:16 }, { autoAlpha:1, y:0, stagger:.15, duration:.7, scrollTrigger:{ trigger:c, start:'top 70%', toggleActions:'play none none reverse' } });
    });
  });
})();

/* Testimonios: filter chips, "show all", and a simple full-size viewer. */
(function(){
  var sec = document.getElementById('testimonios'); if (!sec) return;
  var grid = sec.querySelector('.tst-g'), cards = [].slice.call(grid.querySelectorAll('.tc')), more = sec.querySelector('.tst-more'), FIRST = 12;
  cards.forEach(function(c, i){ if (i >= FIRST) c.classList.add('more'); });
  more.querySelector('button').addEventListener('click', function(){ grid.setAttribute('data-open', '1'); more.hidden = true; });
  sec.querySelectorAll('.tst-f button').forEach(function(b){
    b.addEventListener('click', function(){
      var f = b.getAttribute('data-f');
      sec.querySelectorAll('.tst-f button').forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      cards.forEach(function(c){ c.hidden = !(f === 'all' || c.getAttribute('data-cat') === f); });
      if (f !== 'all'){ grid.setAttribute('data-open', '1'); more.hidden = true; }
    });
  });
  var lb = sec.querySelector('.tst-lb'); if (!lb || !lb.showModal) return;
  var img = lb.querySelector('img'), cap = lb.querySelector('p'), idx = 0;
  var visible = function(){ return cards.filter(function(c){ return !c.hidden && getComputedStyle(c).display !== 'none'; }); };
  var show = function(c){ var b = c.querySelector('.tc-b'); img.src = b.getAttribute('data-full'); img.alt = c.querySelector('img').alt; cap.textContent = c.querySelector('figcaption').textContent.replace(/^(WhatsApp|Puntaje|Disputa)/, '$1 · '); };
  cards.forEach(function(c){ c.querySelector('.tc-b').addEventListener('click', function(){ var v = visible(); idx = v.indexOf(c); show(c); lb.showModal(); }); });
  var step = function(d){ var v = visible(); idx = (idx + d + v.length) % v.length; show(v[idx]); };
  lb.querySelector('.x').addEventListener('click', function(){ lb.close(); });
  lb.querySelector('.p').addEventListener('click', function(){ step(-1); });
  lb.querySelector('.n').addEventListener('click', function(){ step(1); });
  lb.addEventListener('click', function(e){ if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', function(e){ if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });
})();
