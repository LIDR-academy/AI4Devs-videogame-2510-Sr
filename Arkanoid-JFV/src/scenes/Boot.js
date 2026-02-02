import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        //  The Boot Scene is typically used to load the Load Bar assets
        //  or to configuration the game instance.
    }

    create() {
        this.scene.start('Preloader');
    }
}
