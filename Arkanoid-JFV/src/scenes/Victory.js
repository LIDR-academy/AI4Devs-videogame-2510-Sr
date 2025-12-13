import { Scene } from 'phaser';

export class Victory extends Scene {
    constructor() {
        super('Victory');
    }

    create() {
        this.cameras.main.setBackgroundColor(0x000000);

        this.add.text(400, 300, 'YOU WIN!', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#00ff00',
            stroke: '#ffffff', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(400, 450, 'Press SPACE to Play Again', {
            fontFamily: 'Arial', fontSize: 24, color: '#ffffff'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('MainMenu');
        });

        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}
