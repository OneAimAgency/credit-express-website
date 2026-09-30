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
