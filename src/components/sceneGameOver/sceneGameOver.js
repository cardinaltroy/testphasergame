import Phaser from 'phaser';

class sceneGameOver extends Phaser.Scene {
    constructor() {
        super('sceneGameOver');
    }

    create() {
        this.add.image(0, 0, 'back')
            .setOrigin(0, 0)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    }
}

export default sceneGameOver