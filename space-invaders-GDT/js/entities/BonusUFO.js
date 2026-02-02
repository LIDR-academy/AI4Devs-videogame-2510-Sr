// ============================================================================
// BONUS UFO
// ============================================================================

import { CONFIG } from '../config.js';

export class BonusUFO {
    constructor(direction = 1) {
        this.width = 50;
        this.height = 25;
        this.direction = direction;
        this.x = direction === 1 ? -this.width : CONFIG.canvas.width + this.width;
        this.y = 30;
        this.speed = 2;
        this.active = true;
        this.points = [50, 100, 150, 200][Math.floor(Math.random() * 4)];
    }

    draw(ctx) {
        if (!this.active) return;

        this._drawBody(ctx);
        this._drawWindows(ctx);
        this._drawBlinkingLights(ctx);
        this._drawPointValue(ctx);
    }

    _drawBody(ctx) {
        ctx.fillStyle = '#ff0080';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + 5, 12, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(this.x, this.y + 12, 25, 10, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    _drawWindows(ctx) {
        ctx.fillStyle = '#00ffff';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(this.x - 15 + i * 12, this.y + 10, 6, 4);
        }
    }

    _drawBlinkingLights(ctx) {
        const blinkColor = Math.floor(Date.now() / 200) % 2 === 0 ? '#ffff00' : '#ff0000';
        ctx.fillStyle = blinkColor;
        ctx.beginPath();
        ctx.arc(this.x - 20, this.y + 15, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 20, this.y + 15, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    _drawPointValue(ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(this.points, this.x, this.y - 5);
    }

    update() {
        this.x += this.speed * this.direction;

        if ((this.direction === 1 && this.x > CONFIG.canvas.width + this.width) ||
            (this.direction === -1 && this.x < -this.width)) {
            this.active = false;
        }
    }
}
