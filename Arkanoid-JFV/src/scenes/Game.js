import { Scene } from 'phaser';
import { Paddle } from '../objects/Paddle';
import { Ball } from '../objects/Ball';
import { Brick } from '../objects/Brick';
import { PowerUp } from '../objects/PowerUp';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.paddle;
        this.balls;
        this.bricks;
        this.powerups;
        this.bossGroup;
    }

    create() {
        this.cameras.main.setBackgroundColor(0x000000);

        this.currentLevel = 1;
        this.maxLevels = 3; // Level 2 is Stage 2, Level 3 is Boss
        this.levelReady = false; // Prevent ball release during stage setup

        this.paddle = new Paddle(this, 400, 550);

        this.balls = this.physics.add.group({
            classType: Ball,
            runChildUpdate: true,
            bounceX: 1,
            bounceY: 1,
            collideWorldBounds: true
        });

        this.spawnBall();

        this.bricks = this.physics.add.staticGroup({
            classType: Brick,
            runChildUpdate: true
        });

        this.powerups = this.physics.add.group({
            classType: PowerUp,
            runChildUpdate: true
        });

        this.bossGroup = this.physics.add.group();

        this.score = 0;
        this.lives = 3;

        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
        this.livesText = this.add.text(600, 16, 'Lives: 3', { fontSize: '32px', fill: '#FFF' });
        this.levelText = this.add.text(400, 300, '', { fontSize: '64px', fill: '#FFFF00' }).setOrigin(0.5).setAlpha(0);

        // Colliders
        // Switch back to COLLIDER to prevent tunneling
        this.physics.add.collider(this.balls, this.paddle, this.hitPaddle, null, this);
        this.physics.add.collider(this.balls, this.bricks, this.hitBrick, null, this);
        this.physics.add.collider(this.balls, this.bossGroup, this.hitBoss, null, this);
        this.physics.add.overlap(this.paddle, this.powerups, this.hitPowerUp, null, this);

        // Input
        this.input.on('pointerdown', this.releaseBall, this);
        this.input.keyboard.on('keydown-SPACE', this.releaseBall, this);

        // Debug Input: 'N' for Next Level
        this.input.keyboard.on('keydown-N', () => {
            this.nextLevel();
        });

        this.startLevel(this.currentLevel);
    }

    startLevel(level) {
        this.currentLevel = level;

        // Reset turn
        this.resetTurn();

        // Clear existing entities
        this.bricks.clear(true, true);
        this.powerups.clear(true, true);
        this.bossGroup.clear(true, true);

        // Show Level Text
        let text = 'Stage ' + level;
        if (level === 3) text = 'DOH!';

        this.levelText.setText(text);
        this.levelText.setAlpha(1);

        // Block ball release during setup
        this.levelReady = false;

        // Fade out text then start logic (create objects)
        this.tweens.add({
            targets: this.levelText,
            alpha: 0,
            duration: 2000,
            delay: 1000,
            onComplete: () => {
                this.createLevelObjects(level);
                // Allow ball release after objects are created
                this.levelReady = true;
            }
        });
    }

    createLevelObjects(level) {
        if (level === 1) {
            // Standard Grid
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 10; j++) {
                    const brick = new Brick(this, 110 + j * 64, 100 + i * 32);
                    this.bricks.add(brick);
                }
            }
        } else if (level === 2) {
            // Arkanoid Stage 2 Style
            // Barrier at y=300. 10 bricks wide. last one is RED. others are GRAY (Gold in my code).
            // Normal bricks above.

            // Upper Bricks (pyramid-ish or just rows)
            // Let's do 3 rows of normal bricks
            for (let i = 0; i < 3; i++) {
                for (let j = 2; j < 8; j++) { // Centered checks
                    const brick = new Brick(this, 110 + j * 64, 100 + i * 32);
                    this.bricks.add(brick);
                }
            }

            // The Barrier
            for (let j = 0; j < 10; j++) {
                let type = 'gold'; // Indestructible
                if (j === 9) type = 'red'; // The weak spot on the right

                const brick = new Brick(this, 110 + j * 64, 300, type);
                this.bricks.add(brick);
            }

        } else if (level === 3) {
            // Boss Level - Spawn DOH
            const boss = this.physics.add.sprite(400, 200, 'boss');
            boss.setImmovable(true);
            boss.body.moves = false; // Prevent physics from moving it
            boss.hp = 20; // 20 Hits to kill
            this.bossGroup.add(boss);
        }
    }

    spawnBall() {
        const ball = new Ball(this, 400, 500);
        this.balls.add(ball);
        // Initialize lastVel to safe default
        ball.lastVel = new Phaser.Math.Vector2(0, 0);
        return ball;
    }

    releaseBall() {
        // Don't allow ball release until level is ready
        if (!this.levelReady) return;

        this.balls.children.iterate((ball) => {
            if (ball.onPaddle) {
                ball.launch();
                const v = ball.body.velocity.length();

                // CRITICAL: Set lastVel immediately on launch
                ball.lastVel = ball.body.velocity.clone();
            }
        });
    }

    update() {
        this.paddle.update();

        this.balls.children.iterate((ball) => {
            if (ball.onPaddle) {
                ball.x = this.paddle.x;
            } else {
                // TRACK LAST VELOCITY
                // We only save if vector is non-zero to avoid saving a 'stopped' state
                if (ball.body.velocity.length() > 5) {
                    ball.lastVel = ball.body.velocity.clone();
                }
            }
        });

        // Check Ball Loss
        if (this.balls.countActive() > 0) {
            this.balls.children.each((ball) => {
                if (ball.y > 600) {
                    ball.destroy();
                }
            });
        }

        if (this.balls.countActive() === 0) {
            this.lives--;
            this.livesText.setText('Lives: ' + this.lives);

            if (this.lives === 0) {
                this.scene.start('GameOver');
            } else {
                this.resetTurn();
            }
        }
    }

    resetTurn() {
        this.balls.clear(true, true);
        const ball = this.spawnBall();
        ball.resetPosition(this.paddle);
    }

    nextLevel() {
        if (this.currentLevel >= this.maxLevels) {
            this.scene.start('Victory');
        } else {
            this.startLevel(this.currentLevel + 1);
        }
    }

    hitPaddle(arg1, arg2) {
        let ball, paddle;
        // Detect swapped arguments
        if (arg1 instanceof Paddle) {
            paddle = arg1;
            ball = arg2;
        } else {
            ball = arg1;
            paddle = arg2;
        }

        // Cooldown for debounce
        const now = this.time.now;
        if (paddle.lastHit && now < paddle.lastHit + 250) {
            return;
        }
        paddle.lastHit = now;

        // Visual Feedback
        paddle.setTint(0x00ff00);
        this.time.delayedCall(100, () => paddle.clearTint());

        // 1. Recover Velocity
        // Check direct property OR body property
        let lastVel = ball.lastVel;
        if (!lastVel && ball.body) lastVel = ball.body.lastVel;

        let vx = 0;
        let vy = 0;

        // Robustness Chain:
        // A. Use LastVel if valid
        if (lastVel && lastVel.length() > 10) {
            vx = lastVel.x;
            vy = lastVel.y;
        }
        // B. Else use Current Velocity if valid
        else if (ball.body.velocity.length() > 10) {
            vx = ball.body.velocity.x;
            vy = ball.body.velocity.y;
        }
        // C. Else Default Fail-safe (e.g. initial launch speed)
        else {
            vx = 75;
            vy = -300;
        }

        // 2. Standard Reflection (Opposite Angle)
        vy = -Math.abs(vy);

        // Correct angle based on hit point
        let diff = ball.x - paddle.x;
        let halfWidth = paddle.width / 2;
        let clickPos = diff / halfWidth; // -1 to 1

        let side = clickPos < 0 ? 'Left' : 'Right';
        let pct = Math.round(Math.abs(clickPos) * 100);
        if (pct > 100) pct = 100;

        // Increment or decrement x velocity up to a 30 changing the angle.
        if (side == 'Left')
            vx = vx - (pct * 0.5);
        else
            vx = vx + (pct * 0.5);

        // 3. Accelerate (1.05x)
        let vec = new Phaser.Math.Vector2(vx, vy);
        let speed = vec.length();

        // Ensure Min Speed
        if (speed < 300) speed = 300;

        speed = speed * 1.05;

        // Cap Speed
        if (speed > 700) speed = 700;

        // 4. Set NEW velocity
        vec.normalize().scale(speed);
        ball.setVelocity(vec.x, vec.y);

        // Update stored lastVel immediately to correct value
        ball.lastVel = vec.clone();
    }

    hitBrick(ball, brick) {
        // Try to hit the brick
        const destroyed = brick.hit();

        if (destroyed) {
            this.score += 10;
            this.scoreText.setText('Score: ' + this.score);
            this.dropPowerUp(brick.x, brick.y);

            // Check Win Condition:
            // Count active bricks that are NOT indestructible
            const remaining = this.bricks.getChildren().filter(b => b.active && !b.isIndestructible).length;

            if (remaining === 0) {
                if (this.currentLevel < this.maxLevels) {
                    this.nextLevel();
                }
            }
        }
    }

    hitBoss(ball, boss) {
        // Don't process if boss is already defeated/retreating
        if (boss.getData('defeated')) return;

        // Add 500ms cooldown between hits
        const now = this.time.now;
        if (boss.lastHit && now < boss.lastHit + 500) {
            return;
        }
        boss.lastHit = now;

        boss.hp--;

        // Robust Rebound Logic
        // Calculate vector from Boss center to Ball center
        const dx = ball.x - boss.x;
        const dy = ball.y - boss.y;

        // Normalize and apply speed
        const angle = Math.atan2(dy, dx);
        const speed = ball.body.speed || 300; // Maintain speed or default to 300

        ball.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        // Enforce minimum vertical velocity to prevent horizontal locking
        if (Math.abs(ball.body.velocity.y) < 100) {
            // If too horizontal, force it down (since boss is usually above)
            ball.body.setVelocityY(Math.abs(ball.body.velocity.y) + 150);
        }

        // Blink effect
        boss.setTint(0xff0000);
        this.time.delayedCall(100, () => {
            if (boss.active) boss.clearTint();
        });

        // Check if boss is defeated
        if (boss.hp <= 0) {
            boss.setData('defeated', true);
            this.score += 1000;
            this.scoreText.setText('Score: ' + this.score);

            // Boss retreats upward
            this.tweens.add({
                targets: boss,
                y: -200,
                duration: 2000,
                ease: 'Power2',
                onComplete: () => {
                    boss.destroy();
                    this.nextLevel();
                }
            });
        }
    }

    dropPowerUp(x, y) {
        const rand = Math.random();
        if (rand > 0.7) {
            let type = 'Enlarge';
            let texture = 'powerup';

            if (rand > 0.85) {
                type = 'Disruption';
                texture = 'powerup_disruption';
            }

            const powerup = new PowerUp(this, x, y, type);
            powerup.setTexture(texture);
            this.powerups.add(powerup);
            powerup.body.setVelocityY(150);
        }
    }

    hitPowerUp(paddle, powerup) {
        const type = powerup.type;
        powerup.destroy();

        if (type === 'Enlarge') {
            paddle.scaleX = 2;
            this.time.delayedCall(10000, () => {
                paddle.scaleX = 1;
            });
        } else if (type === 'Disruption') {
            if (this.balls.countActive() > 0) {
                const mainBall = this.balls.getFirstAlive();
                for (let i = 0; i < 2; i++) {
                    const newBall = new Ball(this, mainBall.x, mainBall.y);
                    this.balls.add(newBall);
                    newBall.launch();
                    newBall.setVelocityX(mainBall.body.velocity.x + (i === 0 ? -50 : 50));
                    newBall.setVelocityY(mainBall.body.velocity.y);
                }
            }
        }
    }
}
