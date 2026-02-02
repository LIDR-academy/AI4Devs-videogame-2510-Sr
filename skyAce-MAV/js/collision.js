// ==========================================
// SkyAce - Sistema de Colisiones
// ==========================================

class CollisionDetector {
    constructor(game) {
        this.game = game;
    }

    checkAll() {
        this.checkPlayerBulletsVsEnemies();
        this.checkEnemyBulletsVsPlayer();
        this.checkEnemiesVsPlayer();
        this.checkPowerUpsVsPlayer();
    }

    checkPlayerBulletsVsEnemies() {
        const bullets = this.game.bulletManager.getPlayerBullets();
        const enemies = this.game.enemyManager.getActiveEnemies();

        bullets.forEach(bullet => {
            enemies.forEach(enemy => {
                if (Utils.rectCollision(bullet.getBounds(), enemy.getBounds())) {
                    bullet.active = false;
                    const destroyed = enemy.takeDamage(bullet.damage);
                    
                    if (destroyed) {
                        // Crear explosión
                        this.game.particles.createExplosion(enemy.x, enemy.y, '#ff6600', 20);
                        // Aumentar score
                        this.game.addScore(enemy.score);
                        // Sonido de explosión (opcional)
                    }
                }
            });
        });
    }

    checkEnemyBulletsVsPlayer() {
        const bullets = this.game.bulletManager.getEnemyBullets();
        const playerBounds = this.game.player.getBounds();

        bullets.forEach(bullet => {
            if (Utils.rectCollision(bullet.getBounds(), playerBounds)) {
                bullet.active = false;
                const dead = this.game.player.takeDamage(bullet.damage);
                
                if (dead) {
                    this.game.playerDeath();
                } else {
                    // Efecto de daño
                    this.game.particles.createExplosion(
                        this.game.player.x, 
                        this.game.player.y, 
                        '#ff0000', 
                        10
                    );
                }
            }
        });
    }

    checkEnemiesVsPlayer() {
        const enemies = this.game.enemyManager.getActiveEnemies();
        const playerBounds = this.game.player.getBounds();

        enemies.forEach(enemy => {
            if (Utils.rectCollision(enemy.getBounds(), playerBounds)) {
                enemy.active = false;
                const dead = this.game.player.takeDamage(30);
                
                // Explosión por colisión
                this.game.particles.createExplosion(enemy.x, enemy.y, '#ff6600', 25);
                
                if (dead) {
                    this.game.playerDeath();
                }
            }
        });
    }

    checkPowerUpsVsPlayer() {
        const powerups = this.game.powerUpManager.getActivePowerUps();
        const playerBounds = this.game.player.getBounds();

        powerups.forEach(powerup => {
            if (Utils.rectCollision(powerup.getBounds(), playerBounds)) {
                powerup.applyEffect(this.game.player);
                // Efecto visual
                this.game.particles.createExplosion(powerup.x, powerup.y, '#00ff00', 15);
            }
        });
    }
}
