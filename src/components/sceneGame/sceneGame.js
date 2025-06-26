import Phaser from 'phaser';
import engineStore from '../../store/engineStore';
import { UndoMove } from './methods/UndoMove';
import { RefreshLastCards } from './methods/RefreshLastCards';
import { IsGameOver } from './methods/IsGameOver';
import { UtilsGetCardValue } from './methods/UtilsGetCardValue';
import { UtilsGetNearestFreeCell } from './methods/UtilsGetNearestFreeCell';
import { CreateGrid } from './methods/CreateGrid';
import { UpdateCellHints } from './methods/UpdateCellHints';
import { CreateCards } from './methods/CreateCards';
import { CheckFinishedLines } from './methods/CheckFinishedLines';
import { UtilsSpawnEffects } from './methods/UtilsSpawnEffects';
import { UserValidMove } from './methods/UserValidMove';

export class sceneGame extends Phaser.Scene {
    constructor() {
        super('sceneGame');
        //temp
        this.cardsData = []; // всі карти
        this.grid = []; // сітка зі слотами для карт
        this.lastMove = null; // для undo
        this.elapsed = 0; // для таймеру

        //config
        this.config();

        //methods
        this.CreateGrid = CreateGrid.bind(this);
        this.CreateCards = CreateCards.bind(this);
        this.UpdateCellHints = UpdateCellHints.bind(this);

        this.UndoMove = UndoMove.bind(this);
        this.RefreshLastCards = RefreshLastCards.bind(this);
        this.IsGameOver = IsGameOver.bind(this);
        this.CheckFinishedLines = CheckFinishedLines.bind(this);

        this.UserValidMove = UserValidMove.bind(this);

        this.UtilsGetCardValue = UtilsGetCardValue.bind(this);
        this.UtilsGetNearestFreeCell = UtilsGetNearestFreeCell.bind(this);
        this.UtilsSpawnEffects = UtilsSpawnEffects.bind(this);
    }

    config() {
        this.cardWidth = 41;
        this.cardHeight = 59;
        this.suits = 4;

        this.cardsValues = engineStore.cards; // теперь напрямую из стора
        this.cardsBase = 1; // всегда хотя бы одна карта в ряду
        this.cardsRandom = Math.floor(this.cardsValues * (engineStore.random / 100));
        this.cardsBase = this.cardsValues - this.cardsRandom;

        this.cardsFree = 1;
        this.columns = this.cardsBase + this.cardsRandom + this.cardsFree;
    }


    preload() {
        // надо бы сделать нормальный AssetLoader через список потом

        //cards
        for (let i = 0; i <= 12; i++) {
            this.load.image(`card_${i}b`, `./card_${i}b.png`);
            this.load.image(`card_${i}r`, `./card_${i}r.png`);
        }
        //cards bg
        this.load.image('card_bg2', './card_bg2.png');
        this.load.image('card_place', './card_place.png');

        //suits
        for (let i = 0; i <= 3; i++) {
            this.load.image(`suit_${i}`, `./lear_mini_${i}.png`);
        }

        this.load.image('sparkGreen', './sparkGreen.webp');
        this.load.image('sparkRed', './sparkRed.webp');
        this.load.image('cash', './cash.webp');
        this.load.image('glow', './glow.webp');

        this.load.audio('drag', './drag.wav');

    }

    create() {
        this.config();

        this.add.image(0, 0, 'back')
            .setOrigin(0, 0)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // создаем сетку, карты, проверяем какие складены уже
        this.CreateGrid();
        this.CreateCards();
        this.CheckFinishedLines();


        this.input.on('dragstart', (pointer, gameObject) => {
            this.children.bringToTop(gameObject);
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject.getData('locked')) return; // 🔒 не даём таскать
            console.log(gameObject.getData('locked'))
            gameObject.x = dragX;
            gameObject.y = dragY;
        });


        this.input.on('dragend', (pointer, card) => {
            const nearest = this.UtilsGetNearestFreeCell(card.x, card.y);
            if (nearest) {
                const oldCell = card.getData('cell');
                const draggedValue = this.UtilsGetCardValue(card);

                const leftCell = this.grid.find(c =>
                    c.row === nearest.row &&
                    c.col === nearest.col - 1
                );

                const leftCard = leftCell?.card;
                const leftValue = this.UtilsGetCardValue(leftCard);

                const validMove = leftCard && leftValue + 1 === draggedValue;

                console.log(nearest, oldCell, leftCell, leftCard, leftValue);
                if (validMove) {
                    this.UserValidMove(pointer, card, nearest, oldCell)
                } else {

                    this.UtilsSpawnEffects(pointer, 'sparkRed', 0.2);

                    this.tweens.add({
                        targets: card,
                        x: card.getData('originalX'),
                        y: card.getData('originalY'),
                        duration: 200,
                        ease: 'Power2'
                    });
                }
            } else {
                this.UtilsSpawnEffects(pointer, 'sparkRed', 0.2);
                this.tweens.add({
                    targets: card,
                    x: card.getData('originalX'),
                    y: card.getData('originalY'),
                    duration: 300,
                    ease: 'Power2'
                });
            }

            this.IsGameOver();
        });

        console.log(this.cards)
    }


    update(time, delta) {
        this.elapsed += delta

        // Раз в секунду апдейтим стейти наприклад таймер гри
        if (this.elapsed >= 1000) {
            this.elapsed -= 1000

            engineStore.update()
        }
    }
}

export default sceneGame;