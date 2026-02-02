import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        //  this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(400, 300, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(400 - 230, 300, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Procedural Asset Generation (Placeholder for now)
        this.generateGraphics();

        this.scene.start('MainMenu');
    }

    generateGraphics() {
        // Logic to generate textures for Ball, Paddle, Bricks
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Generate Ball
        graphics.clear();
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(10, 10, 10); // Radius 10
        graphics.generateTexture('ball', 20, 20);

        // Generate Paddle
        graphics.clear();
        graphics.fillStyle(0x00ff00);
        graphics.fillRoundedRect(0, 0, 100, 20, 5);
        graphics.generateTexture('paddle', 100, 20);

        // Generate Brick
        graphics.clear();
        graphics.fillStyle(0xffffff); // White base for proper tinting
        graphics.fillRect(0, 0, 64, 32);
        graphics.lineStyle(2, 0x000000);
        graphics.strokeRect(0, 0, 64, 32);
        graphics.generateTexture('brick', 64, 32);

        // Generate Power-up (Enlarge)
        graphics.clear();
        graphics.fillStyle(0x00ffff); // Cyan
        graphics.fillRoundedRect(0, 0, 30, 15, 7);
        graphics.generateTexture('powerup', 30, 15);

        // Generate Power-up (Disruption)
        graphics.clear();
        graphics.fillStyle(0xff00ff); // Purple
        graphics.fillCircle(15, 15, 7); // Circle shape
        graphics.generateTexture('powerup_disruption', 30, 30);

        // Generate Boss (Moai Head)
        graphics.clear();
        graphics.fillStyle(0x888888); // Grey
        graphics.fillRoundedRect(0, 0, 100, 150, 20); // Head
        graphics.fillStyle(0x666666);
        graphics.fillRect(20, 40, 60, 10); // Brow
        graphics.fillRect(35, 60, 30, 60); // Nose
        graphics.fillRect(30, 130, 40, 10); // Mouth
        graphics.generateTexture('boss', 100, 150);

        graphics.destroy();
    }
}
