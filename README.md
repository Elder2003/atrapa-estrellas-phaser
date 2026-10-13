# Atrapa las estrellas — videojuego con Phaser 3

## Descripción

Minijuego 2D hecho con **JavaScript, HTML, CSS y Phaser 3**. El jugador mueve una nave para recoger **12 estrellas amarillas** y esquivar las **bombas rojas**. Dispone de **3 vidas** y **50 segundos** para ganar. El juego tiene pantalla de inicio, marcador de puntos, pantalla de victoria o derrota y botón para reiniciar.

## Controles

- Computadora: flechas izquierda/derecha o teclas A/D.
- Teléfono: mantener pulsado y arrastrar la nave hacia la izquierda o derecha.
- En el menú inicial, hacer clic en **JUGAR** o pulsar **Enter**.

## Archivos

- `index.html` — página web, estilos y conexión con Phaser.
- `juego.js` — código fuente y lógica del videojuego.
- `.nojekyll` — facilita la publicación en GitHub Pages.

## Probar el juego

Abrir `index.html` en un navegador con **conexión a Internet**. Phaser 3 se carga desde un CDN (no hay que instalar ningún programa ni descargar imágenes).

## Publicar en GitHub Pages

1. Entrar a [GitHub](https://github.com/) y crear un repositorio público, por ejemplo `atrapa-estrellas-phaser`.
2. Subir **los archivos de esta carpeta** (`index.html`, `juego.js` y `.nojekyll`) a la raíz del repositorio. No subir el ZIP sin descomprimir.
3. Entrar en **Settings → Pages**. En **Build and deployment**, elegir **Deploy from a branch**, seleccionar **main** y **/(root)**, y guardar.
4. Cuando GitHub termine de publicar, abrir la URL mostrada en Pages, que normalmente tiene el formato `https://USUARIO.github.io/atrapa-estrellas-phaser/`.
5. Compartir el enlace al **repositorio** en la actividad y pegar el enlace **del juego publicado** en el Padlet indicado por el docente.

## Tecnología

Phaser 3.90.0, JavaScript, HTML5 y CSS. Todos los gráficos del juego se generan mediante primitivas de Phaser; no se requieren imágenes ni sonidos externos.

## Nota

Este proyecto está preparado para publicación estática. No hace falta compilarlo. Phaser se descarga de `cdnjs.cloudflare.com` cuando un visitante abre el juego, por lo que se requiere Internet.
