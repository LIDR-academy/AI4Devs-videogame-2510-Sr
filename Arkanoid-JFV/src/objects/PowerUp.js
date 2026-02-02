export class PowerUp extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, 'powerup');

        this.type = type;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setVelocityY(100);
    }
}
