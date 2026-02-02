export class Paddle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'paddle');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setImmovable(true);
        this.body.moves = false; // Manually handle movement, ignore physics engine displacement

        //  Input handling
        this.cursors = scene.input.keyboard.createCursorKeys();

        // Add mouse control
        this.isMouseControl = false;
        scene.input.on('pointermove', (pointer) => {
            // Ignore small jitter
            // Only switch to mouse control if it has moved significantly
            if (Math.abs(pointer.x - pointer.prevPosition.x) > 2) {
                this.isMouseControl = true;
                this.x = Phaser.Math.Clamp(pointer.x, this.width / 2, scene.scale.width - this.width / 2);
            }
        });

        // Reset to keyboard if keys are pressed
        this.scene.input.keyboard.on('keydown', () => {
            this.isMouseControl = false;
        });

        this.speed = 10;

        // Disable mouse control if cursor is not moving
        this.scene.input.on('pointerdown', () => {
            // Optional: if user clicks, maybe enable mouse? 
            // For now, let's keep the logic simple: motion enables mouse, keys disable it.
        });
    }

    update() {
        if (this.isMouseControl) return;

        if (this.cursors.left.isDown) {
            this.x -= this.speed;
        }
        else if (this.cursors.right.isDown) {
            this.x += this.speed;
        }

        // Clamp to screen bounds
        this.x = Phaser.Math.Clamp(this.x, this.width / 2, this.scene.scale.width - this.width / 2);
    }
}
