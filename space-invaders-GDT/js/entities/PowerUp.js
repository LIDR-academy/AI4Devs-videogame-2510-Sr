// ============================================================================
// POWER-UP
// ============================================================================

import { CONFIG } from '../config.js';

export class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.powerUp.width;
        this.height = CONFIG.powerUp.height;
        this.speed = CONFIG.powerUp.speed;
        this.active = true;
        this.type = type;
        this.rotation = 0;
        this.pulsePhase = 0;
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        ctx.globalAlpha = pulse;

        this._drawIcon(ctx);

        ctx.restore();
    }

    _drawIcon(ctx) {
        switch (this.type) {
            case 'rapidFire':
                this._drawRapidFireIcon(ctx);
                break;
            case 'shield':
                this._drawShieldIcon(ctx);
                break;
            case 'multiShot':
                this._drawMultiShotIcon(ctx);
                break;
        }
    }

    _drawRapidFireIcon(ctx) {
        ctx.fillStyle = '#ffff00';
        ctx.strokeStyle = '#ff8800';
        ctx.lineWidth = 2;

        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const radius = i % 2 === 0 ? 12 : 6;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        this._drawLabel(ctx, 'R');
    }

    _drawShieldIcon(ctx) {
        ctx.fillStyle = '#00ccff';
        ctx.strokeStyle = '#0088ff';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(10, -8);
        ctx.lineTo(10, 6);
        ctx.quadraticCurveTo(10, 12, 0, 14);
        ctx.quadraticCurveTo(-10, 12, -10, 6);
        ctx.lineTo(-10, -8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fff';
        this._drawLabel(ctx, 'S');
    }

    _drawMultiShotIcon(ctx) {
        ctx.fillStyle = '#00ff00';
        ctx.strokeStyle = '#00aa00';
        ctx.lineWidth = 2;

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const px = Math.cos(angle) * 12;
            const py = Math.sin(angle) * 12;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        this._drawLabel(ctx, '3');
    }

    _drawLabel(ctx, text) {
        ctx.fillStyle = ctx.fillStyle === '#fff' ? '#fff' : '#000';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 0, 0);
    }

    update() {
        this.y += this.speed;
        this.rotation += 0.05;
        this.pulsePhase += 0.1;

        if (this.y > CONFIG.canvas.height + this.height) {
            this.active = false;
        }
    }
}
