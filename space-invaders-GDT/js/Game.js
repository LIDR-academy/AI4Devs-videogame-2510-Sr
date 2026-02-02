// ============================================================================
// MAIN GAME CLASS
// ============================================================================

import { CONFIG } from './config.js';
import { GameState } from './GameState.js';
import { Player } from './entities/Player.js';
import { Enemy } from './entities/Enemy.js';
import { DivingEnemy } from './entities/DivingEnemy.js';
import { Bullet } from './entities/Bullet.js';
import { PowerUp } from './entities/PowerUp.js';
import { BonusUFO } from './entities/BonusUFO.js';
import { Particle } from './entities/Particle.js';

export class Game {
    constructor() {
        this._initCanvas();
        this._initState();
        this._initTimers();
        this._initImages();
        this._setupEventListeners();
        this.updateUI();
    }

    _initCanvas() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
    }

    _initState() {
        this.state = new GameState();
        this.keys = {};
        this.player = null;
        this.enemies = [];
        this.divingEnemies = [];
        this.bullets = [];
        this.particles = [];
        this.powerUps = [];
        this.bonusUFO = null;
    }

    _initTimers() {
        this.lastUFOSpawn = 0;
        this.lastDiveAttack = 0;
        this.lastEnemyShot = 0;
        this.canShoot = true;
        this.enemyDirection = 1;
        this.enemySpeed = CONFIG.enemy.speed;
    }

    _initImages() {
        this.images = {
            player: new Image(),
            enemies: [new Image(), new Image(), new Image(), new Image()]
        };
        const cacheBuster = '?v=' + Date.now();
        this.images.player.src = 'assets/images/player.png' + cacheBuster;
        this.images.enemies.forEach((img, i) => {
            img.src = `assets/images/enemy${i + 1}.png` + cacheBuster;
        });
    }

    _setupEventListeners() {
        this._setupKeyboardEvents();
        this._setupButtonEvents();
    }

    _setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;

            if (e.key === ' ' && this.state.isRunning && !this.state.isPaused) {
                e.preventDefault();
                this.playerShoot();
            }
            if (e.key === 'p' || e.key === 'P') {
                this.togglePause();
            }
            if ((e.key === 'r' || e.key === 'R') && this.state.gameOver) {
                this.restart();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    _setupButtonEvents() {
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
        document.getElementById('nextLevelBtn').addEventListener('click', () => this.nextLevel());
    }

    // ========================================================================
    // GAME LIFECYCLE
    // ========================================================================

    start() {
        this.state.isRunning = true;
        this.state.isPaused = false;
        this.state.gameOver = false;
        this.setupLevel();
        this.updateUI();
        this.updateButtons();
        this.gameLoop();
    }

    setupLevel() {
        this._createPlayer();
        this._createEnemies();
        this._resetLevelState();
    }

    _createPlayer() {
        this.player = new Player(
            CONFIG.canvas.width / 2,
            CONFIG.canvas.height - 60,
            this.images.player
        );
    }

    _createEnemies() {
        this.enemies = [];
        this.enemySpeed = CONFIG.enemy.speed + (this.state.level - 1) * 0.3;

        for (let row = 0; row < CONFIG.enemy.rows; row++) {
            for (let col = 0; col < CONFIG.enemy.cols; col++) {
                const x = CONFIG.enemy.offsetX + col * (CONFIG.enemy.width + CONFIG.enemy.padding);
                const y = CONFIG.enemy.offsetY + row * (CONFIG.enemy.height + CONFIG.enemy.padding);
                const enemyImage = this.images.enemies[row % this.images.enemies.length];
                this.enemies.push(new Enemy(x, y, row, enemyImage));
            }
        }
    }

    _resetLevelState() {
        this.bullets = [];
        this.particles = [];
        this.powerUps = [];
        this.bonusUFO = null;
        this.divingEnemies = [];
        this.lastUFOSpawn = Date.now();
        this.lastDiveAttack = Date.now();
        this.enemyDirection = 1;
    }

    togglePause() {
        if (!this.state.isRunning || this.state.gameOver) return;
        this.state.isPaused = !this.state.isPaused;
        this.updateButtons();
        if (!this.state.isPaused) {
            this.gameLoop();
        }
    }

    restart() {
        document.getElementById('gameOverScreen').classList.add('hidden');
        this.state.reset();
        this.updateUI();
        this.start();
    }

    nextLevel() {
        document.getElementById('levelCompleteScreen').classList.add('hidden');
        this.state.level++;
        this.state.isPaused = false;
        this.setupLevel();
        this.updateUI();
        this.gameLoop();
    }

    gameOver() {
        this.state.gameOver = true;
        this.state.isRunning = false;
        document.getElementById('finalScore').textContent = this.state.score;
        document.getElementById('gameOverScreen').classList.remove('hidden');
        this.updateButtons();
    }

    levelComplete() {
        this.state.isPaused = true;
        document.getElementById('levelScore').textContent = this.state.score;
        document.getElementById('levelCompleteScreen').classList.remove('hidden');
    }

    loseLife() {
        this.state.lives--;
        this.updateUI();
        this.createExplosion(this.player.x, this.player.y, CONFIG.player.color);

        if (this.state.lives <= 0) {
            this.gameOver();
        } else {
            this._createPlayer();
        }
    }

    // ========================================================================
    // PLAYER ACTIONS
    // ========================================================================

    playerShoot() {
        if (!this.canShoot) return;

        const newBullets = this.player.shoot();
        this.bullets.push(...newBullets);
        this.canShoot = false;

        const cooldown = this.player.hasRapidFire
            ? CONFIG.player.shootCooldown / 3
            : CONFIG.player.shootCooldown;

        setTimeout(() => {
            this.canShoot = true;
        }, cooldown);
    }

    // ========================================================================
    // SPAWNING LOGIC
    // ========================================================================

    spawnPowerUp(x, y) {
        if (Math.random() > CONFIG.powerUp.spawnChance) return;

        const types = ['rapidFire', 'shield', 'multiShot'];
        const randomType = types[Math.floor(Math.random() * types.length)];

        this.powerUps.push(new PowerUp(x, y, randomType));
    }

    enemyShoot() {
        const now = Date.now();
        if (now - this.lastEnemyShot < CONFIG.enemy.shotInterval) return;

        const shooters = this._getEnemyShooters();
        if (shooters.length === 0) return;

        const shooter = shooters[Math.floor(Math.random() * shooters.length)];
        this.bullets.push(new Bullet(shooter.x, shooter.y + shooter.height, false));
        this.lastEnemyShot = now;
    }

    _getEnemyShooters() {
        const aliveEnemies = this.enemies.filter(e => e.alive);
        if (aliveEnemies.length === 0) return [];

        return aliveEnemies.filter(enemy => {
            return !aliveEnemies.some(other =>
                other.alive &&
                Math.abs(other.x - enemy.x) < CONFIG.enemy.width / 2 &&
                other.y > enemy.y
            );
        });
    }

    spawnBonusUFO() {
        const now = Date.now();

        if (this.bonusUFO && this.bonusUFO.active) return;
        if (now - this.lastUFOSpawn < CONFIG.bonusUFO.spawnInterval) return;

        const direction = Math.random() > 0.5 ? 1 : -1;
        this.bonusUFO = new BonusUFO(direction);
        this.lastUFOSpawn = now;
    }

    spawnDivingEnemy() {
        const now = Date.now();

        if (now - this.lastDiveAttack < CONFIG.divingEnemy.spawnInterval) return;

        const aliveEnemies = this.enemies.filter(e => e.alive && !e.isDiving);
        if (aliveEnemies.length === 0) return;

        const selectedEnemy = this._selectDivingEnemy(aliveEnemies);
        if (!selectedEnemy) return;

        selectedEnemy.isDiving = true;
        const divingEnemy = new DivingEnemy(selectedEnemy, this.player.x, this.player.y);
        this.divingEnemies.push(divingEnemy);
        selectedEnemy.alive = false;

        this.lastDiveAttack = now;
    }

    _selectDivingEnemy(aliveEnemies) {
        if (Math.random() > 0.3) {
            const frontEnemies = aliveEnemies.filter(e => e.row >= 2);
            if (frontEnemies.length > 0) {
                return frontEnemies[Math.floor(Math.random() * frontEnemies.length)];
            }
        }
        return aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
    }

    // ========================================================================
    // UPDATE LOOP
    // ========================================================================

    update() {
        if (!this.state.isRunning || this.state.isPaused) return;

        this._updatePlayer();
        this._updateEnemies();
        this._updateProjectilesAndEffects();
        this.checkCollisions();
        this.checkGameState();
    }

    _updatePlayer() {
        if (this.keys['ArrowLeft']) {
            this.player.moveLeft();
        } else if (this.keys['ArrowRight']) {
            this.player.moveRight();
        } else {
            this.player.stop();
        }
        this.player.update();
        this.player.updatePowerUps(Date.now());
    }

    _updateEnemies() {
        this._updateEnemyFormation();
        this.enemyShoot();
        this.spawnBonusUFO();
        this.spawnDivingEnemy();

        if (this.bonusUFO && this.bonusUFO.active) {
            this.bonusUFO.update();
        }

        this.divingEnemies.forEach(enemy => {
            if (enemy.alive) enemy.update();
        });
        this.divingEnemies = this.divingEnemies.filter(e => e.alive);
    }

    _updateEnemyFormation() {
        const aliveEnemies = this.enemies.filter(e => e.alive);
        const shouldMoveDown = this._checkEnemyEdgeCollision(aliveEnemies);

        this.enemies.forEach(enemy => {
            if (shouldMoveDown) {
                enemy.update(0, CONFIG.enemy.dropDistance);
            } else {
                enemy.update(this.enemySpeed * this.enemyDirection, 0);
            }
        });

        if (shouldMoveDown) {
            this.enemyDirection *= -1;
        }
    }

    _checkEnemyEdgeCollision(aliveEnemies) {
        return aliveEnemies.some(enemy => {
            const nextX = enemy.x + this.enemySpeed * this.enemyDirection;
            return nextX > CONFIG.canvas.width - CONFIG.enemy.width / 2 ||
                   nextX < CONFIG.enemy.width / 2;
        });
    }

    _updateProjectilesAndEffects() {
        this.bullets.forEach(bullet => bullet.update());
        this.powerUps.forEach(powerUp => {
            if (powerUp.active) powerUp.update();
        });
        this.particles.forEach(particle => particle.update());

        this.bullets = this.bullets.filter(b => b.active);
        this.powerUps = this.powerUps.filter(p => p.active);
        this.particles = this.particles.filter(p => p.life > 0);
    }

    // ========================================================================
    // COLLISION DETECTION
    // ========================================================================

    checkCollisions() {
        this._checkPlayerBulletCollisions();
        this._checkPlayerCollisions();
        this._checkEnemyReachPlayer();
    }

    _checkPlayerBulletCollisions() {
        const playerBullets = this.bullets.filter(b => b.active && b.isPlayerBullet);

        for (let bullet of playerBullets) {
            this._checkBulletEnemyCollision(bullet);
            this._checkBulletDivingEnemyCollision(bullet);
            this._checkBulletUFOCollision(bullet);
        }
    }

    _checkBulletEnemyCollision(bullet) {
        for (let enemy of this.enemies.filter(e => e.alive)) {
            if (this.isColliding(bullet, enemy)) {
                bullet.active = false;
                enemy.alive = false;
                this.state.score += 10 * this.state.level;
                this.createExplosion(enemy.x, enemy.y, CONFIG.enemy.colors[enemy.row]);
                this.spawnPowerUp(enemy.x, enemy.y);
                this.updateUI();
                break;
            }
        }
    }

    _checkBulletDivingEnemyCollision(bullet) {
        for (let divingEnemy of this.divingEnemies.filter(e => e.alive)) {
            if (this.isColliding(bullet, divingEnemy)) {
                bullet.active = false;
                divingEnemy.alive = false;
                this.state.score += 25 * this.state.level;
                this.createExplosion(divingEnemy.x, divingEnemy.y, CONFIG.enemy.colors[divingEnemy.row]);
                this.spawnPowerUp(divingEnemy.x, divingEnemy.y);
                this.updateUI();
                break;
            }
        }
    }

    _checkBulletUFOCollision(bullet) {
        if (!this.bonusUFO || !this.bonusUFO.active) return;

        const ufoHitbox = {
            x: this.bonusUFO.x - this.bonusUFO.width / 2,
            y: this.bonusUFO.y,
            width: this.bonusUFO.width,
            height: this.bonusUFO.height
        };
        const bulletHitbox = {
            x: bullet.x - bullet.width / 2,
            y: bullet.y,
            width: bullet.width,
            height: bullet.height
        };

        if (this.isCollidingRect(bulletHitbox, ufoHitbox)) {
            bullet.active = false;
            this.bonusUFO.active = false;
            this.state.score += this.bonusUFO.points;
            this.createExplosion(this.bonusUFO.x, this.bonusUFO.y, '#ff0080');
            this.showBonusScore(this.bonusUFO.x, this.bonusUFO.y, this.bonusUFO.points);
            this.updateUI();
        }
    }

    _checkPlayerCollisions() {
        this._checkPowerUpCollection();
        this._checkEnemyBulletHit();
        this._checkDivingEnemyCollision();
    }

    _checkPowerUpCollection() {
        for (let powerUp of this.powerUps.filter(p => p.active)) {
            const powerUpHitbox = {
                x: powerUp.x - powerUp.width / 2,
                y: powerUp.y - powerUp.height / 2,
                width: powerUp.width,
                height: powerUp.height
            };
            const playerHitbox = {
                x: this.player.x - this.player.width / 2,
                y: this.player.y,
                width: this.player.width,
                height: this.player.height
            };

            if (this.isCollidingRect(powerUpHitbox, playerHitbox)) {
                powerUp.active = false;
                this.player.activatePowerUp(powerUp.type);
                this.createExplosion(powerUp.x, powerUp.y, '#ffffff');
                this.state.score += 50;
                this.updateUI();
            }
        }
    }

    _checkEnemyBulletHit() {
        for (let bullet of this.bullets.filter(b => b.active && !b.isPlayerBullet)) {
            if (this.isColliding(bullet, this.player)) {
                bullet.active = false;
                this._handlePlayerHit();
            }
        }
    }

    _checkDivingEnemyCollision() {
        for (let divingEnemy of this.divingEnemies.filter(e => e.alive)) {
            if (this.isColliding(divingEnemy, this.player)) {
                divingEnemy.alive = false;
                this.createExplosion(divingEnemy.x, divingEnemy.y, CONFIG.enemy.colors[divingEnemy.row]);
                this._handlePlayerHit();
            }
        }
    }

    _handlePlayerHit() {
        if (this.player.hasShield) {
            this.player.hasShield = false;
            this.createExplosion(this.player.x, this.player.y, '#00ccff');
        } else {
            this.loseLife();
        }
    }

    _checkEnemyReachPlayer() {
        for (let enemy of this.enemies.filter(e => e.alive)) {
            if (enemy.y + enemy.height >= this.player.y) {
                this.gameOver();
                return;
            }
        }
    }

    isColliding(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width / 2 &&
               obj1.x + obj1.width > obj2.x - obj2.width / 2 &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }

    isCollidingRect(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    checkGameState() {
        const aliveEnemies = this.enemies.filter(e => e.alive);
        if (aliveEnemies.length === 0) {
            this.levelComplete();
        }
    }

    // ========================================================================
    // VISUAL EFFECTS
    // ========================================================================

    createExplosion(x, y, color) {
        for (let i = 0; i < 15; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    showBonusScore(x, y, points) {
        const scoreDisplay = {
            x, y, points,
            life: 60,
            draw(ctx) {
                ctx.fillStyle = '#ffff00';
                ctx.font = 'bold 20px Courier New';
                ctx.textAlign = 'center';
                ctx.globalAlpha = this.life / 60;
                ctx.fillText('+' + this.points, this.x, this.y);
                ctx.globalAlpha = 1;
            },
            update() {
                this.y -= 1;
                this.life--;
            }
        };
        this.particles.push(scoreDisplay);
    }

    // ========================================================================
    // RENDERING
    // ========================================================================

    draw() {
        this._clearCanvas();
        this._drawBackground();
        this._drawEntities();
        this._drawUI();
    }

    _clearCanvas() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
    }

    _drawBackground() {
        this.ctx.fillStyle = '#fff';
        for (let i = 0; i < 50; i++) {
            const x = (i * 137.5) % CONFIG.canvas.width;
            const y = (i * 197.3) % CONFIG.canvas.height;
            const size = (i % 3) + 1;
            this.ctx.fillRect(x, y, size, size);
        }
    }

    _drawEntities() {
        if (this.player) this.player.draw(this.ctx);

        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.divingEnemies.forEach(enemy => {
            if (enemy.alive) enemy.draw(this.ctx);
        });

        if (this.bonusUFO && this.bonusUFO.active) {
            this.bonusUFO.draw(this.ctx);
        }

        this.bullets.forEach(bullet => bullet.draw(this.ctx));
        this.powerUps.forEach(powerUp => {
            if (powerUp.active) powerUp.draw(this.ctx);
        });
        this.particles.forEach(particle => particle.draw(this.ctx));
    }

    _drawUI() {
        if (this.state.isPaused && !this.state.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
            this.ctx.font = '48px Courier New';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', CONFIG.canvas.width / 2, CONFIG.canvas.height / 2);
        }
    }

    updateUI() {
        document.getElementById('score').textContent = this.state.score;
        document.getElementById('lives').textContent = this.state.lives;
        document.getElementById('level').textContent = this.state.level;
    }

    updateButtons() {
        document.getElementById('startBtn').disabled = this.state.isRunning;
        document.getElementById('pauseBtn').disabled = !this.state.isRunning || this.state.gameOver;
    }

    // ========================================================================
    // GAME LOOP
    // ========================================================================

    gameLoop() {
        if (!this.state.isRunning || this.state.isPaused) return;

        this.update();
        this.draw();

        requestAnimationFrame(() => this.gameLoop());
    }
}
