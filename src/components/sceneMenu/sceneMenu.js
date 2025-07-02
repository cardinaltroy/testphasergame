import Phaser from 'phaser';
import engineStore from '../../store/engineStore';
import { gameMap } from '../../content/gameMap';
import botsStore from '../../store/botsStore';
import { RenderUserFrame, RenderUserFrameMove } from './render/RenderUserFrame';

class sceneMenu extends Phaser.Scene {
    constructor() {
        super('sceneMenu');

        //Render
        this.RenderUserFrame = RenderUserFrame.bind(this)
        this.RenderUserFrameMove = RenderUserFrameMove.bind(this)
    }
    preload() {
        // assetloader надо нормальный написать

        this.load.image('back', './back.webp');
        this.load.image('gameMap1', './map1.jpg');
        this.load.image('menuButton', '/but_red_down.png');//replace
        this.load.atlas('common1', './common1.png', './common1.json');
        this.load.atlas('common2', './common2.png', './common2.json');


        //cards bg
        this.load.image('card_bg2', './card_bg2.png');
        this.load.image('card_place', './card_place.png');
        this.load.image('card_shirt3', './card_shirt3.png');
        //suits
        for (let i = 0; i <= 3; i++) {
            this.load.image(`suit_${i}`, `./lear_mini_${i}.png`);
        }
        //cards
        for (let i = 0; i <= 12; i++) {
            this.load.image(`card_${i}b`, `./card_${i}b.png`);
            this.load.image(`card_${i}r`, `./card_${i}r.png`);
        }

        //bots
        for (let i = 0; i <= 10; i++) {
            this.load.image(`bot_fe${String(i).padStart(4, '0')}`, `./bots/fe${String(i).padStart(4, '0')}.jpg`);
            this.load.image(`bot_ma${String(i).padStart(4, '0')}`, `./bots/ma${String(i).padStart(4, '0')}.jpg`);
        }
        this.load.image('bot_panel', './bots/bot_panel.png');
        this.load.image('bot_cards', './bots/cards.png');


        //others
        this.load.image('sparkGreen', './sparkGreen.webp');
        this.load.image('sparkRed', './sparkRed.webp');
        this.load.image('icon_x', './icon_x.png');
        this.load.image('icon_shuffle', './icon_shuffle.png');
        this.load.image('icon_hint', './icon_hint.png');
        this.load.image('cash', './cash.webp');
        this.load.image('glow', './glow.webp');
        this.load.image('arrow', './tutorial_arrow2.png');

        this.load.audio('drag', './drag.wav');


        //temp
        this.load.image('user', './bots/ma0000.jpg');
    }

    create() {
        //ОТРЕФАКТОРИТЬ НА МЕТОДЫ
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
        const buttonScale = this.sys.game.device.os.android || this.sys.game.device.os.iOS ? 0.7 : 1;
        // Отрисовка кнопок уровней
        gameMap.forEach((point, index) => {
            const button = this.add.image(
                offsetX + point.x * scale,
                offsetY + point.y * scale,
                'menuButton'
            ).setScale(buttonScale).setInteractive({ useHandCursor: true });

            this.add.sprite(
                offsetX + point.x * scale,
                offsetY + (point.y + 3) * scale,
                'common1', 'level_item_passed'
            ).setScale(buttonScale)

            // Добавим текст (название уровня)
            this.add.text(
                button.x,
                button.y - 10,
                point.title,
                {
                    fontSize: `${buttonScale * 25}px`,
                    color: '#fff',
                    fontFamily: 'monospace'
                }
            ).setOrigin(0.5);

            //Запускаем раунд, спавним ботов
            button.on('pointerdown', () => {
                engineStore.setDifficult(point.cards, point.random, point.id);
                botsStore.initNextRound();
            });

            // === Рисуем юзера ===
            let maxLevel = engineStore.levelsFinished.length - 1;
            let target = engineStore.targetId;

            if (target !== null) {// с анимацией
                point.id === maxLevel - 1 && this.RenderUserFrame(button, scale);
                point.id === maxLevel && this.RenderUserFrameMove(button);
            } else {//без анимации
                point.id === maxLevel && this.RenderUserFrame(button, scale);
            }

        });

        // Убедиться, что контейнер юзера выше всех
        if (this.userContainer) {
            this.children.bringToTop(this.userContainer);
        }


        // Отладка: клик — координаты
        this.input.on('pointerdown', (pointer) => {
            //console.log(`x: ${pointer.worldX.toFixed(0)}, y: ${pointer.worldY.toFixed(0)}`);
        });



        const { width, height } = this.sys.game.config;
        const buttPlay = this.add.image(width / 2, height - 50, 'bot_panel').setScale(0.7).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.add.text(
            width / 2,
            height - 50,
            'PLAY',
            {
                fontSize: `40px`,
                color: 'black',
                fontFamily: 'monospace'
            }
        ).setOrigin(0.5)

        buttPlay.on('pointerdown', () => {
            let lvlPlay = gameMap[engineStore.levelsFinished.length - 1];

            engineStore.setDifficult(lvlPlay.cards, lvlPlay.random, lvlPlay.id);
            botsStore.initNextRound();
        })

    }
}

export default sceneMenu;
