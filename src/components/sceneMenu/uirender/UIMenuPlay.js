import { gameMap } from "../../../content/gameMap";
import botsStore from "../../../store/botsStore";
import engineStore from "../../../store/engineStore";

export function UIMenuPlay() {
    const { width, height } = this.sys.game.config;
    let posX = width / 2;
    let posY = botsStore.currentRound !== 0 ? height + 100 : height - 50;

    const buttPlay = this.add.image(0, 0, 'bot_panel').setScale(0.7).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const textPlay = this.add.text(
        0, 0,
        'PLAY',
        {
            fontSize: `40px`,
            color: 'black',
            fontFamily: 'monospace'
        }
    ).setOrigin(0.5)

    this.ui.UIMenuPlay = this.add.container(posX, posY, [buttPlay, textPlay])

    buttPlay.on('pointerdown', () => {
        let lvlPlay = gameMap[engineStore.levelsFinished.length];

        engineStore.setDifficult(lvlPlay.cards, lvlPlay.random, lvlPlay.id);
        botsStore.initNextRound();
        this.UIMenuDialogWaitingShow(true)
        this.UIMenuPlayShow(false);
    })
}

export function UIMenuPlayShow(show) {
    const { height } = this.sys.game.config;
    const container = this.ui.UIMenuPlay;

    if (show) {
        // Показать — сдвинуть в центр экрана (по Y)
        this.tweens.add({
            targets: container,
            y: height - 50,
            duration: 300,
            ease: 'Cubic.easeOut',
        });
    } else {
        // Скрыть — сдвинуть вниз за экран
        this.tweens.add({
            targets: container,
            y: height + 100,
            duration: 300,
            ease: 'Cubic.easeIn',
        });
    }

}