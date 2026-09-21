  // Intenta reproducir la música al cargar; si el navegador lo bloquea,
  // muestra un botón a juego con la web y también arranca con el primer
  // toque/clic/tecla en cualquier parte de la página
  (function(){
    const music = document.getElementById('bgMusic');
    const prompt = document.getElementById('musicPrompt');
    if(!music) return;
    music.volume = 0.85;

    function hidePrompt(){
      if(prompt){ prompt.classList.add('hide'); prompt.classList.remove('show'); }
    }

    function startMusic(){
      music.play().catch(()=>{});
      hidePrompt();
      ['click','touchstart','keydown'].forEach(evt =>
        document.removeEventListener(evt, startMusic)
      );
      if(prompt) prompt.removeEventListener('click', startMusic);
    }

    const playPromise = music.play();
    if(playPromise !== undefined){
      playPromise.then(()=>{
        hidePrompt();
      }).catch(()=>{
        if(prompt) setTimeout(()=> prompt.classList.add('show'), 800);
        ['click','touchstart','keydown'].forEach(evt =>
          document.addEventListener(evt, startMusic, { once:true })
        );
      });
    }

    if(prompt) prompt.addEventListener('click', startMusic);
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
    'Y en cada etapa, ibas siendo más tú',
    'Y hoy, sigues siendo nuestro pedazo de persona favorito'
  ];
  const slides = document.querySelectorAll('.scene-slide');
  const dots = document.querySelectorAll('#sceneDots span');
  const sceneText = document.getElementById('sceneText');
  let sceneIndex = 0;

  function showScene(i){
    slides.forEach((s,j)=> s.classList.toggle('active', j===i));
    dots.forEach((d,j)=> d.classList.toggle('active', j===i));
    sceneText.style.opacity = 0;
    setTimeout(()=>{ sceneText.textContent = captions[i]; sceneText.style.opacity = 1; }, 150);
  }

  const sceneTimer = setInterval(()=>{
    sceneIndex++;
    if(sceneIndex >= slides.length){
      clearInterval(sceneTimer);
      setTimeout(closeArcade, 2400); // se cierra sola tras la última escena
      return;
    }
    showScene(sceneIndex);
  }, 4500);

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
