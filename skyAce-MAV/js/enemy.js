// ==========================================
// SkyAce - Sistema de Enemigos
// ==========================================

class Enemy {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 32;
        this.height = 32;
        this.speed = 100;
        this.health = 30;
        this.maxHealth = 30;
        this.active = true;
        this.type = 'light'; // light, bomber, heavy, helicopter, miniboss
        this.shootTimer = 0;
        this.shootInterval = 2;
        this.movePattern = 'straight';
        this.moveTimer = 0;
        this.offsetX = 0;
        this.score = 100;
        this.sprite = null;
    }

    reset(x, y, type = 'light') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.active = true;
        this.moveTimer = 0;
        this.shootTimer = Utils.random(0, 1);
        
        // Configuración según tipo
        switch (type) {
            case 'light': // Caza ligero (rápido, débil)
                this.width = 32;
                this.height = 32;
                this.speed = 180;
                this.health = 20;
                this.maxHealth = 20;
                this.shootInterval = 2.5;
                this.movePattern = 'zigzag';
                this.score = 100;
                this.sprite = spriteManager.getSprite('enemyLight');
                break;
                
            case 'bomber': // Bombardero (lento, resistente)
                this.width = 48;
                this.height = 48;
                this.speed = 60;
                this.health = 100;
                this.maxHealth = 100;
                this.shootInterval = 3;
                this.movePattern = 'straight';
                this.score = 300;
                this.sprite = spriteManager.getSprite('enemyBomber');
                break;
                
            case 'heavy': // Caza pesado (medio, dispara más)
                this.width = 40;
                this.height = 40;
                this.speed = 120;
                this.health = 50;
                this.maxHealth = 50;
                this.shootInterval = 1.5;
                this.movePattern = 'sine';
                this.score = 200;
                this.sprite = spriteManager.getSprite('enemyHeavy');
                break;
                
            case 'helicopter': // Helicóptero (movimiento lateral)
                this.width = 48;
                this.height = 48;
                this.speed = 80;
                this.health = 60;
                this.maxHealth = 60;
                this.shootInterval = 2;
                this.movePattern = 'horizontal';
                this.score = 250;
                this.sprite = spriteManager.getSprite('enemyHelicopter');
                break;
                
            case 'miniboss': // Mini-Boss
                this.width = 64;
                this.height = 64;
                this.speed = 70;
                this.health = 250;
                this.maxHealth = 250;
                this.shootInterval = 0.8;
                this.movePattern = 'sine';
                this.score = 1000;
                this.sprite = spriteManager.getSprite('miniBoss');
                break;
        }
        
        this.offsetX = x;
    }

    update(deltaTime, canvasHeight, canvasWidth) {
        this.moveTimer += deltaTime;
        
        // Patrón de movimiento
        switch (this.movePattern) {
            case 'straight':
                this.y += this.speed * deltaTime;
                break;
            case 'zigzag':
                this.y += this.speed * deltaTime;
                this.x = this.offsetX + Math.sin(this.moveTimer * 3) * 50;
                break;
            case 'sine':
                this.y += this.speed * deltaTime;
                this.x = this.offsetX + Math.sin(this.moveTimer * 2) * 100;
                break;
            case 'horizontal':
                // Movimiento lateral (helicóptero)
                this.y += this.speed * deltaTime * 0.5; // Baja más lento
                this.x = this.offsetX + Math.sin(this.moveTimer * 1.5) * 150;
                break;
        }

        // Mantener dentro de los límites
        this.x = Utils.clamp(this.x, this.width / 2, canvasWidth - this.width / 2);

        // Desactivar si sale de la pantalla
        if (this.y > canvasHeight + this.height) {
            this.active = false;
        }
    }

    canShoot(deltaTime) {
        this.shootTimer += deltaTime;
        if (this.shootTimer >= this.shootInterval) {
            this.shootTimer = 0;
            return true;
        }
        return false;
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.active = false;
            return true; // Enemigo destruido
        }
        return false;
    }

    draw(ctx) {
        ctx.save();

        // Dibujar sprite si existe
        if (this.sprite) {
            // Efecto de daño (parpadeo blanco si está herido)
            const healthPercent = this.health / this.maxHealth;
            if (healthPercent < 0.3 && Math.floor(this.moveTimer * 10) % 2 === 0) {
                ctx.filter = 'brightness(2)';
            }
            
            ctx.drawImage(
                this.sprite,
                this.x - this.width / 2,
                this.y - this.height / 2,
                this.width,
                this.height
            );
            
            ctx.filter = 'none';
        } else {
            // Fallback: Color según tipo (si no hay sprite)
            let color;
            switch (this.type) {
                case 'light':
                    color = '#DC143C';
                    break;
                case 'bomber':
                    color = '#556B2F';
                    break;
                case 'heavy':
                    color = '#FF8C00';
                    break;
                case 'helicopter':
                    color = '#708090';
                    break;
                case 'miniboss':
                    color = '#4B0082';
                    break;
            }

            // Efecto de daño (parpadeo rojo si está herido)
            const healthPercent = this.health / this.maxHealth;
            if (healthPercent < 0.3 && Math.floor(this.moveTimer * 10) % 2 === 0) {
                color = '#ffffff';
            }

            // Sombra y brillo
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;

            // Cuerpo del enemigo (nave)
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + this.height / 2);
            ctx.lineTo(this.x - this.width / 2, this.y - this.height / 2);
            ctx.lineTo(this.x, this.y - this.height / 4);
            ctx.lineTo(this.x + this.width / 2, this.y - this.height / 2);
            ctx.closePath();
            ctx.fill();

            // Alas
            ctx.fillStyle = color;
            ctx.fillRect(this.x - this.width / 2, this.y - 5, this.width, 10);

            // Cabina
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Barra de vida (solo para enemigos con mucha vida)
        const healthPercent = this.health / this.maxHealth;
        if (this.maxHealth >= 50) {
            const barWidth = this.width;
            const barHeight = 4;
            const barX = this.x - barWidth / 2;
            const barY = this.y - this.height / 2 - 10;

            ctx.fillStyle = '#ff0000';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
            ctx.strokeStyle = '#ffffff';
            ctx.strokeRect(barX, barY, barWidth, barHeight);
        }

        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }
}

