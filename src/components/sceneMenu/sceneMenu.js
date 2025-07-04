import Phaser from 'phaser';
import engineStore from '../../store/engineStore';
import { gameMap } from '../../content/gameMap';
import botsStore from '../../store/botsStore';
import { RenderUserFrame, RenderUserFrameMove } from './render/RenderUserFrame';
import { UIMenuPlay, UIMenuPlayShow } from './uirender/UIMenuPlay';
import { RenderBackground } from './render/RenderBackground';
import { RenderUserLevels } from './render/RenderUserLevels';
import { UIMenuDialogWaiting, UIMenuDialogWaitingShow } from './uirender/UIMenuDialogWaiting';
import { UtilsGridScale } from './methods/UtilsGridScale';

class sceneMenu extends Phaser.Scene {
    constructor() {
        super('sceneMenu');


        //ui temp
        this.ui = {
            UIMenuDialogWaiting: null, // для окна ожидания противников
            UIMenuPlay: null,
        }

        //methods
        this.UtilsGridScale = UtilsGridScale.bind(this);

        //UI
        this.UIMenuPlay = UIMenuPlay.bind(this);
        this.UIMenuPlayShow = UIMenuPlayShow.bind(this);
        this.UIMenuDialogWaiting = UIMenuDialogWaiting.bind(this);
        this.UIMenuDialogWaitingShow = UIMenuDialogWaitingShow.bind(this);

        //Render
        this.RenderBackground = RenderBackground.bind(this);
        this.RenderUserLevels = RenderUserLevels.bind(this);
        this.RenderUserFrame = RenderUserFrame.bind(this);
        this.RenderUserFrameMove = RenderUserFrameMove.bind(this);

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
        this.RenderBackground();
        this.RenderUserLevels();
        this.UIMenuPlay();
        this.UIMenuDialogWaiting();

        // Убедиться, что контейнер юзера выше всех
        if (this.userContainer) {
            this.children.bringToTop(this.userContainer);
        }

        // for debag coords
        //this.input.on('pointerdown', pointer => { console.log(`x: ${pointer.worldX.toFixed(0)}, y: ${pointer.worldY.toFixed(0)}`); });
    }
}

export default sceneMenu;
