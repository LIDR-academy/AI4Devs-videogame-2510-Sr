// ==========================================
// SkyAce - Sistema de Power-Ups
// ==========================================

class PowerUp {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 20;
        this.height = 20;
        this.speed = 100;
        this.active = true;
        this.type = 'health'; // health, weapon, shield
        this.rotation = 0;
        this.rotationSpeed = 3;
    }

    reset(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.active = true;
        this.rotation = 0;
    }

    update(deltaTime, canvasHeight) {
        this.y += this.speed * deltaTime;
        this.rotation += this.rotationSpeed * deltaTime;

        // Desactivar si sale de la pantalla
        if (this.y > canvasHeight + this.height) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Color según tipo
        let color, symbol;
        switch (this.type) {
            case 'health':
                color = '#ff0000';
                symbol = '+';
                break;
            case 'weapon':
                color = '#ffff00';
                symbol = 'W';
                break;
            case 'shield':
                color = '#00ffff';
                symbol = 'S';
                break;
        }

        // Brillo
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;

        // Fondo
        ctx.fillStyle = color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Borde
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Símbolo
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(symbol, 0, 0);

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

    applyEffect(player) {
        switch (this.type) {
            case 'health':
                player.heal(25);
                break;
            case 'weapon':
                player.upgradeWeapon();
                break;
            case 'shield':
                player.activateShield();
                break;
        }
        this.active = false;
    }
}

class PowerUpManager {
    constructor() {
        this.pool = new ObjectPool(
            () => new PowerUp(),
            (powerup, x, y, type) => powerup.reset(x, y, type),
            10
        );
        this.spawnTimer = 0;
        this.spawnInterval = 15; // Segundos entre spawns
    }

    update(deltaTime, canvasWidth, canvasHeight) {
        // Actualizar power-ups existentes
        const powerups = this.pool.getInUse();
        for (let i = powerups.length - 1; i >= 0; i--) {
            const powerup = powerups[i];
            powerup.update(deltaTime, canvasHeight);
            
            if (!powerup.active) {
                this.pool.release(powerup);
            }
        }

        // Spawn de nuevos power-ups
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            this.spawnRandom(canvasWidth);
        }
    }

    spawnRandom(canvasWidth) {
        const types = ['health', 'weapon', 'shield'];
        const type = types[Utils.randomInt(0, types.length)];
        const x = Utils.random(30, canvasWidth - 30);
        this.pool.get(x, -30, type);
    }

    draw(ctx) {
        this.pool.getInUse().forEach(powerup => powerup.draw(ctx));
    }

    getActivePowerUps() {
        return this.pool.getInUse().filter(p => p.active);
    }

    clear() {
        this.pool.releaseAll();
        this.spawnTimer = 0;
    }
}
