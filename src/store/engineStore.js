import { action, makeAutoObservable, makeObservable, observable } from "mobx";
import UIMenu from "../components/sceneMenu/UIMenu";
import UIGame from "../components/sceneGame/UIGame";
import UIGameOver from "../components/sceneGameOver/UIGameOver";
import Phaser from 'phaser';

class engineStore {
    // Коли міняємо сцену в грі, міняємо і UI інтерфейс для сцени також
    // Данна система дозволить створювати інтерфейси і через Фазер, і через реакт :)

    constructor() {
        this.game/* : PhaserGame | null */ = null;
        this.uiCurrent = 'sceneMenu'; // Стартовый UI 
        this.uiScenes = { // к каждой сцене свой UI подключаем
            sceneMenu: <UIMenu />,
            sceneGame: <UIGame />,
            sceneGameOver: <UIGameOver />,
        };
        this.difficultMode = 0; // удалить
        this.cards = 6; // колво карт в ряду
        this.random = 100; // шанс смешивания карт, чем меньше тем меньше карт перетасовано меж собой

        //user temp stats
        this.userPlayTIme = 0; // игровое время в раунде
        this.userMoves = 0; // сколько ходов сделал за раунд
        this.userScores = 0; // очки?
        this.userCash = 1000; // баланс игрока
        this.userShufflesPrice = 50; // цена за 1 перемешенивание карт
        this.userHintPrice = 25; // цена за 1 перемешенивание карт
        this.userMoneyDropSteps = 3; // 10 кликов(удачных) осталось до шанса получить монетки
        this.userAFKTimeout = 10; //через сколько секунд показать подсказку если не ходит юзер

        makeObservable(this, {
            uiCurrent: observable,
            userPlayTIme: observable,
            difficultMode: observable,
            userCash: observable,
            setUI: action,
            update: action,
            setDifficult: action,
            shuffleLastCards: action,
            addCash: action,
            showUserHint: action,
        })
    }
    update() {
        this.userPlayTIme += 1;
    }
    unmount() {
        // when canvas unmount
        this.game = null;
        this.uiCurrent = 'sceneMenu'; // краще буде с null та обробляти його але це прототип лише, тай взагалі needed typescript for this :)
    }


    get getUI() {
        let target = this.uiCurrent;
        if (!this.uiScenes[target]) return null;

        return this.uiScenes[target];
    }

    setUI(sceneName) {
        if (!sceneName || !this.uiScenes[sceneName]) return null;

        this.uiCurrent = sceneName;

        return this.uiCurrent;
    }

    get getGame() {
        return this.game;
    }

    setGame(game) {
        if (!game) return;

        this.game = game;
        return game;
    }

    setScene(sceneName) { // Абстракція для спрощення перемикання сцен + інтерфейсу
        if (!sceneName || !this.uiScenes[sceneName] || this.game === null) return null;

        this.game.scene.stop(this.uiCurrent);
        this.game.scene.start(sceneName);
        this.setUI(sceneName);
    }
    //GAME
    finishGame(winner) {
        if (this.uiCurrent !== 'sceneGame' || !winner) return;

        let scene = this.game.scene.getScene('sceneGame');
        scene.finish(winner);
    }
    undoMove() {
        if (this.uiCurrent !== 'sceneGame') return;

        let scene = this.game.scene.getScene('sceneGame');
        scene.UndoMove();
    }
    shuffleLastCards() {
        // перемешиваем карты кроме заблокированых
        if (this.uiCurrent !== 'sceneGame' || this.userCash < this.userShufflesPrice) return;

        let scene = this.game.scene.getScene('sceneGame');
        scene.RefreshLastCards()
        this.userCash -= this.userShufflesPrice;
    }
    showUserHint() {
        if (this.uiCurrent !== 'sceneGame') return;
        let scene = this.game.scene.getScene('sceneGame');
        scene.GetUserHint(false);
        this.userCash -= this.userHintPrice;
    }

    //кількість карт (4-13) та наскільки перемішанна партія( 1-100 % )
    setDifficult(cards, random) {
        if (!cards || !random) return;

        this.cards = cards;
        this.random = random;
    }

    // USER
    userDrop() {
        // по факту начальний init гравця
        this.userMoves = 0;
        this.userPlayTIme = 0;
        this.userScores = 0;
    }

    addMoves() {
        this.userMoves += 1;
    }

    addScores() {
        this.userScores += 100;
    }
    addCash(value) {
        if (value <= 0) return;

        this.userCash += value
    }

    isCanDropMoney() {
        this.userMoneyDropSteps -= 1;

        if (this.userMoneyDropSteps <= 0) {
            this.userMoneyDropSteps = 3; // сбрасываем шаги

            // даём шанс 50% получить монеты
            return Phaser.Math.Between(0, 1) === 1;
        }

        return false;
    }
}
export default new engineStore()