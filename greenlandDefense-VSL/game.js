// Greenland Defense - Tower Defense pixel art
// Toda la lógica del juego vive aquí.

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const goldEl = document.getElementById('gold');
const livesEl = document.getElementById('lives');
const waveEl = document.getElementById('wave');
const startBtn = document.getElementById('startWave');
const towerButtons = Array.from(document.querySelectorAll('.tower-btn'));
const overlay = document.getElementById('overlay');
const overlayContent = document.getElementById('overlay-content');
const restartBtn = document.getElementById('restartBtn');

// Configuración de camino y grilla
const GRID = 40;
const PATH_WIDTH = 80;
const PATH_POINTS = [
  // Arranca dentro del canvas para que el primer enemigo sea visible al instante
  { x: 0, y: 120 },
  { x: 150, y: 120 },
  { x: 220, y: 200 },
  { x: 360, y: 200 },
  { x: 430, y: 110 },
  { x: 560, y: 110 },
  { x: 620, y: 210 },
  { x: 720, y: 210 },
  { x: 760, y: 320 },
  { x: 820, y: 320 }
];

const TOWER_TYPES = {
  archer: {
    name: 'Arquero Inuit',
    cost: 50,
    damage: 10,
    range: 150, // alcance +20% sobre el valor anterior
    fireRate: 0.5, // s
    color: '#5bd1ff',
    projectileSpeed: 280
  },
  ice: {
    name: 'Cañón de Hielo',
    cost: 100,
    damage: 25,
    range: 120, // alcance +20% sobre el valor anterior
    fireRate: 1,
    color: '#7cf0ff',
    projectileSpeed: 240,
    slow: { factor: 0.5, duration: 2 }
  },
  catapult: {
    name: 'Catapulta',
    cost: 150,
    damage: 40,
    range: 180, // alcance +20% sobre el valor anterior
    fireRate: 1.5,
    color: '#c28b52',
    projectileSpeed: 200,
    splash: 30
  }
};

const ENEMY_TYPES = {
  eagle: {
    name: 'Águila Imperial',
    hp: 30,
    speed: 120, // px/s (2px/frame aprox)
    gold: 10,
    color: '#ffb347',
    size: 16
  },
  truck: {
    name: 'Monster Truck',
    hp: 80,
    speed: 72, // 1.2 px/frame
    gold: 25,
    color: '#e04f4f',
    size: 20
  },
  burger: {
    name: 'Burger Boss',
    hp: 150,
    speed: 42, // 0.7 px/frame
    gold: 50,
    color: '#d4963c',
    size: 24
  }
};

class Enemy {
  constructor(type) {
    this.type = type;
    this.maxHp = type.hp;
    this.hp = type.hp;
    this.speed = type.speed;
    this.baseSpeed = type.speed;
    this.gold = type.gold;
    this.size = type.size;
    this.slowFactor = 1;
    this.slowTimer = 0;
    this.segmentIndex = 0;
    this.x = PATH_POINTS[0].x;
    this.y = PATH_POINTS[0].y;
    this.animTime = 0;
  }

  update(dt) {
    this.animTime += dt;
    if (this.slowTimer > 0) {
      this.slowTimer -= dt;
      if (this.slowTimer <= 0) {
        this.slowFactor = 1;
      }
    }

    const target = PATH_POINTS[this.segmentIndex + 1];
    if (!target) return true; // llegó al final

    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.hypot(dx, dy);
    const step = this.speed * this.slowFactor * dt;

    if (step >= dist) {
      this.x = target.x;
      this.y = target.y;
      this.segmentIndex++;
    } else {
      this.x += (dx / dist) * step;
      this.y += (dy / dist) * step;
    }
    return this.segmentIndex >= PATH_POINTS.length - 1;
  }

  applyDamage(amount) {
    this.hp -= amount;
    return this.hp <= 0;
  }

  applySlow(factor, duration) {
    this.slowFactor = Math.min(this.slowFactor, factor);
    this.slowTimer = Math.max(this.slowTimer, duration);
  }
}

