  // Intenta reproducir la música al cargar (silenciosamente, puede fallar).
  // El botón queda SIEMPRE visible como control manual fiable, porque
  // algunos navegadores (p. ej. el de dentro de WhatsApp) dicen que la
  // música ya suena aunque en realidad esté muda, y no podemos fiarnos de eso.
  (function(){
    const music = document.getElementById('bgMusic');
    const prompt = document.getElementById('musicPrompt');
    if(!music) return;
    music.volume = 0.85;

    let playing = false, userPaused = false, missing = false;

    function setPlayingUI(isPlaying){
      playing = isPlaying;
      if(!prompt) return;
      prompt.classList.toggle('is-playing', isPlaying);
      const label = prompt.querySelector('.music-text');
      if(label) label.textContent = missing ? 'no encuentro cancion.mp3' : (isPlaying ? 'música activada' : 'tócame, es para ti');
    }

    // Intento silencioso de autoplay (funciona en algunos navegadores/casos)
    const playPromise = music.play();
    if(playPromise !== undefined){
      playPromise.then(()=> setPlayingUI(true)).catch(()=> setPlayingUI(false));
    }

    // El botón siempre visible: toca para reproducir o pausar
    if(prompt){
      prompt.addEventListener('click', () => {
        if(music.paused){
          music.play().then(()=> setPlayingUI(true)).catch(()=> setPlayingUI(false));
        } else {
          userPaused = true;
          music.pause();
          setPlayingUI(false);
        }
      });
    }

    // Refleja el estado real del audio si cambia por otra vía
    music.addEventListener('pause', ()=> setPlayingUI(false));
    music.addEventListener('play', ()=> setPlayingUI(true));

    // Los navegadores bloquean el autoplay con sonido: el primer toque en cualquier
    // parte de la página (p. ej. al saltar la intro) arranca la música.
    const tapEvents = ['pointerdown','pointerup','touchend','click','keydown'];
    function removeTap(){ tapEvents.forEach(ev=> document.removeEventListener(ev, firstTap, true)); }
    function firstTap(e){
      if(e.target.closest && e.target.closest('#musicPrompt')) return; // el botón ya hace lo suyo
      if(userPaused){ removeTap(); return; }
      if(!music.paused){ removeTap(); return; }
      music.play().then(()=>{ setPlayingUI(true); removeTap(); }).catch(()=>{});
    }
    tapEvents.forEach(ev=> document.addEventListener(ev, firstTap, true));

    // Si no encuentra ninguno de los archivos de audio, lo dice en el botón
    const lastSrc = music.querySelector('source:last-of-type');
    if(lastSrc) lastSrc.addEventListener('error', ()=>{ missing = true; setPlayingUI(false); });
  })();

  // Genera un campo de estrellitas titilando por toda la página
  (function(){
    const field = document.getElementById('sparkleField');
    const total = 55;
    for(let i=0;i<total;i++){
      const s = document.createElement('div');
      s.className = 'spark';
      const size = (Math.random()*2.2 + 1).toFixed(1);
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.top = (Math.random()*100) + '%';
      s.style.left = (Math.random()*100) + '%';
      s.style.animationDuration = (Math.random()*3 + 2.5).toFixed(2) + 's';
      s.style.animationDelay = (Math.random()*5).toFixed(2) + 's';
      field.appendChild(s);
    }
  })();

  const arcade = document.getElementById('arcade');
  function closeArcade(){ arcade.classList.add('hide'); }
  arcade.addEventListener('click', closeArcade);

  const captions = [
    'Naciste, y desde ese día te quisimos y cuidamos',
    'Diste tus primeros pasos… y no has parado desde entonces',
    'Cada día era una aventura nueva por descubrir',
    'Y siempre listo para grandes juegos, como todo un gran heroe,nuestro heroe',
    'Tardes enteras de videojuegos, jugando juntos y celebrando cada victoria',
    'Cada cumpleaños, un deseo nuevo y todos aplaudiendo a tu lado',
    'Y en cada etapa, ibas siendo más tú',
    'Y hoy, sigues siendo nuestro pedazo de persona favorito'
  ];
  const slides = document.querySelectorAll('.scene-slide');
  const dots = document.querySelectorAll('#sceneDots span');
  const sceneText = document.getElementById('sceneText');
  let sceneIndex = 0;

  // ---- Corazones estallando (solo en unas pocas escenas) ----
  const loveLayer = document.getElementById('loveLayer');
  const LOVE_COLORS = ['#e8768a','#ff8fa3','#e8b84b','#f5f0e6'];
  const LOVE_CHARS = ['♥','♥','♥','✦'];
  let loveTimers = [];
  const rnd = (a,b)=> a + Math.random()*(b-a);

  function burstHearts(x, y, n, spread){
    if(arcade.classList.contains('hide')) return;
    spread = spread || 120;
    for(let i=0;i<n;i++){
      const s = document.createElement('span');
      const ang = Math.random()*Math.PI*2, dist = spread*rnd(.45,1.1);
      s.className = 'love';
      s.textContent = LOVE_CHARS[Math.floor(Math.random()*LOVE_CHARS.length)];
      s.style.cssText = `--ox:${x}%;--oy:${y}%;--tx:${(Math.cos(ang)*dist).toFixed(0)}px;--ty:${(Math.sin(ang)*dist-20).toFixed(0)}px;--rot:${rnd(-40,40).toFixed(0)}deg;--dur:${rnd(2.6,4).toFixed(2)}s;--d:${rnd(0,.4).toFixed(2)}s;color:${LOVE_COLORS[Math.floor(Math.random()*LOVE_COLORS.length)]};font-size:${rnd(11,24).toFixed(0)}px`;
      s.addEventListener('animationend', ()=> s.remove());
      loveLayer.appendChild(s);
    }
  }
  function bigHeart(x, y, life){
    if(arcade.classList.contains('hide')) return;
    const b = document.createElement('span');
    b.className = 'love-beat'; b.textContent = '♥';
    b.style.left = x + '%'; b.style.top = y + '%';
    loveLayer.appendChild(b);
    loveTimers.push(setTimeout(()=>{ b.remove(); burstHearts(x, y, 22, 160); }, life*1000));
  }
  // [segundo, tipo ('b' estallido / 'big' corazón grande), x%, y%, cantidad o vida en s]
  // Solo: nacimiento, soplar las velas y el abrazo final
  const loveScript = [
    [[4.6,'b',50,52,10]], [], [], [], [],
    [[4.9,'b',56,60,12]], [],
    [[2.6,'b',50,55,12],[4.2,'big',50,30,2.2]]
  ];
  function scheduleLove(i){
    loveTimers.forEach(clearTimeout); loveTimers = [];
    loveLayer.querySelectorAll('.love-beat').forEach(el=> el.remove());
    (loveScript[i] || []).forEach(([t,type,x,y,v])=>{
      loveTimers.push(setTimeout(()=>{ type==='big' ? bigHeart(x,y,v) : burstHearts(x,y,v); }, t*1000));
    });
  }
  scheduleLove(0);

  function showScene(i){
    scheduleLove(i);
    slides.forEach((s,j)=> s.classList.toggle('active', j===i));
    dots.forEach((d,j)=> d.classList.toggle('active', j===i));
    sceneText.style.opacity = 0;
    setTimeout(()=>{ sceneText.textContent = captions[i]; sceneText.style.opacity = 1; }, 150);
  }

  const sceneTimer = setInterval(()=>{
    sceneIndex++;
    if(sceneIndex >= slides.length){
      clearInterval(sceneTimer);
      setTimeout(closeArcade, 4500); // se cierra sola tras la última escena
      return;
    }
    showScene(sceneIndex);
  }, 7800);

  const stages = document.querySelectorAll('[data-stage]');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('visible');
    });
  },{ threshold:0.25 });
  stages.forEach(s=>io.observe(s));

// Si una foto de la carpeta /anime aún no existe, muestra un aviso en su lugar
document.querySelectorAll('.photo img').forEach(img => {
  img.addEventListener('error', () => {
    const photo = img.closest('.photo');
    photo.classList.add('placeholder');
    photo.textContent = img.dataset.label || 'Falta esta foto en /anime';
    img.remove();
  });
});
