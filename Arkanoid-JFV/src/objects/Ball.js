export class Ball extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'ball');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setBounce(1);

        // Disable collision with the bottom of the world
        this.body.onWorldBounds = true;
        this.body.world.checkCollision.down = false;

        this.onPaddle = true;
        this.lastVel = new Phaser.Math.Vector2(0, 0);
    }

    resetPosition(paddle) {
        this.x = paddle.x;
        this.y = paddle.y - 50;
        this.setVelocity(0, 0);
        this.onPaddle = true;
    }

    launch() {
        this.onPaddle = false;
        this.setVelocity(75, -300);
    }
}