class Projectile {
  constructor(x, y, target, type) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.type = type;
    this.speed = type.projectileSpeed;
    this.done = false;
  }

  update(dt, enemies, game) {
    if (!this.target || this.target.hp <= 0) {
      this.done = true;
      return;
    }
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.hypot(dx, dy);
    const step = this.speed * dt;

    if (dist <= step + this.target.size / 2) {
      // Impacto
      if (this.type.splash) {
        enemies.forEach(e => {
          const d = Math.hypot(e.x - this.target.x, e.y - this.target.y);
          if (d <= this.type.splash + e.size / 2) {
            const dead = e.applyDamage(this.type.damage);
            if (dead) game.enemyKilled(e);
          }
        });
      } else {
        const dead = this.target.applyDamage(this.type.damage);
        if (dead) game.enemyKilled(this.target);
      }
      if (this.type.slow) {
        this.target.applySlow(this.type.slow.factor, this.type.slow.duration);
      }
      this.done = true;
      return;
    }

    this.x += (dx / dist) * step;
    this.y += (dy / dist) * step;
  }
}

class Tower {
  constructor(x, y, data, typeKey) {
    this.x = x;
    this.y = y;
    this.data = data;
    this.typeKey = typeKey;
    this.cooldown = 0;
    this.animTime = 0;
    this.shootFx = 0; // efecto temporal tras disparar
  }

  update(dt, enemies, projectiles) {
    this.animTime += dt;
    if (this.cooldown > 0) this.cooldown -= dt;
    if (this.shootFx > 0) this.shootFx -= dt;
    const target = this.findTarget(enemies);
    if (target && this.cooldown <= 0) {
      projectiles.push(new Projectile(this.x, this.y, target, this.data));
      this.cooldown = this.data.fireRate;
      this.shootFx = 0.2; // 200 ms de animación de disparo
    }
  }

  findTarget(enemies) {
    let nearest = null;
    let nearestDist = Infinity;
    enemies.forEach(e => {
      const d = Math.hypot(e.x - this.x, e.y - this.y);
      if (d <= this.data.range && d < nearestDist) {
        nearest = e;
        nearestDist = d;
      }
    });
    return nearest;
  }
}

class Wave {
  constructor(definition) {
    this.queue = [...definition];
    this.spawnTimer = 0;
    this.spawnInterval = 0.9; // s
  }

  spawnNext(game) {
    if (this.queue.length === 0) return;
    const type = this.queue.shift();
    game.spawnEnemy(type);
  }

  update(dt, game) {
    if (this.queue.length === 0) return;
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnNext(game);
    }
  }

  isFinished() {
    return this.queue.length === 0;
  }
}

class Game {
  constructor() {
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.gold = 200;
    this.lives = 10;
    this.waveIndex = 0;
    this.wave = null;
    this.waveActive = false;
    this.selectedTower = null;
    this.mouse = { x: 0, y: 0, inside: false };
    this.gameState = 'playing'; // playing | victory | defeat
    this.victoryFx = null;
    this.defeatFx = { dots: [], timer: 0 };
    this.lastTime = performance.now();
    this.waves = [
      Array(5).fill('eagle'),
      [...Array(8).fill('eagle'), ...Array(2).fill('truck')],
      [...Array(5).fill('eagle'), ...Array(5).fill('truck')],
      [...Array(10).fill('eagle'), ...Array(5).fill('truck'), ...Array(2).fill('burger')],
      [...Array(8).fill('eagle'), ...Array(8).fill('truck'), ...Array(5).fill('burger')]
    ];
    this.bindEvents();
    this.loop(this.lastTime);
    this.updateUI();
  }

