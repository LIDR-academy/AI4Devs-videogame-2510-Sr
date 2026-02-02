// ============================================================================
// BULLET
// ============================================================================

import { CONFIG } from '../config.js';

export class Bullet {
    constructor(x, y, isPlayerBullet = true) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.bullet.width;
        this.height = CONFIG.bullet.height;
        this.isPlayerBullet = isPlayerBullet;
        this.speed = isPlayerBullet ? -CONFIG.bullet.speed : CONFIG.enemyBullet.speed;
        this.color = isPlayerBullet ? CONFIG.bullet.color : CONFIG.enemyBullet.color;
        this.active = true;
    }

    draw(ctx) {
        if (!this.active) return;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
    }

    update() {
        this.y += this.speed;

        if (this.y < 0 || this.y > CONFIG.canvas.height) {
            this.active = false;
        }
    }
}
