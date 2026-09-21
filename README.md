# Nuestro pedazo de persona

Web estática (sin frameworks) lista para desplegar en Vercel.

## Estructura

```
index.html   → estructura de la página
style.css    → todos los estilos y animaciones
script.js    → la intro con monigotes, el desplazamiento, el brillo de fondo y la música
cancion.m4a  → la canción de fondo (formato principal)
cancion.mp3  → copia de la misma canción en mp3, como respaldo por si el
               móvil no soporta el m4a (suena sola al cargar; si el
               navegador la bloquea, arranca en cuanto se toca la pantalla)
anime/       → aquí van todas las fotos
```

## Fotos que espera encontrar en /anime

Coloca tus imágenes con estos nombres exactos (formato .jpg; si usas .png o .jpeg,
cambia la extensión en el `src` correspondiente dentro de `index.html`):

|Etapa|Archivos|
|-|-|
|0 — 1 año|foto1.jpg, foto2.jpg|
|Infancia|foto3.jpg, foto4.jpg, foto5.jpg|
|Mejores momentos|foto6.jpg, foto7.jpg|
|Adolescencia|foto8.jpg, foto9.jpg|
|Grandes recuerdos|foto10.jpg, foto11.jpg, foto12.jpg|
|Hoy|actual1.jpg, actual2.jpg|

Si falta alguna foto, esa tarjeta muestra automáticamente un aviso en vez de romperse.

## Desplegar en Verce

1. Sube esta carpeta a un repositorio de GitHub (o arrástrala directamente en
vercel.com → "Add New Project" → "Deploy" si usas la CLI/drag\&drop).
2. En "Framework Preset" elige **Other** (es HTML estático, no necesita build).
3. Deploy. Listo — no hace falta configurar nada más.

También puedes probarlo en tu ordenador simplemente abriendo `index.html`
en el navegador.

