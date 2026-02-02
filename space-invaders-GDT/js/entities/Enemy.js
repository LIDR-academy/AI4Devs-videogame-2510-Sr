// ============================================================================
// ENEMY
// ============================================================================

import { CONFIG } from '../config.js';

export class Enemy {
    constructor(x, y, row, image) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.enemy.width;
        this.height = CONFIG.enemy.height;
        this.row = row;
        this.alive = true;
        this.image = image;
        this.isDiving = false;
    }

    draw(ctx) {
        if (!this.alive) return;

        if (this.image && this.image.complete) {
            ctx.drawImage(this.image, this.x - this.width / 2, this.y, this.width, this.height);
        } else {
            this._drawFallbackSprite(ctx);
        }
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

    update(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
}
