import Phaser from 'phaser';

class sceneMenu extends Phaser.Scene {
    constructor() {
        super('sceneMenu');
    }
    preload() {
        this.load.image('back', './back.webp');
    }

    create() {
        this.add.image(0, 0, 'back')
            .setOrigin(0, 0)  
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);  

        /* Я вибрав canvas лише для рендеру гри, а інтерфейси, меню через REACT/SCSS
        // Текст
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'Prototype Game', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'by Cardinal_Troy', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Кнопка
        const playButton = this.add.circle(this.cameras.main.centerX, this.cameras.main.centerY, 50, 0x007c0a)
            .setOrigin(0.5)
            .setInteractive()
            .setFillStyle(0x404040);

        playButton.on('pointerdown', () => {
            this.scene.start('sceneGame');
        });

        playButton.on('pointerover', () => {
            playButton.setFillStyle(0x808080);
        });

        playButton.on('pointerout', () => {
            playButton.setFillStyle(0x404040);
        });

        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'PLAY', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        */
    }
}

export default sceneMenu;
