// ==========================================
// SkyAce - Sistema de Balas
// ==========================================

class Bullet {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.width = 4;
        this.height = 12;
        this.damage = 10;
        this.active = true;
        this.isPlayerBullet = true;
        this.color = '#00ff00';
    }

    reset(x, y, vx, vy, isPlayerBullet = true) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.active = true;
        this.isPlayerBullet = isPlayerBullet;
        this.color = isPlayerBullet ? '#00ff00' : '#ff0000';
    }

    update(deltaTime, canvasHeight) {
        this.y += this.vy * deltaTime;
        this.x += this.vx * deltaTime;

        // Desactivar si sale de la pantalla
        if (this.y < -this.height || this.y > canvasHeight + this.height) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.save();
        
        // Efecto de brillo
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        
        // Dibujar bala
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // Núcleo brillante
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x - this.width / 4, this.y - this.height / 2, this.width / 2, this.height);
        
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

// Sistema de gestión de balas con Object Pool
class BulletManager {
    constructor() {
        this.pool = new ObjectPool(
            () => new Bullet(),
            (bullet, x, y, vx, vy, isPlayerBullet) => 
                bullet.reset(x, y, vx, vy, isPlayerBullet),
            50
        );
    }

    createBullet(x, y, vx, vy, isPlayerBullet = true) {
        return this.pool.get(x, y, vx, vy, isPlayerBullet);
    }

    update(deltaTime, canvasHeight) {
        const bullets = this.pool.getInUse();
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            bullet.update(deltaTime, canvasHeight);
            
            if (!bullet.active) {
                this.pool.release(bullet);
            }
        }
    }

    draw(ctx) {
        this.pool.getInUse().forEach(bullet => bullet.draw(ctx));
    }

    getActiveBullets() {
        return this.pool.getInUse().filter(b => b.active);
    }

    getPlayerBullets() {
        return this.getActiveBullets().filter(b => b.isPlayerBullet);
    }

    getEnemyBullets() {
        return this.getActiveBullets().filter(b => !b.isPlayerBullet);
    }

    clear() {
        this.pool.releaseAll();
    }
}
