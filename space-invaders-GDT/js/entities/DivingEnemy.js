// ============================================================================
// DIVING ENEMY
// ============================================================================

import { CONFIG } from '../config.js';

export class DivingEnemy {
    constructor(enemy, playerX, playerY) {
        this._initPosition(enemy);
        this._initPathParameters(playerX);
    }

    _initPosition(enemy) {
        this.x = enemy.x;
        this.y = enemy.y;
        this.width = enemy.width;
        this.height = enemy.height;
        this.row = enemy.row;
        this.image = enemy.image;
        this.alive = true;
        this.isDiving = true;
    }

    _initPathParameters(playerX) {
        this.speed = CONFIG.divingEnemy.speed;
        this.arcDirection = Math.random() > 0.5 ? 1 : -1;
        this.angle = 0;
        this.angleSpeed = CONFIG.divingEnemy.angleSpeed;
        this.pathCenterX = this.x + (this.arcDirection * 150);
        this.pathCenterY = this.y + 80;
        this.radius = CONFIG.divingEnemy.arcRadius;
        this.pathProgress = 0;
    }

    draw(ctx) {
        if (!this.alive) return;

        if (this.image && this.image.complete) {
            ctx.drawImage(this.image, this.x - this.width / 2, this.y, this.width, this.height);
        } else {
            this._drawFallbackSprite(ctx);
        }
        this._drawTrail(ctx);
    }

    _drawFallbackSprite(ctx) {
        const color = CONFIG.enemy.colors[this.row % CONFIG.enemy.colors.length];

        ctx.fillStyle = color;
        ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height * 0.6);

        ctx.fillStyle = '#000';
        ctx.fillRect(this.x - this.width / 3, this.y + 5, 8, 8);
        ctx.fillRect(this.x + this.width / 6, this.y + 5, 8, 8);

        ctx.fillStyle = color;
        for (let i = 0; i < 3; i++) {
            const tentacleX = this.x - this.width / 3 + (i * this.width / 3);
            ctx.fillRect(tentacleX, this.y + this.height * 0.6, 6, this.height * 0.4);
        }
    }

    _drawTrail(ctx) {
        ctx.strokeStyle = CONFIG.enemy.colors[this.row % CONFIG.enemy.colors.length];
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height + 10);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    update() {
        this.angle += this.angleSpeed;
        this.pathProgress += this.angleSpeed;

        if (this.pathProgress <= Math.PI * 2) {
            this._updateCircularPath();
        } else {
            this._updateStraightPath();
        }

        this._checkOffScreen();
    }

    _updateCircularPath() {
        const offsetX = Math.cos(this.angle) * this.radius;
        const offsetY = Math.sin(this.angle) * this.radius;

        this.x = this.pathCenterX + offsetX;
        this.y = this.pathCenterY + offsetY;

        this.pathCenterY += this.speed;
        this.pathCenterX += this.arcDirection * 0.5;
    }

    _updateStraightPath() {
        this.y += this.speed * 1.5;
        this.x += Math.sin(this.y * 0.02) * 2;
    }

    _checkOffScreen() {
        if (this.y > CONFIG.canvas.height + this.height ||
            this.x < -this.width ||
            this.x > CONFIG.canvas.width + this.width) {
            this.alive = false;
        }
    }
}
