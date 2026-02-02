export class Brick extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type = 'normal') {
        super(scene, x, y, 'brick');

        scene.add.existing(this);
        // Important: For static groups, we don't necessarily want to add to physics manually if the group handles it.
        // But since we are creating it manually and then adding to group, we should ensure body exists.
        scene.physics.add.existing(this, true); // true = static body for individual add

        this.setImmovable(true);

        this.type = type;
        this.isIndestructible = (type === 'gold');

        if (this.isIndestructible) {
            this.setTint(0x708090); // Steel Gray
        } else if (type === 'red') {
            this.setTint(0xff0000);
        } else {
            this.setTint(0xff0000); // Normal - Was white/red, now explicit Red
        }

        // Default health
        this.health = 1;
    }

    hit() {
        if (this.isIndestructible) return false;

        this.health--;

        if (this.health <= 0) {
            this.disableBody(true, true);
            return true; // Destroyed
        }

        return false; // Still alive
    }
}