  bindEvents() {
    towerButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedTower = btn.dataset.type;
        towerButtons.forEach(b => b.classList.toggle('selected', b === btn));
      });
    });

    startBtn.addEventListener('click', () => this.startWave());
    restartBtn.addEventListener('click', () => this.restart());

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.inside = true;
    });
    canvas.addEventListener('mouseleave', () => {
      this.mouse.inside = false;
    });
    canvas.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.tryPlaceTower(x, y);
    });
  }

  restart() {
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.gold = 200;
    this.lives = 10;
    this.waveIndex = 0;
    this.wave = null;
    this.waveActive = false;
    this.selectedTower = null;
    this.gameState = 'playing';
    this.victoryFx = null;
    this.defeatFx = { dots: [], timer: 0 };
    overlay.classList.add('hidden');
    towerButtons.forEach(b => b.classList.remove('selected'));
    startBtn.disabled = false;
    this.updateUI();
  }

  startWave() {
    if (this.waveActive || this.waveIndex >= this.waves.length) return;
    this.wave = new Wave(this.waves[this.waveIndex]);
    this.waveActive = true;
    startBtn.disabled = true;
    // Spawnea el primer enemigo al instante para feedback inmediato
    this.wave.spawnNext(this);
  }

  spawnEnemy(typeKey) {
    const type = ENEMY_TYPES[typeKey];
    this.enemies.push(new Enemy(type));
  }

  enemyKilled(enemy) {
    const idx = this.enemies.indexOf(enemy);
    if (idx >= 0) this.enemies.splice(idx, 1);
    this.gold += enemy.gold;
    this.updateUI();
  }

  enemyEscaped(enemy) {
    const idx = this.enemies.indexOf(enemy);
    if (idx >= 0) this.enemies.splice(idx, 1);
    this.lives -= 1;
    this.updateUI();
    if (this.lives <= 0) {
      this.triggerDefeat();
    }
  }

  tryPlaceTower(rawX, rawY) {
    if (this.gameState !== 'playing') return;
    if (!this.selectedTower) return;

    const data = TOWER_TYPES[this.selectedTower];
    if (this.gold < data.cost) return;

    const x = Math.round(rawX / GRID) * GRID;
    const y = Math.round(rawY / GRID) * GRID;

    if (!this.isPlacementValid(x, y)) return;

    this.towers.push(new Tower(x, y, data, this.selectedTower));
    this.gold -= data.cost;
    this.updateUI();
  }

  isPlacementValid(x, y) {
    // Fuera del canvas
    if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) return false;

    // No sobre el camino
    // Reducimos el margen adicional para permitir colocar más cerca del camino
    if (this.isPointOnPath(x, y, PATH_WIDTH / 2 + 4)) return false;

    // No muy cerca de otra torre
    const minDist = 32;
    for (const t of this.towers) {
      if (Math.hypot(t.x - x, t.y - y) < minDist) return false;
    }
    return true;
  }

  isPointOnPath(px, py, extra = 0) {
    for (let i = 0; i < PATH_POINTS.length - 1; i++) {
      const a = PATH_POINTS[i];
      const b = PATH_POINTS[i + 1];
      const d = distanceToSegment(px, py, a.x, a.y, b.x, b.y);
      if (d <= PATH_WIDTH / 2 + extra) return true;
    }
    return false;
  }

  update(dt) {
    if (this.gameState !== 'playing') {
      this.updateEndAnimations(dt);
      return;
    }

    if (this.waveActive && this.wave) {
      this.wave.update(dt, this);
      if (this.wave.isFinished() && this.enemies.length === 0) {
        this.waveActive = false;
        this.waveIndex++;
        startBtn.disabled = false;
        if (this.waveIndex >= this.waves.length) {
          this.triggerVictory();
        }
      }
    }

    this.enemies.forEach(enemy => {
      const reachedEnd = enemy.update(dt);
      if (reachedEnd) this.enemyEscaped(enemy);
    });

    this.towers.forEach(t => t.update(dt, this.enemies, this.projectiles));

    this.projectiles.forEach(p => p.update(dt, this.enemies, this));
    this.projectiles = this.projectiles.filter(p => !p.done);

    this.updateUI();
  }

  updateUI() {
    goldEl.textContent = this.gold;
    livesEl.textContent = this.lives;
    waveEl.textContent = `${Math.min(this.waveIndex + 1, this.waves.length)}/${this.waves.length}`;
  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx);
    drawPath(ctx);

    // Torres
    this.towers.forEach(t => drawTower(ctx, t));

    // Rango previsualizado
    if (this.mouse.inside && this.selectedTower && this.gameState === 'playing') {
      const x = Math.round(this.mouse.x / GRID) * GRID;
      const y = Math.round(this.mouse.y / GRID) * GRID;
      const valid = this.isPlacementValid(x, y) && this.gold >= TOWER_TYPES[this.selectedTower].cost;
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = valid ? '#7bffb0' : '#ff7b7b';
      ctx.beginPath();
      ctx.arc(x, y, TOWER_TYPES[this.selectedTower].range, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = valid ? '#2fef7a' : '#ff4f4f';
      ctx.fillRect(x - 8, y - 8, 16, 16);
    }

    // Enemigos
    this.enemies.forEach(e => drawEnemy(ctx, e));

    // Proyectiles
    this.projectiles.forEach(p => drawProjectile(ctx, p));

    if (this.gameState === 'victory') drawVictoryFx(ctx, this.victoryFx);
    if (this.gameState === 'defeat') drawDefeatFx(ctx, this.defeatFx);
  }

  loop(timestamp) {
    const dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    this.update(dt);
    this.draw();
    requestAnimationFrame(t => this.loop(t));
  }

  triggerVictory() {
    this.gameState = 'victory';
    overlay.classList.remove('hidden');
    overlayContent.innerHTML = '¡GROENLANDIA ES LIBRE!<br>Misil sobre BURGER INVASION';
    this.victoryFx = {
      missileY: -80,
      missileX: 560,
      targetY: 360,
      exploded: false,
      particles: []
    };
  }

  triggerDefeat() {
    this.gameState = 'defeat';
    overlay.classList.remove('hidden');
    overlayContent.innerHTML = 'GROENLANDIA HA CAÍDO...<br>Invasión comercial en curso';
    this.defeatFx = { dots: [], timer: 0 };
  }

  updateEndAnimations(dt) {
    if (this.gameState === 'victory' && this.victoryFx) {
      const fx = this.victoryFx;
      if (!fx.exploded) {
        fx.missileY += 240 * dt;
        if (fx.missileY >= fx.targetY) {
          fx.exploded = true;
          for (let i = 0; i < 40; i++) {
            fx.particles.push({
              x: fx.missileX,
              y: fx.targetY,
              vx: (Math.random() - 0.5) * 160,
              vy: (Math.random() - 0.5) * 160,
              life: 1 + Math.random()
            });
          }
        }
      } else {
        fx.particles.forEach(p => {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
        });
        fx.particles = fx.particles.filter(p => p.life > 0);
      }
    }

    if (this.gameState === 'defeat' && this.defeatFx) {
      const fx = this.defeatFx;
      fx.timer += dt;
      if (fx.timer > 0.3) {
        fx.timer = 0;
        const x = Math.random() * (canvas.width - 120) + 40;
        const y = Math.random() * (canvas.height - 120) + 40;
        fx.dots.push({ x, y, type: Math.random() > 0.5 ? 'burger' : 'tower' });
        if (fx.dots.length > 60) fx.dots.shift();
      }
    }
  }
}

