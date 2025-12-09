// ==========================================
// SkyAce - Jugador
// ==========================================

class Player {
    constructor(x, y, canvasWidth, canvasHeight) {
        this.x = x;
        this.y = y;
        this.width = 48;
        this.height = 48;
        this.speed = 300;
        this.health = 100;
        this.maxHealth = 100;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.sprite = spriteManager.getSprite('player');
        
        // Sistema de disparo
        this.shootTimer = 0;
        this.shootInterval = 0.2;
        this.weaponLevel = 1;
        
        // Shield
        this.hasShield = false;
        this.shieldTimer = 0;
        this.shieldDuration = 5;
        
        // Controles
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.shooting = false;
    }

    update(deltaTime) {
        // Movimiento horizontal
        if (this.moveLeft) {
            this.x -= this.speed * deltaTime;
        }
        if (this.moveRight) {
            this.x += this.speed * deltaTime;
        }
        
        // Movimiento vertical
        if (this.moveUp) {
            this.y -= this.speed * deltaTime;
        }
        if (this.moveDown) {
            this.y += this.speed * deltaTime;
        }

        // Limitar movimiento dentro del canvas
        this.x = Utils.clamp(this.x, this.width / 2, this.canvasWidth - this.width / 2);
        // Limitar movimiento vertical dejando margen en la parte inferior
        const topLimit = this.height / 2 + 20; // Margen superior
        const bottomLimit = this.canvasHeight - this.height - 20; // Margen inferior para que no desaparezca
        this.y = Utils.clamp(this.y, topLimit, bottomLimit);

        // Shield timer
        if (this.hasShield) {
            this.shieldTimer += deltaTime;
            if (this.shieldTimer >= this.shieldDuration) {
                this.hasShield = false;
                this.shieldTimer = 0;
            }
        }

        // Shoot timer
        this.shootTimer += deltaTime;
    }

    canShoot() {
        if (this.shootTimer >= this.shootInterval) {
            this.shootTimer = 0;
            return true;
        }
        return false;
    }

    shoot(bulletManager) {
        if (!this.canShoot()) return;

        switch (this.weaponLevel) {
            case 1:
                // Disparo simple
                bulletManager.createBullet(this.x, this.y - this.height / 2, 0, -500, true);
                break;
            case 2:
                // Disparo doble
                bulletManager.createBullet(this.x - 10, this.y - this.height / 2, 0, -500, true);
                bulletManager.createBullet(this.x + 10, this.y - this.height / 2, 0, -500, true);
                break;
            case 3:
                // Disparo triple
                bulletManager.createBullet(this.x, this.y - this.height / 2, 0, -500, true);
                bulletManager.createBullet(this.x - 15, this.y - this.height / 2, -50, -500, true);
                bulletManager.createBullet(this.x + 15, this.y - this.height / 2, 50, -500, true);
                break;
        }
    }

    takeDamage(damage) {
        if (this.hasShield) {
            return false; // Shield absorbe el daño
        }
        
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            return true; // Player muerto
        }
        return false;
    }

    heal(amount) {
        this.health = Math.min(this.health + amount, this.maxHealth);
    }

    upgradeWeapon() {
        this.weaponLevel = Math.min(this.weaponLevel + 1, 3);
    }

    activateShield() {
        this.hasShield = true;
        this.shieldTimer = 0;
    }

    draw(ctx) {
        ctx.save();

        // Shield effect
        if (this.hasShield) {
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#00ffff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width * 0.8, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Dibujar sprite del jugador
        if (this.sprite) {
            ctx.drawImage(
                this.sprite,
                this.x - this.width / 2,
                this.y - this.height / 2,
                this.width,
                this.height
            );
        } else {
            // Fallback: nave por defecto
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00ff00';
            ctx.fillStyle = '#00ff00';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.height / 2);
            ctx.lineTo(this.x - this.width / 4, this.y + this.height / 2);
            ctx.lineTo(this.x + this.width / 4, this.y + this.height / 2);
            ctx.closePath();
            ctx.fill();
            
            // Alas
            ctx.beginPath();
            ctx.moveTo(this.x - this.width / 2, this.y + 5);
            ctx.lineTo(this.x - this.width / 4, this.y);
            ctx.lineTo(this.x - this.width / 4, this.y + 10);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y + 5);
            ctx.lineTo(this.x + this.width / 4, this.y);
            ctx.lineTo(this.x + this.width / 4, this.y + 10);
            ctx.closePath();
            ctx.fill();

            // Cabina
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
            ctx.fill();

            // Motores (efecto de propulsión)
            ctx.fillStyle = '#ffaa00';
            ctx.fillRect(this.x - 8, this.y + this.height / 2, 4, 8);
            ctx.fillRect(this.x + 4, this.y + this.height / 2, 4, 8);
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(this.x - 8, this.y + this.height / 2 + 8, 4, 4);
            ctx.fillRect(this.x + 4, this.y + this.height / 2 + 8, 4, 4);
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

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.health = this.maxHealth;
        this.weaponLevel = 1;
        this.hasShield = false;
        this.shieldTimer = 0;
        this.shootTimer = 0;
        
        // Resetear estados de movimiento
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.shooting = false;
    }
}
