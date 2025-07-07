import Phaser from 'phaser';

class engineStore {

    constructor() {
        this.uiFont = ''
        this.uiFontColor = ''
        this.uiFontColorSecondary = ''

        this.game/* : PhaserGame | null */ = null;
        this.gameScene = 'sceneMenu'; // Стартовый UI 
        this.cards = 6; // колво карт в ряду
        this.random = 100; // шанс смешивания карт, чем меньше тем меньше карт перетасовано меж собой
        this.lastId = 0; // последний уровень который запускали
        this.targetId = null;//для анимации
        this.levelsFinished = []; //тут колво звёзд за каждый пройденный уровень


        //user temp stats
        this.userPlayTIme = 0; // игровое время в раунде
        this.userMoves = 0; // сколько ходов сделал за раунд
        this.userScores = 0; // очки?
        this.userCash = 1000; // баланс игрока
        this.userShufflesPrice = 50; // цена за 1 перемешенивание карт
        this.userHintPrice = 25; // цена за 1 перемешенивание карт
        this.userMoneyDropSteps = 3; // 10 кликов(удачных) осталось до шанса получить монетки
        this.userHintTimeouts = [1, 3, 5] // первый уровень срабатывание через секунду, второй - через 3сек и т.д...
    }
    update() {
        this.userPlayTIme += 1;
        if (this.game && this.gameScene === 'sceneGame') {
            let scene = this.game.scene.getScene('sceneGame');
            if (scene.ui.UIGameBotsContainers === null) return;
            scene.uiGameBotsUser.setText(`${scene.GetCompletedCard()}/${this.cards * 4}`)
        }
    }
    unmount() {
        // when canvas unmount
        this.game = null;
        this.gameScene = 'sceneMenu';
    }

    setLevelStars(lvl, stars) {
        if (!stars) return;

        // Проверяем, новый ли уровень
        const isNewLevel = lvl >= this.levelsFinished.length && stars === 3;

        // Расширяем массив, если нужно
        while (this.levelsFinished.length <= lvl) {
            this.levelsFinished.push(0);
        }

        // Обновляем звезды, если текущее значение меньше
        if (stars > this.levelsFinished[lvl]) {
            this.levelsFinished[lvl] = stars;
        }

        // Если это новый уровень - устанавливаем targetId
        if (isNewLevel) {
            this.targetId = lvl;
        }
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
        if (!sceneName || this.game === null) return null;

        this.game.scene.stop(this.gameScene);
        this.game.scene.start(sceneName);
        this.gameScene = sceneName;
    }
    //GAME // удалить и использовать в sceneGame ( остаток после реакта )
    finishGame(winner) { 
        if (this.gameScene !== 'sceneGame' || !winner) return;

        let scene = this.game.scene.getScene('sceneGame');
        scene.finish(winner);
    }
    undoMove() {
        if (this.gameScene !== 'sceneGame') return;

        let scene = this.game.scene.getScene('sceneGame');
        scene.UndoMove();
    }
    shuffleLastCards() {
        // перемешиваем карты кроме заблокированых
        if (this.gameScene !== 'sceneGame' || this.userCash < this.userShufflesPrice) return;

        let scene = this.game.scene.getScene('sceneGame');
        this.userCash -= this.userShufflesPrice;
        scene.RefreshLastCards()
    }
    showUserHint() {
        if (this.gameScene !== 'sceneGame') return;
        let scene = this.game.scene.getScene('sceneGame');
        this.userCash -= this.userHintPrice;
        scene.GetUserHint(false);
    }

    //кількість карт (4-13) та наскільки перемішанна партія( 1-100 % ), id уровня - lvl
    setDifficult(cards, random, id) {

        if (cards == null || random == null || id == null) return;


        this.cards = cards;
        this.random = random;
        this.lastId = id;
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