// --- Dibujo de fondos y sprites pixel art ---
function drawBackground(ctx) {
  // Cielo
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, '#87ceeb');
  sky.addColorStop(1, '#e8f4f8');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Montañas
  const mountains = [
    { x: 100, y: 260, w: 240, h: 200 },
    { x: 360, y: 240, w: 260, h: 220 },
    { x: 620, y: 280, w: 220, h: 180 }
  ];
  ctx.fillStyle = '#c7d8e5';
  mountains.forEach(m => {
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(m.x + m.w / 2, m.y - m.h);
    ctx.lineTo(m.x + m.w, m.y);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#b3c9d8';
    ctx.fillRect(m.x + m.w / 2 - 6, m.y - m.h + 10, 12, m.h - 10);
    ctx.fillStyle = '#c7d8e5';
  });

  // Nieve base
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 400, canvas.width, 200);
  ctx.fillStyle = '#dfeff7';
  for (let i = 0; i < 14; i++) {
    const x = i * 60 + (i % 2 ? 10 : -10);
    ctx.fillRect(x, 380 + (i % 3) * 6, 40, 12);
  }
}

function drawPath(ctx) {
  ctx.strokeStyle = '#b07f5e';
  ctx.lineWidth = PATH_WIDTH;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(PATH_POINTS[0].x, PATH_POINTS[0].y);
  for (let i = 1; i < PATH_POINTS.length; i++) {
    ctx.lineTo(PATH_POINTS[i].x, PATH_POINTS[i].y);
  }
  ctx.stroke();

  // Borde nevado
  ctx.strokeStyle = '#e8d9c7';
  ctx.lineWidth = 6;
  ctx.stroke();
}