class EnemyManager {
    constructor(bulletManager) {
        this.bulletManager = bulletManager;
        this.pool = new ObjectPool(
            () => new Enemy(),
            (enemy, x, y, type) => enemy.reset(x, y, type),
            20
        );
        this.spawnTimer = 0;
        this.spawnInterval = 2;
        this.difficulty = 1;
    }

    update(deltaTime, canvasWidth, canvasHeight) {
        // Actualizar enemigos existentes
        const enemies = this.pool.getInUse();
        
        // Log solo cada 60 frames para no saturar
        if (Math.random() < 0.01) {
            console.log(`EnemyManager.update: ${enemies.length} enemies active, spawnTimer: ${this.spawnTimer.toFixed(2)}`);
        }
        
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            enemy.update(deltaTime, canvasHeight, canvasWidth);

            // Disparar
            if (enemy.canShoot(deltaTime) && enemy.y > 0 && enemy.y < canvasHeight - 100) {
                this.bulletManager.createBullet(enemy.x, enemy.y + enemy.height / 2, 0, 300, false);
            }
            
            if (!enemy.active) {
                this.pool.release(enemy);
            }
        }

        // Spawn de nuevos enemigos
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnInterval / this.difficulty) {
            console.log('Spawning new enemy from update...');
            this.spawnTimer = 0;
            this.spawnRandom(canvasWidth);
        }
    }

    spawnRandom(canvasWidth) {
        const x = Utils.random(50, canvasWidth - 50);
        const roll = Math.random();
        
        let type;
        // Distribución de tipos de enemigos
        if (roll < 0.40) {
            type = 'light'; // 40% - Cazas ligeros
        } else if (roll < 0.65) {
            type = 'heavy'; // 25% - Cazas pesados
        } else if (roll < 0.85) {
            type = 'helicopter'; // 20% - Helicópteros
        } else if (roll < 0.97) {
            type = 'bomber'; // 12% - Bombarderos
        } else {
            type = 'miniboss'; // 3% - Mini-Boss
        }
        
        this.pool.get(x, -50, type);
    }

    draw(ctx) {
        this.pool.getInUse().forEach(enemy => enemy.draw(ctx));
    }

    getActiveEnemies() {
        return this.pool.getInUse().filter(e => e.active);
    }

    increaseDifficulty() {
        this.difficulty = Math.min(this.difficulty + 0.1, 3);
    }

    clear() {
        console.log('EnemyManager.clear() called');
        this.pool.releaseAll();
        this.spawnTimer = 999; // Forzar spawn inmediato en el primer update
        this.difficulty = 1;
        console.log('Pool cleared, enemies in use:', this.pool.getInUse().length);
    }
    
    spawnInitialEnemies(canvasWidth) {
        console.log('=== spawnInitialEnemies llamado ===');
        console.log('canvasWidth:', canvasWidth);
        // Spawn de 3 enemigos inmediatamente al inicio
        for (let i = 0; i < 3; i++) {
            const x = Utils.random(50, canvasWidth - 50);
            const y = -100 - (i * 80); // Separados verticalmente
            console.log(`Spawning enemy ${i+1}: x=${x}, y=${y}`);
            const enemy = this.pool.get(x, y, 'light');
            console.log('Enemy spawned:', enemy);
        }
        this.spawnTimer = 0; // Resetear timer después del spawn inicial
        console.log('Enemies in pool:', this.pool.getInUse().length);
        console.log('=== spawnInitialEnemies completado ===');
    }
}
