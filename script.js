  // Intenta reproducir la música al cargar (silenciosamente, puede fallar).
  // El botón queda SIEMPRE visible como control manual fiable, porque
  // algunos navegadores (p. ej. el de dentro de WhatsApp) dicen que la
  // música ya suena aunque en realidad esté muda, y no podemos fiarnos de eso.
  (function(){
    const music = document.getElementById('bgMusic');
    const prompt = document.getElementById('musicPrompt');
    if(!music) return;
    music.volume = 0.85;

    let playing = false;

    function setPlayingUI(isPlaying){
      playing = isPlaying;
      if(!prompt) return;
      prompt.classList.toggle('is-playing', isPlaying);
      const label = prompt.querySelector('.music-text');
      if(label) label.textContent = isPlaying ? 'música activada' : 'tócame, es para ti';
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
          music.pause();
          setPlayingUI(false);
        }
      });
    }

    // Refleja el estado real del audio si cambia por otra vía
    music.addEventListener('pause', ()=> setPlayingUI(false));
    music.addEventListener('play', ()=> setPlayingUI(true));
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
    'Y en cada etapa, ibas siendo más tú',
    'Y hoy, sigues siendo nuestro pedazo de persona favorito',
    'Te queremos con todo el corazón, hoy y siempre ♥'
  ];
  const slides = document.querySelectorAll('.scene-slide');
  const dots = document.querySelectorAll('#sceneDots span');
  const sceneText = document.getElementById('sceneText');
  let sceneIndex = 0;

  // ---- Corazones que estallan ----
  const loveLayer = document.getElementById('loveLayer');
  const LOVE_COLORS = ['#e8768a','#ff8fa3','#e8b84b','#f5f0e6','#c96a4f'];
  const LOVE_CHARS = ['♥','♥','♥','♡','✦'];
  let loveTimers = [];
  const rnd = (a,b)=> a + Math.random()*(b-a);

  function burstHearts(x, y, n, spread){
    if(arcade.classList.contains('hide')) return;
    spread = spread || 130;
    for(let i=0;i<n;i++){
      const h = document.createElement('span');
      const ang = Math.random()*Math.PI*2, dist = spread*rnd(.45,1.15);
      h.className = 'love';
      h.textContent = LOVE_CHARS[Math.floor(Math.random()*LOVE_CHARS.length)];
      h.style.cssText = `--ox:${x}%;--oy:${y}%;--tx:${(Math.cos(ang)*dist).toFixed(0)}px;--ty:${(Math.sin(ang)*dist-20).toFixed(0)}px;--rot:${rnd(-40,40).toFixed(0)}deg;--dur:${rnd(2.6,4.2).toFixed(2)}s;--d:${rnd(0,.5).toFixed(2)}s;color:${LOVE_COLORS[Math.floor(Math.random()*LOVE_COLORS.length)]};font-size:${rnd(11,30).toFixed(0)}px`;
      h.addEventListener('animationend', ()=> h.remove());
      loveLayer.appendChild(h);
    }
  }

  // corazón grande que late y luego estalla en muchos pequeños
  function bigHeart(x, y, life){
    if(arcade.classList.contains('hide')) return;
    const b = document.createElement('span');
    b.className = 'love-beat'; b.textContent = '♥';
    b.style.left = x + '%'; b.style.top = y + '%';
    loveLayer.appendChild(b);
    loveTimers.push(setTimeout(()=>{ b.remove(); burstHearts(x, y, 28, 190); }, life*1000));
  }

  // corazoncitos que suben suavemente desde abajo durante toda la intro
  setInterval(()=>{
    if(arcade.classList.contains('hide')) return;
    const h = document.createElement('span');
    h.className = 'love rise'; h.textContent = '♥';
    h.style.cssText = `--ox:${rnd(4,96).toFixed(0)}%;--oy:100%;--tx:${rnd(-30,30).toFixed(0)}px;--ty:${-rnd(180,300).toFixed(0)}px;--rot:${rnd(-25,25).toFixed(0)}deg;--dur:${rnd(4.5,6.5).toFixed(2)}s;color:${LOVE_COLORS[Math.floor(Math.random()*2)]};font-size:${rnd(10,20).toFixed(0)}px`;
    h.addEventListener('animationend', ()=> h.remove());
    loveLayer.appendChild(h);
  }, 700);

  // guion por escena: [segundo, tipo ('b' estallido, 'big' corazón grande), x%, y%, cantidad o vida en s]
  const loveScript = [
    [[3,'b',50,58,14],[4.6,'b',30,45,8],[4.6,'b',70,45,8],[5,'big',50,24,2.2]],
    [[1.5,'b',17,45,8],[1.5,'b',83,45,8],[3.5,'b',17,42,8],[3.5,'b',83,42,8],[5.2,'b',75,62,16],[5.6,'big',50,26,1.8]],
    [[2.2,'b',35,45,8],[4.4,'b',62,48,14],[5.2,'big',50,26,1.8]],
    [[1.8,'b',50,45,12],[3.8,'b',50,40,14],[5.2,'big',50,24,1.8]],
    [[1.9,'b',50,45,16],[3.8,'b',38,42,8],[3.8,'b',62,42,8],[5.4,'big',50,26,1.8]],
    [[2.3,'b',50,55,14],[3.6,'big',50,30,2.4],[6.5,'b',30,50,10],[6.5,'b',70,50,10],[7.5,'big',50,28,2]],
    [[3,'b',50,42,22],[4.6,'b',30,38,10],[4.6,'b',70,38,10],[5.6,'b',50,42,24],[7.6,'b',50,42,24],[8.4,'big',22,30,2],[8.4,'big',78,30,2],[10.8,'b',50,42,30]]
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
  }, 8000);

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