function drawTower(ctx, tower) {
  // Pixel-art por tipo, inspirados en los diseños referencia, con animaciones simples
  ctx.save();
  const bob = Math.sin(tower.animTime * 3) * 1.5;
  ctx.translate(tower.x, tower.y + bob);
  const fx = Math.max(0, tower.shootFx);

  if (tower.typeKey === 'archer') {
    // Sombra suave
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(-11, 12, 22, 4);
    // Botas con suela
    ctx.fillStyle = '#5a3a1e';
    ctx.fillRect(-9, 10, 7, 4);
    ctx.fillRect(2, 10, 7, 4);
    ctx.fillStyle = '#2f1c10';
    ctx.fillRect(-9, 13, 7, 2);
    ctx.fillRect(2, 13, 7, 2);
    // Piernas
    ctx.fillStyle = '#9b7b52';
    ctx.fillRect(-8, 4, 6, 6);
    ctx.fillRect(2, 4, 6, 6);
    // Abrigo con ribete
    ctx.fillStyle = '#c8b08a';
    ctx.fillRect(-11, -4, 22, 13);
    ctx.fillStyle = '#f2dec0';
    ctx.fillRect(-11, -4, 22, 3);
    ctx.fillStyle = '#6b4325';
    ctx.fillRect(-11, 2, 22, 3); // cinturón
    ctx.fillStyle = '#f2dec0';
    ctx.fillRect(-3, 2, 6, 3); // hebilla
    // Mangas y guantes (ligero movimiento con fx)
    ctx.fillStyle = '#c8b08a';
    ctx.fillRect(-13, -2 + fx * -4, 6, 9 + fx * 2);
    ctx.fillRect(7, -2 + fx * -4, 6, 9 + fx * 2);
    ctx.fillStyle = '#6b4325';
    ctx.fillRect(-13, 4 + fx * -2, 6, 3);
    ctx.fillRect(7, 4 + fx * -2, 6, 3);
    ctx.fillStyle = '#2f1c10';
    ctx.fillRect(-12, 6 + fx * -2, 4, 2);
    ctx.fillRect(8, 6 + fx * -2, 4, 2);
    // Capucha y cabeza
    ctx.fillStyle = '#d9c9a5';
    ctx.fillRect(-13, -16, 26, 11);
    ctx.fillStyle = '#b49a70';
    ctx.fillRect(-13, -16, 26, 2);
    ctx.fillStyle = '#f2dec0';
    ctx.fillRect(-7, -11, 14, 9); // cara
    ctx.fillStyle = '#2a1c10';
    ctx.fillRect(-7, -11, 14, 3); // cabello
    ctx.fillStyle = '#111';
    ctx.fillRect(-4, -7, 3, 1);
    ctx.fillRect(1, -7, 3, 1);
    ctx.fillStyle = '#d3b28b';
    ctx.fillRect(0, -6, 2, 2); // nariz
    ctx.fillStyle = '#b49a70';
    ctx.fillRect(-9, -5, 4, 3); // ribete capucha
    ctx.fillRect(5, -5, 4, 3);
    // Arco y flecha animada
    const arrowExt = 12 + fx * 26;
    ctx.fillStyle = '#915227';
    ctx.fillRect(10, -12, 2, 26);
    ctx.fillStyle = '#c0773d';
    ctx.fillRect(12, -12, 2, 26);
    ctx.fillStyle = '#d9b07a';
    ctx.fillRect(12, -12, 1, 26); // cuerda
    ctx.fillStyle = '#d9f1ff';
    ctx.fillRect(12, -1, arrowExt, 2); // flecha animada
    ctx.fillStyle = '#b0d6ff';
    ctx.fillRect(12 + arrowExt, -2, 3, 4); // punta
    ctx.fillStyle = '#f2dec0';
    ctx.fillRect(10, -4, 4, 2); // plumas
    ctx.fillRect(10, 2, 4, 2);
    ctx.fillStyle = '#6b4325';
    ctx.fillRect(8, -1, 4, 3); // mano sujetando flecha
  } else if (tower.typeKey === 'ice') {
    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(-16, 12, 32, 5);
    // Nieve base
    ctx.fillStyle = '#e8f7ff';
    ctx.fillRect(-18, 8, 36, 9);
    ctx.fillStyle = '#c7e9ff';
    ctx.fillRect(-18, 15, 36, 2);
    // Bloques de hielo con bordes
    ctx.fillStyle = '#8fd8ff';
    ctx.fillRect(-14, 4, 12, 7);
    ctx.fillRect(-2, 4, 12, 7);
    ctx.fillRect(10, 4, 12, 7);
    ctx.fillRect(-12, -2, 12, 7);
    ctx.fillRect(0, -2, 12, 7);
    ctx.fillStyle = '#b8ecff';
    ctx.fillRect(-10, -6, 8, 5);
    ctx.fillRect(2, -6, 8, 5);
    ctx.fillStyle = '#5aa8dd';
    ctx.fillRect(-14, 4, 12, 1);
    ctx.fillRect(-2, 4, 12, 1);
    ctx.fillRect(10, 4, 12, 1);
    // Hojas de hielo
    ctx.fillStyle = '#b8ecff';
    ctx.fillRect(-20, -2, 6, 16);
    ctx.fillRect(-12, -6, 6, 20);
    ctx.fillRect(-4, 2, 6, 14);
    // Cañón con retroceso y detalles
    const recoil = fx * -6;
    ctx.fillStyle = '#7fc8ff';
    ctx.fillRect(-2 + recoil, -14, 22, 14);
    ctx.fillStyle = '#5aa8dd';
    ctx.fillRect(6 + recoil, -12, 12, 10);
    ctx.fillStyle = '#aee4ff';
    ctx.fillRect(16 + recoil, -14, 8, 14);
    ctx.fillStyle = '#1f486d';
    ctx.fillRect(18 + recoil, -10, 5, 8); // boca
    // Grietas y brillos
    ctx.fillStyle = '#c7f0ff';
    ctx.fillRect(0 + recoil, -12, 4, 2);
    ctx.fillRect(10 + recoil, -8, 3, 2);
    ctx.fillRect(14 + recoil, -6, 2, 2);
    ctx.fillStyle = '#4a90d9';
    ctx.fillRect(8 + recoil, -4, 2, 2);
    // Destellos y bola
    ctx.fillStyle = '#e8f7ff';
    ctx.fillRect(2 + recoil, -16, 12, 4);
    ctx.fillRect(20 + recoil, -18, 5, 5); // chispa
    const blast = 10 + fx * 34;
    ctx.fillStyle = '#dff7ff';
    ctx.fillRect(24 + recoil, -9, blast, 9);
    ctx.fillStyle = '#b8ecff';
    ctx.fillRect(24 + recoil + blast - 7, -7, 7, 5);
  } else if (tower.typeKey === 'catapult') {
    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(-18, 12, 36, 5);
    // Ruedas con llanta
    ctx.fillStyle = '#4a2f1c';
    ctx.fillRect(-16, 8, 9, 9);
    ctx.fillRect(7, 8, 9, 9);
    ctx.fillStyle = '#2d1b0f';
    ctx.fillRect(-14, 10, 5, 5);
    ctx.fillRect(9, 10, 5, 5);
    // Base
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(-18, 4, 36, 6);
    ctx.fillStyle = '#c28b52';
    ctx.fillRect(-18, 2, 36, 4);
    // Placas metálicas y pernos
    ctx.fillStyle = '#9ea1a8';
    ctx.fillRect(-16, 2, 7, 3);
    ctx.fillRect(9, 2, 7, 3);
    ctx.fillStyle = '#555';
    ctx.fillRect(-14, 3, 3, 2);
    ctx.fillRect(11, 3, 3, 2);
    // Soportes verticales
    ctx.fillStyle = '#a76a35';
    ctx.fillRect(-11, -8, 7, 19);
    ctx.fillRect(4, -8, 7, 19);
    // Soporte diagonal
    ctx.fillRect(-2, -2, 4, 10);
    // Brazo principal con movimiento
    const armLift = fx * 18;
    ctx.fillStyle = '#c28b52';
    ctx.fillRect(-2, -16 - armLift, 7, 26 + armLift);
    ctx.fillStyle = '#a76a35';
    ctx.fillRect(-5, -2, 12, 4);
    // Cuchara y piedra
    ctx.fillStyle = '#d9b07a';
    ctx.fillRect(7, -22 - armLift, 14, 9);
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(9, -24 - armLift, 10, 4);
    ctx.fillStyle = '#7a7370';
    ctx.fillRect(11, -24 - armLift, 9, 6);
    // Refuerzo central
    ctx.fillStyle = '#5a3a1e';
    ctx.fillRect(-7, -6, 14, 4);
  } else {
    // Fallback simple
    ctx.fillStyle = tower.data.color;
    ctx.fillRect(-10, -14, 20, 28);
  }
  ctx.restore();
}

