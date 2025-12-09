// ==========================================
// SkyAce - Motor Principal del Juego
// ==========================================

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Configurar canvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Estados del juego
        this.states = {
            MENU: 'menu',
            PLAYING: 'playing',
            PAUSED: 'paused',
            GAME_OVER: 'gameOver'
        };
        this.currentState = this.states.MENU;
        
        // Variables del juego
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.highScore = parseInt(localStorage.getItem('skyaceHighScore')) || 0;
        
        // Sistemas del juego
        this.bulletManager = new BulletManager();
        this.enemyManager = new EnemyManager(this.bulletManager);
        this.powerUpManager = new PowerUpManager();
        this.particles = new ParticleSystem();
        
        // Jugador
        this.player = new Player(
            this.canvas.width / 2,
            this.canvas.height - 100,
            this.canvas.width,
            this.canvas.height
        );
        
        // Sistema de colisiones
        this.collision = new CollisionDetector(this);
        
        // Controles
        this.keys = {};
        this.setupControls();
        
        // UI Elements
        this.startScreen = document.getElementById('startScreen');
        this.pauseScreen = document.getElementById('pauseScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        
        // Botones
        document.getElementById('startButton').addEventListener('click', () => this.startGame());
        document.getElementById('restartButton').addEventListener('click', () => this.restartGame());
        
        // Bot\u00f3n de m\u00fasica
        this.musicToggleBtn = document.getElementById('musicToggle');
        this.musicToggleBtn.addEventListener('click', () => this.toggleMusic());
        
        // Game loop
        this.lastTime = 0;
        this.animationId = null;
        
        // Background scroll
        this.bgScroll = 0;
        this.bgSpeed = 50;
        
        // Level progression
        this.levelTimer = 0;
        this.levelDuration = 30; // Segundos por nivel
        
        // Sistema de audio
        this.music = new Audio('assets/music/skyace.mp3');
        this.music.loop = true;
        this.music.volume = 0.5; // Volumen al 50%
        this.musicEnabled = true;
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const maxWidth = 600;
        const maxHeight = 800;
        const aspectRatio = maxWidth / maxHeight;
        
        let width = container.clientWidth;
        let height = container.clientHeight;
        
        if (width / height > aspectRatio) {
            width = height * aspectRatio;
        } else {
            height = width / aspectRatio;
        }
        
        this.canvas.width = Math.min(width, maxWidth);
        this.canvas.height = Math.min(height, maxHeight);
        
        // Actualizar posición del jugador si existe
        if (this.player) {
            this.player.canvasWidth = this.canvas.width;
            this.player.canvasHeight = this.canvas.height;
        }
    }

    setupControls() {
        // Teclado
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            // Pausar con P
            if (e.key === 'p' || e.key === 'P') {
                if (this.currentState === this.states.PLAYING) {
                    this.pauseGame();
                } else if (this.currentState === this.states.PAUSED) {
                    this.resumeGame();
                }
            }
            
            // Evitar scroll con flechas
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
                e.preventDefault();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    startGame() {
        console.log('=== START GAME ===');
        // Cancelar game loop anterior si existe
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Cambiar estado y ocultar pantallas
        this.currentState = this.states.PLAYING;
        this.startScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
        
        // Resetear variables del juego
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.levelTimer = 0;
        this.bgScroll = 0;
        
        // Reset sistemas
        console.log('Clearing systems...');
        this.bulletManager.clear();
        this.enemyManager.clear();
        this.powerUpManager.clear();
        this.particles.clear();
        
        // Spawn inicial de enemigos para que aparezcan inmediatamente
        console.log('Calling spawnInitialEnemies...');
        this.enemyManager.spawnInitialEnemies(this.canvas.width);
        console.log('Active enemies after spawn:', this.enemyManager.getActiveEnemies().length);
        
        // Reset jugador
        this.player.reset(this.canvas.width / 2, this.canvas.height - 100);
        
        this.updateUI();
        
        // Iniciar música
        if (this.musicEnabled) {
            this.music.currentTime = 0;
            this.music.play().catch(e => {
                console.log('Audio autoplay bloqueado, se reproducirá con interacción del usuario');
            });
        }
        
        // Iniciar game loop inmediatamente
        this.lastTime = performance.now();
        this.gameLoop();
    }

    pauseGame() {
        this.currentState = this.states.PAUSED;
        this.pauseScreen.classList.remove('hidden');
        this.music.pause();
    }

    resumeGame() {
        this.currentState = this.states.PLAYING;
        this.pauseScreen.classList.add('hidden');
        this.lastTime = performance.now();
        if (this.musicEnabled) {
            this.music.play();
        }
    }

    restartGame() {
        this.gameOverScreen.classList.add('hidden');
        this.startGame();
    }
    
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        
        if (this.musicEnabled) {
            this.musicToggleBtn.textContent = '🔊';
            this.musicToggleBtn.classList.remove('muted');
            if (this.currentState === this.states.PLAYING) {
                this.music.play();
            }
        } else {
            this.musicToggleBtn.textContent = '🔇';
            this.musicToggleBtn.classList.add('muted');
            this.music.pause();
        }
    }

    gameOver() {
        this.currentState = this.states.GAME_OVER;
        this.gameOverScreen.classList.remove('hidden');
        document.getElementById('finalScore').textContent = this.score;
        
        // Actualizar high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('skyaceHighScore', this.highScore);
        }
        
        // Cancelar game loop
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Pausar música
        this.music.pause();
    }

    playerDeath() {
        this.lives--;
        this.updateUI();
        
        // Explosión grande
        this.particles.createExplosion(this.player.x, this.player.y, '#ff0000', 40);
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // Respawn del jugador
            this.player.reset(this.canvas.width / 2, this.canvas.height - 100);
            this.player.activateShield(); // Shield temporal
        }
    }

    addScore(points) {
        this.score += points;
        this.updateUI();
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
    }

    update(deltaTime) {
        if (this.currentState !== this.states.PLAYING) return;
        
        // Actualizar jugador
        this.player.moveLeft = this.keys['ArrowLeft'];
        this.player.moveRight = this.keys['ArrowRight'];
        this.player.moveUp = this.keys['ArrowUp'];
        this.player.moveDown = this.keys['ArrowDown'];
        this.player.shooting = this.keys[' '];
        
        this.player.update(deltaTime);
        
        // Disparar si se presiona espacio
        if (this.player.shooting) {
            this.player.shoot(this.bulletManager);
        }
        
        // Actualizar sistemas
        this.bulletManager.update(deltaTime, this.canvas.height);
        this.enemyManager.update(deltaTime, this.canvas.width, this.canvas.height);
        this.powerUpManager.update(deltaTime, this.canvas.width, this.canvas.height);
        this.particles.update(deltaTime);
        
        // Colisiones
        this.collision.checkAll();
        
        // Background scroll
        this.bgScroll += this.bgSpeed * deltaTime;
        if (this.bgScroll > this.canvas.height) {
            this.bgScroll = 0;
        }
        
        // Progresión de nivel
        this.levelTimer += deltaTime;
        if (this.levelTimer >= this.levelDuration) {
            this.levelTimer = 0;
            this.level++;
            this.enemyManager.increaseDifficulty();
            this.updateUI();
        }
    }

    drawBackground() {
        const ctx = this.ctx;
        
        // Gradiente base
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#000428');
        gradient.addColorStop(1, '#001a4d');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Estrellas (efecto parallax mejorado)
        ctx.fillStyle = '#ffffff';
        const starCount = 100;
        for (let i = 0; i < starCount; i++) {
            // Posición base fija para cada estrella
            const baseX = (i * 73) % this.canvas.width;
            const baseY = (i * 127) % this.canvas.height;
            
            // Aplicar scroll con wrap suave
            let y = baseY + this.bgScroll * 0.3;
            
            // Wrap cuando sale por abajo
            while (y > this.canvas.height) {
                y -= this.canvas.height;
            }
            
            // Wrap cuando sale por arriba (al resetear)
            while (y < 0) {
                y += this.canvas.height;
            }
            
            const size = (i % 3) + 1;
            const brightness = 0.5 + (i % 5) * 0.1;
            ctx.globalAlpha = brightness;
            ctx.fillRect(baseX, y, size, size);
        }
        ctx.globalAlpha = 1.0;
    }

    drawHUD() {
        const ctx = this.ctx;
        
        // Barra de vida del jugador
        const barWidth = 200;
        const barHeight = 20;
        const barX = 10;
        const barY = 30; // Movido más abajo para que el texto no se corte
        
        // Texto de vida (ahora arriba de la barra)
        Utils.drawText(ctx, `HEALTH: ${Math.floor(this.player.health)}`, barX, barY - 8, '#00ff00', 14);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
        
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        const healthPercent = this.player.health / this.player.maxHealth;
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        // Nivel de arma
        Utils.drawText(
            ctx, 
            `WEAPON: ${this.player.weaponLevel}`, 
            barX, 
            barY + barHeight + 20, 
            '#ffff00', 
            14
        );
        
        // High Score
        if (this.highScore > 0) {
            Utils.drawText(
                ctx,
                `HIGH: ${this.highScore}`,
                this.canvas.width - 120,
                20,
                '#ffaa00',
                14
            );
        }
    }

    draw() {
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dibujar background
        this.drawBackground();
        
        if (this.currentState === this.states.PLAYING || this.currentState === this.states.PAUSED) {
            // Dibujar elementos del juego
            this.bulletManager.draw(this.ctx);
            this.enemyManager.draw(this.ctx);
            this.powerUpManager.draw(this.ctx);
            this.player.draw(this.ctx);
            this.particles.draw(this.ctx);
            
            // Dibujar HUD
            this.drawHUD();
        }
    }

    gameLoop(currentTime = 0) {
        const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.draw();
        
        // Solo continuar el loop si no es game over o menu
        if (this.currentState === this.states.PLAYING || this.currentState === this.states.PAUSED) {
            this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
        }
    }
}

// Iniciar el juego cuando se cargue la página
window.addEventListener('load', () => {
    const game = new Game();
    console.log('SkyAce initialized!');
    console.log('Press START to play');
});
