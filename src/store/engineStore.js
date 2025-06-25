import { action, makeObservable, observable } from "mobx";
import UIMenu from "../components/sceneMenu/UIMenu";
import UIGame from "../components/sceneGame/UIGame";
import UIGameOver from "../components/sceneGameOver/UIGameOver";

class engineStore {
    // Коли міняємо сцену в грі, міняємо і UI інтерфейс для сцени також
    // Данна система дозволить створювати інтерфейси і через Фазер, і через реакт :)

    constructor() {
        this.game/* : PhaserGame | null */ = null;
        this.uiCurrent /* : sceneName */ = 'sceneMenu';
        this.uiScenes = {
            sceneMenu: <UIMenu />,
            sceneGame: <UIGame />,
            sceneGameOver: <UIGameOver />,
        };
        this.difficultMode = 0; // 0 or 1
        this.cards = 8;
        this.random = 1;

        //user temp stats
        this.userPlayTIme = 0;
        this.userMoves = 0;
        this.userScores = 0;
        this.userShuffles = 2;


        makeObservable(this, {
            uiCurrent: observable,
            userPlayTIme: observable,
            difficultMode: observable,
            setUI: action,
            update: action,
            setDifficult: action,
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
    undoMove() {
        if (this.uiCurrent !== 'sceneGame') return;

        let scene = this.game.scene.getScene('sceneGame');
        scene.UndoMove();
    }
    shuffleLastCards() {
        // 3 колонки карт остані перемішуємо якщо в тупику юзер.
        if (this.uiCurrent !== 'sceneGame' || this.userShuffles < 1) return;

        let scene = this.game.scene.getScene('sceneGame');
        scene.RefreshLastCards()
        this.userShuffles -= 1;
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
        this.userShuffles = 2;
    }

    addMoves() {
        this.userMoves += 1;
    }

    addScores() {
        this.userScores += 100;
    }
}
export default new engineStore()