function drawEnemy(ctx, e) {
  ctx.save();
  const wobble = Math.sin(e.animTime * 4) * 2;
  const flap = Math.sin(e.animTime * 8) * 3;
  const hop = Math.sin(e.animTime * 6) * 1.8;
  ctx.translate(e.x, e.y);

  if (e.type === ENEMY_TYPES.eagle) {
    // Alas grandes
    ctx.fillStyle = '#5a3a1e';
    ctx.fillRect(-26, -2 + flap, 12, 20);
    ctx.fillRect(14, -2 - flap, 12, 20);
    ctx.fillStyle = '#3f2918';
    ctx.fillRect(-26, 14 + flap, 12, 4);
    ctx.fillRect(14, 14 - flap, 12, 4);
    // Cuerpo
    ctx.fillStyle = '#5a3a1e';
    ctx.fillRect(-12, -8 + hop, 24, 16);
    ctx.fillStyle = '#3f2918';
    ctx.fillRect(-12, 4 + hop, 24, 4);
    // Pecho
    ctx.fillStyle = '#c79b63';
    ctx.fillRect(-8, -6 + hop, 16, 10);
    ctx.fillStyle = '#b2844f';
    ctx.fillRect(-6, -2 + hop, 12, 4);
    // Cabeza
    ctx.fillStyle = '#5a3a1e';
    ctx.fillRect(-8, -16 + hop, 16, 10);
    ctx.fillStyle = '#c79b63';
    ctx.fillRect(-8, -14 + hop, 16, 4);
    // Pico
    ctx.fillStyle = '#f2b530';
    ctx.fillRect(6, -10 + hop, 7, 4);
    ctx.fillRect(11, -8 + hop, 3, 2);
    // Gafas
    ctx.fillStyle = '#2b2b2b';
    ctx.fillRect(-8, -12 + hop, 7, 2);
    ctx.fillRect(1, -12 + hop, 7, 2);
    ctx.fillRect(-1, -12 + hop, 2, 2);
    // Patas
    ctx.fillStyle = '#f2b530';
    ctx.fillRect(-6, 6 + hop, 4, 8);
    ctx.fillRect(2, 6 + hop, 4, 8);
    ctx.fillRect(-8, 12 + hop, 6, 2);
    ctx.fillRect(2, 12 + hop, 6, 2);
    ctx.fillStyle = '#c0792c';
    ctx.fillRect(-6, 14 + hop, 4, 2);
    ctx.fillRect(2, 14 + hop, 4, 2);
  } else if (e.type === ENEMY_TYPES.truck) {
    ctx.translate(0, hop);
    // Ruedas con relieves
    ctx.fillStyle = '#151515';
    ctx.fillRect(-24, 8, 15, 15);
    ctx.fillRect(-4, 8, 15, 15);
    ctx.fillRect(16, 8, 15, 15);
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(-20, 12, 7, 7);
    ctx.fillRect(0, 12, 7, 7);
    ctx.fillRect(20, 12, 7, 7);
    // Chasis inferior
    ctx.fillStyle = '#2d2d2d';
    ctx.fillRect(-28, 4, 64, 6);
    ctx.fillStyle = '#8e9bab';
    ctx.fillRect(-26, 2, 60, 4);
    // Carrocería
    ctx.fillStyle = '#d02f2f';
    ctx.fillRect(-24, -12, 58, 16);
    ctx.fillRect(8, -16, 20, 4);
    // Ventanas y puertas
    ctx.fillStyle = '#6fa4d9';
    ctx.fillRect(-6, -10, 16, 8);
    ctx.fillRect(14, -14, 12, 7);
    ctx.fillStyle = '#2d2d2d';
    ctx.fillRect(8, -10, 2, 8);
    ctx.fillRect(6, -8, 2, 6); // espejo
    // Parrilla
    ctx.fillStyle = '#c0c6d2';
    ctx.fillRect(-28, -8, 12, 10);
    ctx.fillStyle = '#8e9bab';
    ctx.fillRect(-26, -6, 8, 6);
    // Faros
    ctx.fillStyle = '#f5f2d0';
    ctx.fillRect(-24, -6, 4, 4);
    ctx.fillRect(-18, -6, 4, 4);
    // Bandera
    ctx.fillStyle = '#2d2d2d';
    ctx.fillRect(30, -24, 2, 14);
    ctx.fillRect(32, -24, 12, 10);
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(36, -22, 4, 4);
    ctx.fillRect(34, -20, 2, 2);
  } else if (e.type === ENEMY_TYPES.burger) {
    ctx.translate(0, hop);
    const tilt = Math.sin(e.animTime * 3) * 2;
    // Sombrero
    ctx.fillStyle = '#1f1f1f';
    ctx.fillRect(-8 + tilt, -22, 18, 5);
    ctx.fillRect(-4 + tilt, -28, 10, 7);
    ctx.fillStyle = '#d02f2f';
    ctx.fillRect(-8 + tilt, -24, 18, 2);
    // Pan superior
    ctx.fillStyle = '#d69b4b';
    ctx.fillRect(-18, -10, 36, 14);
    ctx.fillStyle = '#f2c178';
    ctx.fillRect(-16, -13, 32, 4);
    // Semillas
    ctx.fillStyle = '#f7e3b6';
    ctx.fillRect(-12, -8, 3, 1);
    ctx.fillRect(-6, -6, 3, 1);
    ctx.fillRect(0, -7, 3, 1);
    ctx.fillRect(8, -5, 3, 1);
    ctx.fillRect(12, -6, 3, 1);
    // Lechuga
    ctx.fillStyle = '#6fcf52';
    ctx.fillRect(-20, 2, 40, 5);
    ctx.fillRect(-14, -1, 28, 4);
    // Queso
    ctx.fillStyle = '#f2b530';
    ctx.fillRect(-18, 7, 36, 7);
    ctx.fillRect(-8, 12, 16, 5);
    // Carne doble
    ctx.fillStyle = '#7a3f1f';
    ctx.fillRect(-18, 14, 36, 7);
    ctx.fillRect(-18, 21, 36, 7);
    // Pan inferior
    ctx.fillStyle = '#d69b4b';
    ctx.fillRect(-18, 28, 36, 6);
    // Patas
    ctx.fillStyle = '#7a3f1f';
    ctx.fillRect(-11, 34, 7, 7);
    ctx.fillRect(4, 34, 7, 7);
    ctx.fillRect(-13, 40, 9, 2);
    ctx.fillRect(2, 40, 9, 2);
  } else {
    // Fallback simple
    ctx.fillStyle = e.type.color;
    ctx.fillRect(-e.size / 2, -e.size / 2, e.size, e.size);
  }

  ctx.restore();

  // Barra de vida
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(e.x - e.size / 2, e.y - e.size / 2 - 12, e.size, 4);
  ctx.fillStyle = '#4af57a';
  ctx.fillRect(e.x - e.size / 2, e.y - e.size / 2 - 12, (e.hp / e.maxHp) * e.size, 4);
}

