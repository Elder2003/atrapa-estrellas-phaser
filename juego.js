/*
 ATRAPA LAS ESTRELLAS - videojuego escolar sencillo con Phaser 3
 Objetivo: recoger 12 estrellas con 3 vidas antes de que termine el tiempo.
 Controles: flechas izquierda/derecha, teclas A/D o arrastrar con el dedo.
 Los dibujos se crean con Phaser: no necesita archivos de imágenes.
*/

const ANCHO = 900;
const ALTO = 560;
const META = 12;
const TIEMPO = 50;

// Fondo espacial decorativo, compartido por las tres escenas.
function fondo(scene) {
  const fondo = scene.add.graphics();
  fondo.fillGradientStyle(0x151f48, 0x151f48, 0x070c20, 0x070c20, 1);
  fondo.fillRect(0, 0, ANCHO, ALTO);
  const rnd = new Phaser.Math.RandomDataGenerator(['estrellas-fondo']);
  for (let i = 0; i < 84; i++) {
    const x = rnd.between(12, ANCHO - 12);
    const y = rnd.between(12, ALTO - 12);
    scene.add.circle(x, y, rnd.realInRange(0.7, 1.9), 0xc5ddff, rnd.realInRange(0.15, 0.58));
  }
  scene.add.ellipse(180, 520, 440, 180, 0x253267, 0.18);
  scene.add.ellipse(740, 490, 420, 120, 0x12476c, 0.15);
}

function texto(scene, x, y, contenido, tamano, color = '#f9fbff') {
  return scene.add.text(x, y, contenido, {
    fontFamily: 'Arial, sans-serif',
    fontSize: `${tamano}px`,
    color: color,
    fontStyle: 'bold',
    align: 'center'
  }).setOrigin(0.5);
}

function boton(scene, mensaje, y, accion) {
  const bg = scene.add.rectangle(ANCHO / 2, y, 270, 62, 0x36e0b5, 1)
    .setStrokeStyle(3, 0xa8ffe6).setInteractive({ useHandCursor: true });
  texto(scene, ANCHO / 2, y, mensaje, 22, '#08293b');
  bg.on('pointerover', () => bg.setFillStyle(0x79f4d0));
  bg.on('pointerout', () => bg.setFillStyle(0x36e0b5));
  bg.on('pointerdown', accion);
  return bg;
}

class Inicio extends Phaser.Scene {
  constructor() { super('Inicio'); }

  create() {
    fondo(this);
    this.add.star(450, 128, 5, 51, 87, 0xffd763).setStrokeStyle(7, 0xffeeaf);
    this.add.star(275, 195, 5, 11, 20, 0xffd763);
    this.add.star(635, 175, 5, 12, 22, 0xffd763);
    texto(this, 450, 264, 'ATRAPA LAS ESTRELLAS', 38);
    texto(this, 450, 316, 'Recoge 12 estrellas y esquiva las bombas', 20, '#c7d7fa');
    texto(this, 450, 346, 'Tienes 3 vidas y 50 segundos', 18, '#aac2ed');
    boton(this, '▶  JUGAR', 431, () => this.scene.start('Juego'));
    texto(this, 450, 504, 'Flechas / A-D para mover • También puedes arrastrar', 15, '#a5b7df');
    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('Juego'));
    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('Juego'));
  }
}

class Juego extends Phaser.Scene {
  constructor() { super('Juego'); }

  create() {
    fondo(this);
    this.puntos = 0;
    this.vidas = 3;
    this.segundos = TIEMPO;
    this.terminado = false;
    this.objetos = [];
    this.destinoTactil = null;

    // Panel de información.
    this.add.rectangle(450, 39, 860, 64, 0x111e3c, 0.89).setStrokeStyle(2, 0x345480);
    this.puntosTexto = this.add.text(46, 21, `ESTRELLAS  0 / ${META}`, { fontFamily: 'Arial', fontSize: '20px', fontStyle: 'bold', color: '#ffda70' });
    this.vidasTexto = this.add.text(390, 21, 'VIDAS  ♥ ♥ ♥', { fontFamily: 'Arial', fontSize: '20px', fontStyle: 'bold', color: '#ff8d9b' });
    this.tiempoTexto = this.add.text(706, 21, `TIEMPO  ${TIEMPO}`, { fontFamily: 'Arial', fontSize: '20px', fontStyle: 'bold', color: '#c6dcff' });
    this.add.rectangle(450, 535, 900, 50, 0x091326, 0.8);
    texto(this, 450, 535, '✦  ATRAPA LAS ESTRELLAS AMARILLAS  ·  EVITA LAS BOMBAS ROJAS  ✦', 16, '#abc8f1');

    // Nave espacial que controla el jugador.
    this.nave = this.add.container(450, 476);
    const propulsor = this.add.ellipse(0, 26, 54, 15, 0x2de4e5, 0.22);
    const base = this.add.ellipse(0, 5, 102, 37, 0x25c5df).setStrokeStyle(3, 0x9ff6ff);
    const cabina = this.add.ellipse(0, -12, 52, 33, 0x7b82fd).setStrokeStyle(2, 0xe2e4ff);
    const brillo = this.add.circle(-11, -18, 5, 0xffffff, 0.7);
    const foco1 = this.add.circle(-28, 7, 5, 0xffec90);
    const foco2 = this.add.circle(28, 7, 5, 0xffec90);
    this.nave.add([propulsor, base, cabina, brillo, foco1, foco2]);

    // Teclado y controles táctiles.
    this.cursores = this.input.keyboard.createCursorKeys();
    this.teclaA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.teclaD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.input.on('pointerdown', pointer => { this.destinoTactil = pointer.x; });
    this.input.on('pointermove', pointer => { if (pointer.isDown) this.destinoTactil = pointer.x; });
    this.input.on('pointerup', () => { this.destinoTactil = null; });

    // Se generan objetos nuevos cada 650 ms.
    this.generador = this.time.addEvent({ delay: 650, loop: true, callback: this.generar, callbackScope: this });
    this.reloj = this.time.addEvent({ delay: 1000, loop: true, callback: () => {
      if (this.terminado) return;
      this.segundos--;
      this.tiempoTexto.setText(`TIEMPO  ${this.segundos}`);
      if (this.segundos <= 0) this.finalizar(false);
    } });
  }

