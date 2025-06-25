import Phaser from 'phaser';
import engineStore from '../../store/engineStore';
import { UndoMove } from './methods/UndoMove';
import { RefreshLastCards } from './methods/RefreshLastCards';
import { IsGameOver } from './methods/IsGameOver';
import { UtilsGetCardValue } from './methods/UtilsGetCardValue';
import { UtilsGetNearestFreeCell } from './methods/UtilsGetNearestFreeCell';
import { CreateDeck } from './methods/CreateDeck';
import { CreateGrid } from './methods/CreateGrid';
import { ArrangeCards } from './methods/ArrangeCards';
import { UpdateCellHints } from './methods/UpdateCellHints';
import { CreateCards } from './methods/CreateCards';

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
        this.CreateDeck = CreateDeck.bind(this);
        this.CreateCards = CreateCards.bind(this);
        this.ArrangeCards = ArrangeCards.bind(this);
        this.UpdateCellHints = UpdateCellHints.bind(this);

        this.UndoMove = UndoMove.bind(this);
        this.RefreshLastCards = RefreshLastCards.bind(this);
        this.IsGameOver = IsGameOver.bind(this);


        this.UtilsGetCardValue = UtilsGetCardValue.bind(this);
        this.UtilsGetNearestFreeCell = UtilsGetNearestFreeCell.bind(this);
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
        this.load.spritesheet('cards', './asset_card.webp', {
            frameWidth: this.cardWidth,
            frameHeight: this.cardHeight,
        });
        this.load.audio('drag', './drag.wav');
    }
    create() {
        this.config()// якщо переключили складність то оновлюємо конфіг

        this.add.image(0, 0, 'back') // задній фон
            .setOrigin(0, 0)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        this.CreateGrid();
        this.CreateCards();
        //this.CreateDeck();
        //this.ArrangeCards();

        this.input.on('dragstart', (pointer, gameObject) => {
            this.children.bringToTop(gameObject); // карта завжди зверху
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer, card) => {
            // шукаємо найближчий слот
            const nearest = this.UtilsGetNearestFreeCell(card.x, card.y);

            if (nearest) {
                // записуємо звідки і яку забираємо карту
                const oldCell = card.getData('cell');
                const draggedValue = this.UtilsGetCardValue(card);
                // чи можемо підставити карту, враховуючи ту що стоїть зліва
                const leftCell = this.grid.find(c =>
                    c.row === nearest.row &&
                    c.col === nearest.col - 1
                );

                const leftCard = leftCell?.card;
                const leftValue = this.UtilsGetCardValue(leftCard);

                const validMove = leftCard && leftValue + 1 === draggedValue;

                if (validMove) {
                    this.sound.play('drag');
                    this.tweens.add({
                        targets: card,
                        scaleX: 1.1,
                        scaleY: 1.1,
                        yoyo: true,
                        duration: 100,
                        ease: 'Power2'
                    });
                    // стейт для кнопки UNDO
                    this.lastMove = {
                        card: card,
                        oldX: card.getData('originalX'),
                        oldY: card.getData('originalY'),
                        oldCell: card.getData('cell'),
                        nearest: nearest,
                    };

                    // слот обнуляємо з якого забираємо карту
                    oldCell.occupied = false;
                    oldCell.card = null;

                    // в карту записуємо нові дані
                    card.x = nearest.x;
                    card.y = nearest.y;
                    card.setData('cell', nearest);
                    card.setData('originalX', nearest.x);
                    card.setData('originalY', nearest.y);

                    //прописуємо в новий слот карту
                    nearest.occupied = true;
                    nearest.card = card;

                    //всякі дрібниці та перерендер підсказок
                    engineStore.addMoves();
                    engineStore.addScores();
                    this.UpdateCellHints();
                } else {
                    // Не можемо в цей слот поставити, повертаєм назад
                    card.x = card.getData('originalX');
                    card.y = card.getData('originalY');
                }

            } else {
                // Слоту не знайшли, повертаємся
                card.x = card.getData('originalX');
                card.y = card.getData('originalY');
            }

            //Після перетягувань перевірити чи гру завершено 
            this.IsGameOver();
        });
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