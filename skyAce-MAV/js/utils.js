// ==========================================
// SkyAce - Utilidades y Helpers
// ==========================================

const Utils = {
    // Generar número aleatorio entre min y max
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    // Generar entero aleatorio
    randomInt(min, max) {
        return Math.floor(this.random(min, max));
    },

    // Distancia entre dos puntos
    distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },

    // Limitar valor entre min y max
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    // Verificar si dos rectángulos colisionan (AABB)
    rectCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    },

    // Verificar si dos círculos colisionan
    circleCollision(circle1, circle2) {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < circle1.radius + circle2.radius;
    },

    // Dibujar texto con sombra
    drawText(ctx, text, x, y, color = '#fff', size = 20) {
        ctx.save();
        ctx.font = `${size}px 'Courier New', monospace`;
        ctx.fillStyle = '#000';
        ctx.fillText(text, x + 2, y + 2);
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        ctx.restore();
    }
};

// Pool de objetos para optimización de memoria
class ObjectPool {
    constructor(createFunc, resetFunc, initialSize = 10) {
        this.createFunc = createFunc;
        this.resetFunc = resetFunc;
        this.available = [];
        this.inUse = [];
        
        // Crear objetos iniciales
        for (let i = 0; i < initialSize; i++) {
            this.available.push(this.createFunc());
        }
    }

    get(...args) {
        let obj;
        if (this.available.length > 0) {
            obj = this.available.pop();
        } else {
            obj = this.createFunc();
        }
        this.resetFunc(obj, ...args);
        this.inUse.push(obj);
        return obj;
    }

    release(obj) {
        const index = this.inUse.indexOf(obj);
        if (index > -1) {
            this.inUse.splice(index, 1);
            this.available.push(obj);
        }
    }

    releaseAll() {
        this.available.push(...this.inUse);
        this.inUse = [];
    }

    getInUse() {
        return this.inUse;
    }
}

// Sistema de partículas para efectos visuales
class Particle {
    constructor(x, y, vx, vy, color, life) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = 3;
    }

    update(deltaTime) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.life -= deltaTime;
        return this.life > 0;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    createExplosion(x, y, color = '#ffaa00', count = 15) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Utils.random(50, 150);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const life = Utils.random(0.3, 0.7);
            this.particles.push(new Particle(x, y, vx, vy, color, life));
        }
    }

    update(deltaTime) {
        this.particles = this.particles.filter(p => p.update(deltaTime));
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }

    clear() {
        this.particles = [];
    }
}
