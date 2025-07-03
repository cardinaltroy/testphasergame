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
import { UIGameFooter, UIGameFooterUpdate } from './uirender/UIGameFooter';
import { EffectShuffleArrow } from './render/EffectShuffleArrow';
import { EffectFreeCash } from './render/EffectFreeCash';
import { UIGameBots, UIGameBotsUpdate } from './uirender/UIGameBots';
import { EffectMinusCash } from './render/EffectMinusCash';
import { GetCompletedCard } from './methods/GetCompletedCard';
import { UIGameDialogExit, UIGameDialogExitShow } from './uirender/UIGameDialogExit';

export class sceneGame extends Phaser.Scene {
    //ПО НЕМНОГУ РЕФАКТОРИМ ПРОЕКТ
    constructor() {
        super('sceneGame');
        //temp
        this.cardsData = []; // всі карти
        this.grid = []; // сітка зі слотами для карт
        this.elapsed = 0; // для таймеру
        this.hintsAvailable = 0; // кол-во доступных ходов в текущий момент. Для эффектов 
        this.lvlFinished = false; // стейт для эффекта стрелки возле кнопки перемешивания, что игра закончена
        this.afkTimer = 0; // для подсказок

        //ui temp
        this.ui = {
            UIGameBotsContainers: null, // для сортировки списка "игроков"
            UIGameDialogExit: null,
            UIGameFooterUndo: null, // для undo последнее перемещение
            UIGameFooterMoney: null, //для перерендера денег
        }

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
        this.GetCompletedCard = GetCompletedCard.bind(this);

        this.UtilsGetCardValue = UtilsGetCardValue.bind(this);
        this.UtilsGetNearestFreeCell = UtilsGetNearestFreeCell.bind(this);
        this.UtilsGridScale = UtilsGridScale.bind(this);

        //renders
        this.RenderCardsFlyInAnimation = RenderCardsFlyInAnimation.bind(this);
        this.RenderCardsRevealAnimation = RenderCardsRevealAnimation.bind(this);
        this.RenderCardsGameOver = RenderCardsGameOver.bind(this);
        this.RenderWinnerScreen = RenderWinnerScreen.bind(this);
        this.EffectShuffleArrow = EffectShuffleArrow.bind(this);
        this.EffectFreeCash = EffectFreeCash.bind(this);
        this.EffectCardsParticles = EffectCardsParticles.bind(this);
        this.EffectMinusCash = EffectMinusCash.bind(this);

        //UI
        this.UIGameBots = UIGameBots.bind(this);
        this.UIGameBotsUpdate = UIGameBotsUpdate.bind(this);
        this.UIGameDialogExit = UIGameDialogExit.bind(this);
        this.UIGameDialogExitShow = UIGameDialogExitShow.bind(this);
        this.UIGameFooter = UIGameFooter.bind(this);
        this.UIGameFooterUpdate = UIGameFooterUpdate.bind(this);
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

        let stars = winner.isBot ? botsStore.currentRound - 1 : 3;


        this.RenderCardsGameOver();
        botsStore.initNextRound(winner);
        this.RenderWinnerScreen(winner, botsStore.currentRound);


        if (winner.isBot) {
            //console.log(`турнир №${engineStore.lastId + 1} закончился победой бота ${winner.name}, у игрока звёзд: ${stars}`)
            engineStore.setLevelStars(engineStore.lastId, stars);

            return this.time.delayedCall(6000, () => {
                engineStore.setScene('sceneMenu')
            });
        } else if (botsStore.currentRound === 0) {
            //console.log(`турнир №${engineStore.lastId + 1} закончился победой игрока ${winner.name}, у игрока звёзд: ${stars}`)
            engineStore.setLevelStars(engineStore.lastId, stars);

            return this.time.delayedCall(6000, () => {
                engineStore.setScene('sceneMenu')
            });
        } else {
            //console.log('следующий раунд')
        }

        this.time.delayedCall(3000, () => {
            engineStore.setScene('sceneMenu')
        });
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

        this.UIGameBots();
        this.UIGameDialogExit();
        this.UIGameFooter();


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

                    //this.EffectCardsParticles(pointer, 'sparkRed', 0.2);

                    this.tweens.add({
                        targets: card,
                        x: card.getData('originalX'),
                        y: card.getData('originalY'),
                        duration: 200,
                        ease: 'Power2'
                    });
                }
            } else {
                //this.EffectCardsParticles(pointer, 'sparkRed', 0.2);
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
            this.UIGameBotsUpdate();

            this.isLevelStarted && botsStore.update(); // адпейтим после того как карты разложились

            //ждем начало уровня(что бы карты все разложились)
            if (!this.isLevelStarted) {
                this.LevelStartedTimer++;
                if (this.LevelStartedTimer >= this.LevelStartedTimeMax) this.isLevelStarted = true;
            }




            let currentTimeOut = engineStore.userHintTimeouts[engineStore.lastId];
            // например 3 сек юзер не ходил, показываем подсказку, и ждем пока дропнется счетчик для нового афк отсчета 
            if (currentTimeOut) {
                if (this.afkTimer < currentTimeOut) {
                    //console.log(this.afkTimer)
                    this.afkTimer++;
                } else if (this.afkTimer === currentTimeOut) {
                    //console.log('check',this.afkTimer)
                    this.GetUserHint();
                    this.afkTimer++;
                }
            }

        }
    }
}

export default sceneGame;