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
import { UserValidMove } from './methods/UserValidMove';
import { RenderCardsFlyInAnimation } from './render/RenderCardsFlyInAnimation';
import { RenderCardsRevealAnimation } from './render/RenderCardsRevealAnimation';
import { UtilsGridScale } from './methods/UtilsGridScale';
import { EffectCardsParticles } from './render/EffectCardsParticles';
import { EffectMissClick } from './render/EffectMissClick';
import { GetUserHint } from './methods/GetUserHint';
import botsStore from '../../store/botsStore';
import { RenderCardsGameOver } from './render/RenderCardsGameOver';
import { RenderWinnerScreen } from './render/RenderWinnerScreen';
import { GetUserHintSecond } from './methods/GetUserHintSecond';

export class sceneGame extends Phaser.Scene {
    //ПО НЕМНОГУ РЕФАКТОРИМ ПРОЕКТ
    constructor() {
        super('sceneGame');
        //temp
        this.cardsData = []; // всі карти
        this.grid = []; // сітка зі слотами для карт
        this.lastMove = null; // для undo
        this.elapsed = 0; // для таймеру
        this.hintsAvailable = 0; // кол-во доступных ходов в текущий момент. Для эффектов 
        this.lvlFinished = false; // стейт для эффекта стрелки возле кнопки перемешивания, что игра закончена
        this.afkTimer = 0;

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
        this.GetUserHint = GetUserHint.bind(this);
        this.GetUserHintSecond = GetUserHintSecond.bind(this);

        this.UtilsGetCardValue = UtilsGetCardValue.bind(this);
        this.UtilsGetNearestFreeCell = UtilsGetNearestFreeCell.bind(this);
        this.UtilsGridScale = UtilsGridScale.bind(this);

        //renders
        this.RenderCardsFlyInAnimation = RenderCardsFlyInAnimation.bind(this);
        this.RenderCardsRevealAnimation = RenderCardsRevealAnimation.bind(this);
        this.RenderCardsGameOver = RenderCardsGameOver.bind(this);
        this.RenderWinnerScreen = RenderWinnerScreen.bind(this)

    }

    config() {
        this.cardWidth = 41;
        this.cardHeight = 59;
        this.suits = 4;
        this.afkTimer = 0;

        this.cardsValues = engineStore.cards; // колво карт в ряду напрямую из стора
        this.cardsBase = 1; // всегда хотя бы одна карта в ряду
        this.cardsRandom = Math.floor(this.cardsValues * (engineStore.random / 100));
        this.cardsBase = this.cardsValues - this.cardsRandom;

        this.cardsFree = 1;
        this.columns = this.cardsBase + this.cardsRandom + this.cardsFree;

        this.isLevelStarted = false; //
        this.LevelStartedTimer = 0;
        this.LevelStartedTimeMax = engineStore.cards * 4 * 200 / 1000; // приблизительное время расскладки карт на доску.
    }
    check() {
        this.IsGameOver();
        this.UpdateCellHints();
        this.CheckFinishedLines();
    }
    finish(winner) {
        if (this.lvlFinished) return;
        if (!winner) return;

        this.RenderCardsGameOver();
        this.RenderWinnerScreen(winner);
        botsStore.initNextRound(winner);


        console.log('finish')

        this.time.delayedCall(3000, () => {
            engineStore.setScene('sceneMenu')
        })
    }

    preload() {
        // надо бы сделать нормальный AssetLoader 

        //cards
        for (let i = 0; i <= 12; i++) {
            this.load.image(`card_${i}b`, `./card_${i}b.png`);
            this.load.image(`card_${i}r`, `./card_${i}r.png`);
        }
        //cards bg
        this.load.image('card_bg2', './card_bg2.png');
        this.load.image('card_place', './card_place.png');
        this.load.image('card_shirt3', './card_shirt3.png');


        //suits
        for (let i = 0; i <= 3; i++) {
            this.load.image(`suit_${i}`, `./lear_mini_${i}.png`);
        }

        //others
        this.load.image('sparkGreen', './sparkGreen.webp');
        this.load.image('sparkRed', './sparkRed.webp');
        this.load.image('icon_x', './icon_x.png');
        this.load.image('cash', './cash.webp');
        this.load.image('glow', './glow.webp');
        this.load.image('arrow', './tutorial_arrow2.png');

        this.load.audio('drag', './drag.wav');

    }