  generar() {
    if (this.terminado) return;
    const x = Phaser.Math.Between(44, ANCHO - 44);
    const esBomba = Math.random() < 0.20;
    let figura;
    if (esBomba) {
      figura = this.add.star(x, -28, 8, 14, 24, 0xff5b76).setStrokeStyle(3, 0xffb5c0);
    } else {
      figura = this.add.star(x, -28, 5, 11, 23, 0xffda60).setStrokeStyle(2, 0xfff0ad);
    }
    this.objetos.push({ figura, bomba: esBomba, velocidad: Phaser.Math.Between(155, 260) });
  }

  update(_t, deltaMs) {
    if (this.terminado) return;
    const dt = Math.min(deltaMs / 1000, 0.05);
    const izquierda = this.cursores.left.isDown || this.teclaA.isDown;
    const derecha = this.cursores.right.isDown || this.teclaD.isDown;
    if (izquierda || derecha) this.destinoTactil = null;
    if (izquierda) this.nave.x -= 490 * dt;
    if (derecha) this.nave.x += 490 * dt;
    if (this.destinoTactil !== null) {
      const paso = 650 * dt;
      const distancia = this.destinoTactil - this.nave.x;
      this.nave.x += Phaser.Math.Clamp(distancia, -paso, paso);
    }
    this.nave.x = Phaser.Math.Clamp(this.nave.x, 54, ANCHO - 54);

    for (let i = this.objetos.length - 1; i >= 0; i--) {
      const objeto = this.objetos[i];
      objeto.figura.y += objeto.velocidad * dt;
      objeto.figura.rotation += (objeto.bomba ? -1.5 : 1.9) * dt;
      const colision = Math.abs(objeto.figura.x - this.nave.x) < 57 &&
                       Math.abs(objeto.figura.y - this.nave.y) < 29;
      if (colision) {
        this.objetos.splice(i, 1);
        objeto.figura.destroy();
        if (objeto.bomba) {
          this.vidas--;
          this.vidasTexto.setText('VIDAS  ' + ('♥ '.repeat(this.vidas)).trim());
          this.cameras.main.shake(140, 0.004);
          this.tweens.add({ targets: this.nave, alpha: 0.3, duration: 100, yoyo: true, repeat: 2 });
          if (this.vidas <= 0) { this.finalizar(false); return; }
        } else {
          this.puntos++;
          this.puntosTexto.setText(`ESTRELLAS  ${this.puntos} / ${META}`);
          this.cartelPuntos('+1');
          if (this.puntos >= META) { this.finalizar(true); return; }
        }
      } else if (objeto.figura.y > ALTO + 38) {
        this.objetos.splice(i, 1);
        objeto.figura.destroy();
      }
    }
  }

  cartelPuntos(mensaje) {
    const aviso = texto(this, this.nave.x, 420, mensaje, 22, '#ffda70');
    this.tweens.add({ targets: aviso, y: 375, alpha: 0, duration: 500, onComplete: () => aviso.destroy() });
  }

  finalizar(ganaste) {
    if (this.terminado) return;
    this.terminado = true;
    this.generador.remove();
    this.reloj.remove();
    this.scene.start('Final', { ganaste, puntos: this.puntos });
  }
}

class Final extends Phaser.Scene {
  constructor() { super('Final'); }

  create(datos) {
    fondo(this);
    this.add.rectangle(450, 277, 620, 420, 0x102040, 0.93)
      .setStrokeStyle(3, datos.ganaste ? 0x39eac2 : 0xff7990);
    this.add.star(450, 153, 5, 34, 59, datos.ganaste ? 0xffde66 : 0xbcc7eb);
    texto(this, 450, 253, datos.ganaste ? '¡GANASTE!' : 'FIN DEL JUEGO', 42,
          datos.ganaste ? '#7dffce' : '#ffb5c1');
    texto(this, 450, 317, `Conseguiste ${datos.puntos} de ${META} estrellas`, 22, '#d2e2ff');
    boton(this, '↻  JUGAR OTRA VEZ', 407, () => this.scene.start('Juego'));
    texto(this, 450, 476, 'Presiona ENTER para intentarlo de nuevo', 16, '#a7bce7');
    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('Juego'));
  }
}

// Configuración principal del motor Phaser.
if (typeof Phaser === 'undefined') {
  document.getElementById('juego').innerHTML = '<div class="fallo">No se pudo cargar Phaser.<br>Comprueba tu conexión a Internet y vuelve a abrir esta página.</div>';
} else {
  new Phaser.Game({
    type: Phaser.AUTO,
    width: ANCHO,
    height: ALTO,
    parent: 'juego',
    backgroundColor: '#0a1028',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: ANCHO, height: ALTO },
    scene: [Inicio, Juego, Final],
    render: { antialias: true },
    input: { activePointers: 2 }
  });
}
