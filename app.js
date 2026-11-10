(function(){
  var nag=document.getElementById('nag'), burger=document.getElementById('burger'), menu=document.getElementById('menu');
  function zamknij(){menu.classList.remove('otw');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Otwórz menu');document.body.classList.remove('menu-otw')}
  burger.addEventListener('click',function(){
    var o=!menu.classList.contains('otw');
    menu.classList.toggle('otw',o);burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');document.body.classList.toggle('menu-otw',o);
  });
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',zamknij)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')zamknij()});

  var wszystkie=menu.querySelectorAll('a');
  function gora(){nag.classList.toggle('cien',scrollY>8);if(scrollY<innerHeight*0.45)wszystkie.forEach(function(a){a.classList.remove('akt')})}
  addEventListener('scroll',gora,{passive:true});

  // aktywna pozycja menu
  var linki={};menu.querySelectorAll('a[href^="#"]').forEach(function(a){linki[a.getAttribute('href').slice(1)]=a});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting&&scrollY>=innerHeight*0.45){for(var k in linki)linki[k].classList.remove('akt');if(linki[e.target.id])linki[e.target.id].classList.add('akt')}
    })},{rootMargin:'-45% 0px -50% 0px'});
    Object.keys(linki).forEach(function(id){var s=document.getElementById(id);if(s)io.observe(s)});

    // pasek mobilny po przewinięciu za główny przycisk
    var mob=document.getElementById('mob'), cta=document.getElementById('cta');
    new IntersectionObserver(function(es){var e=es[0];mob.classList.toggle('widac',!e.isIntersecting&&e.boundingClientRect.top<0)}).observe(cta);
  }

  // karuzele: palec, mysz, strzałki, licznik
  document.querySelectorAll('.kar').forEach(function(k){
    var el=[].slice.call(k.children);
    var str=document.querySelector('.strzalki[data-dla="'+k.id+'"]');
    var licz=document.querySelector('[data-licznik="'+k.id+'"]');
    function krok(){var a=el[0],b=el[1];return b?(b.offsetLeft-a.offsetLeft):k.clientWidth}
    function stan(){
      var max=k.scrollWidth-k.clientWidth-2;
      if(str){str.style.visibility=max<=0?'hidden':''}
      if(str){str.querySelector('.str-l').disabled=k.scrollLeft<=2;str.querySelector('.str-p').disabled=k.scrollLeft>=max}
      if(licz){var pad=parseFloat(getComputedStyle(k).paddingLeft)||0,i=0,best=1e9;
        el.forEach(function(x,j){var d=Math.abs(x.offsetLeft-pad-k.scrollLeft);if(d<best){best=d;i=j}});
        if(k.scrollLeft>=max)i=el.length-1;licz.textContent=(i+1)+' / '+el.length}
    }
    if(str){
      str.querySelector('.str-l').addEventListener('click',function(){k.scrollBy({left:-krok(),behavior:'smooth'})});
      str.querySelector('.str-p').addEventListener('click',function(){k.scrollBy({left:krok(),behavior:'smooth'})});
    }
    k.addEventListener('scroll',function(){requestAnimationFrame(stan)},{passive:true});
    addEventListener('resize',stan);stan();
    // przeciąganie myszą
    var dol=false,x0=0,s0=0,ruch=0;
    k.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;dol=true;ruch=0;x0=e.clientX;s0=k.scrollLeft});
    addEventListener('pointermove',function(e){if(!dol)return;var dx=e.clientX-x0;ruch=Math.max(ruch,Math.abs(dx));if(ruch>4){k.classList.add('ciag');k.scrollLeft=s0-dx}});
    addEventListener('pointerup',function(){if(!dol)return;dol=false;if(k.classList.contains('ciag')){k.classList.remove('ciag');
      var w=krok(),pad=parseFloat(getComputedStyle(k).paddingLeft)||0;var c=Math.round(k.scrollLeft/w)*w;k.scrollTo({left:c,behavior:'smooth'})}});
    k.addEventListener('click',function(e){if(ruch>4){e.preventDefault();e.stopPropagation()}},true);
    k.setAttribute('tabindex','0');
    k.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){k.scrollBy({left:krok(),behavior:'smooth'});e.preventDefault()}if(e.key==='ArrowLeft'){k.scrollBy({left:-krok(),behavior:'smooth'});e.preventDefault()}});
  });

  // formularz pokazowy
  var f=document.getElementById('form');
  f.addEventListener('submit',function(e){e.preventDefault();document.getElementById('form-info').hidden=false});
})();
