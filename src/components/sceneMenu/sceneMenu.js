import Phaser from 'phaser';
import engineStore from '../../store/engineStore';
import { gameMap } from '../../content/gameMap';
import botsStore from '../../store/botsStore';

class sceneMenu extends Phaser.Scene {
    constructor() {
        super('sceneMenu');
    }

    preload() {
        this.load.image('back', './back.webp');
        this.load.image('gameMap1', './map1.jpg');
        this.load.image('menuButton', '/but_red_down.png');
    }

    create() {
        const bg = this.add.image(0, 0, 'gameMap1').setOrigin(0, 0);

        const screenHeight = this.cameras.main.height;
        const screenWidth = this.cameras.main.width;

        const texture = this.textures.get('back');
        const frame = texture.getSourceImage();

        const originalWidth = frame.width;
        const originalHeight = frame.height;

        const scale = screenHeight / originalHeight;
        bg.setScale(scale);
        bg.x = (screenWidth - originalWidth * scale) / 2;

        // Коэффициент сдвига карты для кнопок (если сдвинули по x, нужно компенсировать)
        const offsetX = bg.x;
        const offsetY = 0; // bg.y == 0, так как Origin(0,0)

        // Отрисовка кнопок уровней
        gameMap.forEach((point, index) => {
            const button = this.add.image(
                offsetX + point.x * scale,
                offsetY + point.y * scale,
                'menuButton'
            ).setScale(0.3).setInteractive({ useHandCursor: true });

            // Добавим текст (название уровня)
            this.add.text(
                button.x,
                button.y - 30,
                point.title,
                { fontSize: '20px', color: '#fff', fontFamily: 'monospace' }
            ).setOrigin(0.5);

            button.on('pointerdown', () => {
                console.log(`Нажата кнопка уровня ${point.title}`,point.cards, point.random);
                engineStore.setDifficult(point.cards, point.random);
                botsStore.initNextRound();
            });
        });

        // Отладка: клик — координаты
        this.input.on('pointerdown', (pointer) => {
            console.log(`x: ${pointer.worldX.toFixed(0)}, y: ${pointer.worldY.toFixed(0)}`);
        });
    }
}

export default sceneMenu;