    create() {
        this.config();

        this.add.image(0, 0, 'back')
            .setOrigin(0, 0)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        this.CreateGrid(); // создаем сетку

        this.CreateCards(); // подготовка карт, создали и перемешали
        this.RenderCardsFlyInAnimation(); // анимаия прилета карт
        this.RenderCardsRevealAnimation();// разворот карт

        this.CheckFinishedLines(true); // проверка карт которые заблокировать и затемнить. true - что бы сбросить всё при новом уровне


        this.input.on('dragstart', (pointer, gameObject) => {
            this.children.bringToTop(gameObject);
            if (gameObject.getData('locked')) {
                // Один раз трясем карту при попытке потянуть
                this.tweens.add({
                    targets: gameObject,
                    x: gameObject.x - 5,
                    duration: 50,
                    yoyo: true,
                    repeat: 2,
                    ease: 'Sine.easeInOut',
                });
            } else {

                // Проверяем, совпадает ли карта, которую взяли, с той, на которую указывает стрелка
                if (this.arrowHint && gameObject === this.arrowHint.targetCard.card) this.GetUserHintSecond();
            }
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            this.dropAFK();
            if (gameObject.getData('locked')) return; // не даём таскать
            gameObject.x = dragX;
            gameObject.y = dragY;
        });


        this.input.on('dragend', (pointer, card) => {
            if (this.arrowHint) {
                this.arrowHint.destroy()
                this.arrowHint = null
            }

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

                //console.log(nearest, oldCell, leftCell, leftCard, leftValue);
                if (validMove) {
                    this.UserValidMove(pointer, card, nearest, oldCell)
                } else {

                    EffectCardsParticles(this, pointer, 'sparkRed', 0.2);

                    this.tweens.add({
                        targets: card,
                        x: card.getData('originalX'),
                        y: card.getData('originalY'),
                        duration: 200,
                        ease: 'Power2'
                    });
                }
            } else {
                EffectCardsParticles(this, pointer, 'sparkRed', 0.2);
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

        // Добавляем обработку кликов на пустое место
        this.input.on('pointerdown', (pointer) => {
            this.dropAFK()
            const x = pointer.x;
            const y = pointer.y;

            // Проверяем, кликнули ли по пустому месту (не по карте)
            const isCardClicked = this.grid.some(cell => cell.card && cell.card.getBounds().contains(x, y));

            if (!isCardClicked) {
                EffectMissClick(this, pointer)
            }
        });
    }

    dropAFK() {
        this.afkTimer = 0;
    }

    update(time, delta) {
        this.elapsed += delta

        // Раз в секунду
        if (this.elapsed >= 1000) {
            this.elapsed -= 1000

            //Просто апдейтим
            engineStore.update();
            this.isLevelStarted && botsStore.update(); // адпейтим после того как карты разложились

            //ждем начало уровня(что бы карты все разложились)
            if (!this.isLevelStarted) {
                this.LevelStartedTimer++;
                if (this.LevelStartedTimer >= this.LevelStartedTimeMax) this.isLevelStarted = true;
            }



            // например 10 сек юзер не ходил, показываем подсказку, и ждем пока дропнется счетчик для нового афк отсчета 
            if (this.afkTimer < engineStore.userAFKTimeout) {
                this.afkTimer++;
            } else if (this.afkTimer === engineStore.userAFKTimeout) {
                this.GetUserHint()
                this.afkTimer++;
            }

        }
    }
}

export default sceneGame;