function drawProjectile(ctx, p) {
  ctx.fillStyle = p.type === TOWER_TYPES.catapult ? '#c28b52' : '#5bd1ff';
  ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
}

function drawVictoryFx(ctx, fx) {
  if (!fx) return;
  // Tienda burger
  ctx.fillStyle = '#f4c542';
  ctx.fillRect(500, 360, 140, 80);
  ctx.fillStyle = '#d48340';
  ctx.fillRect(500, 340, 140, 20);
  ctx.fillStyle = '#2b1c0f';
  ctx.fillRect(520, 400, 30, 40);
  ctx.fillStyle = '#000';
  ctx.fillRect(540, 350, 80, 10);
  ctx.fillStyle = '#fff';
  ctx.fillText('BURGER', 515, 355);
  ctx.fillText('INVASION', 505, 370);

  if (!fx.exploded) {
    ctx.fillStyle = '#d9e7ff';
    ctx.fillRect(fx.missileX - 4, fx.missileY - 14, 8, 28);
    ctx.fillStyle = '#ff5555';
    ctx.fillRect(fx.missileX - 6, fx.missileY - 4, 12, 8);
  } else {
    fx.particles.forEach(p => {
      ctx.fillStyle = '#ffec85';
      ctx.fillRect(p.x, p.y, 4, 4);
      ctx.fillStyle = '#ff7b5f';
      ctx.fillRect(p.x + 1, p.y + 1, 3, 3);
    });
  }
}

function drawDefeatFx(ctx, fx) {
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  fx.dots.forEach(dot => {
    if (dot.type === 'burger') {
      ctx.fillStyle = '#f4c542';
      ctx.fillRect(dot.x, dot.y, 12, 8);
      ctx.fillStyle = '#b36b2c';
      ctx.fillRect(dot.x, dot.y + 6, 12, 4);
      ctx.fillStyle = '#ff1e1e';
      ctx.fillRect(dot.x + 3, dot.y - 6, 6, 6); // arco dorado mock
    } else {
      ctx.fillStyle = '#d9d168';
      ctx.fillRect(dot.x, dot.y, 10, 30);
      ctx.fillStyle = '#eecf48';
      ctx.fillRect(dot.x - 6, dot.y - 14, 22, 14);
      ctx.fillStyle = '#ffef9a';
      ctx.fillRect(dot.x - 2, dot.y - 20, 10, 6);
    }
  });
}

// --- Utilidades ---
function distanceToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  return Math.hypot(px - projX, py - projY);
}

// Iniciar juego
new Game();
