// ============================================================================
// PLAYER
// ============================================================================

import { CONFIG } from '../config.js';
import { Bullet } from './Bullet.js';

export class Player {
    constructor(x, y, image) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.player.width;
        this.height = CONFIG.player.height;
        this.speed = CONFIG.player.speed;
        this.dx = 0;
        this.image = image;
        this._initPowerUps();
    }

    _initPowerUps() {
        this.hasShield = false;
        this.hasRapidFire = false;
        this.hasMultiShot = false;
        this.shieldEndTime = 0;
        this.rapidFireEndTime = 0;
        this.multiShotEndTime = 0;
    }

    draw(ctx) {
        this._drawShield(ctx);
        this._drawSprite(ctx);
        this._drawPowerUpIndicators(ctx);
    }

    _drawShield(ctx) {
        if (!this.hasShield) return;

        ctx.strokeStyle = '#00ccff';
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(this.x, this.y + this.height / 2, this.width * 0.8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    _drawSprite(ctx) {
        if (this.image && this.image.complete) {
            ctx.drawImage(this.image, this.x - this.width / 2, this.y, this.width, this.height);
        } else {
            this._drawFallbackSprite(ctx);
        }
    }

    _drawFallbackSprite(ctx) {
        ctx.fillStyle = CONFIG.player.color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.width / 2, this.y + this.height);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffff00';
        ctx.fillRect(this.x - 5, this.y + 10, 10, 10);
    }

    _drawPowerUpIndicators(ctx) {
        if (this.hasRapidFire) {
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(this.x - 3, this.y - 5, 6, 3);
        }
        if (this.hasMultiShot) {
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(this.x - 8, this.y + this.height + 2, 4, 3);
            ctx.fillRect(this.x - 2, this.y + this.height + 2, 4, 3);
            ctx.fillRect(this.x + 4, this.y + this.height + 2, 4, 3);
        }
    }

    update() {
        this.x += this.dx;
        this._constrainToBounds();
    }

    _constrainToBounds() {
        const halfWidth = this.width / 2;
        if (this.x - halfWidth < 0) {
            this.x = halfWidth;
        }
        if (this.x + halfWidth > CONFIG.canvas.width) {
            this.x = CONFIG.canvas.width - halfWidth;
        }
    }

    moveLeft() {
        this.dx = -this.speed;
    }

    moveRight() {
        this.dx = this.speed;
    }

    stop() {
        this.dx = 0;
    }

    shoot() {
        if (this.hasMultiShot) {
            return this._createMultiShot();
        }
        return [new Bullet(this.x, this.y - 10, true)];
    }

    _createMultiShot() {
        return [
            new Bullet(this.x - 15, this.y - 10, true),
            new Bullet(this.x, this.y - 10, true),
            new Bullet(this.x + 15, this.y - 10, true)
        ];
    }

    updatePowerUps(currentTime) {
        if (this.hasShield && currentTime > this.shieldEndTime) {
            this.hasShield = false;
        }
        if (this.hasRapidFire && currentTime > this.rapidFireEndTime) {
            this.hasRapidFire = false;
        }
        if (this.hasMultiShot && currentTime > this.multiShotEndTime) {
            this.hasMultiShot = false;
        }
    }

    activatePowerUp(type) {
        const endTime = Date.now() + CONFIG.powerUp.duration;

        switch (type) {
            case 'shield':
                this.hasShield = true;
                this.shieldEndTime = endTime;
                break;
            case 'rapidFire':
                this.hasRapidFire = true;
                this.rapidFireEndTime = endTime;
                break;
            case 'multiShot':
                this.hasMultiShot = true;
                this.multiShotEndTime = endTime;
                break;
        }
    }
}
