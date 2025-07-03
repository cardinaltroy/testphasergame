import { gameMap } from "../../../content/gameMap";
import botsStore from "../../../store/botsStore";
import engineStore from "../../../store/engineStore";

export function UIMenuPlay() {
    if(botsStore.currentRound !== 0) return;
    
    const { width, height } = this.sys.game.config;
    const buttPlay = this.add.image(width / 2, height - 50, 'bot_panel').setScale(0.7).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const textPlay = this.add.text(
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
        let lvlPlay = gameMap[engineStore.levelsFinished.length];

        engineStore.setDifficult(lvlPlay.cards, lvlPlay.random, lvlPlay.id);
        botsStore.initNextRound();
        this.UIMenuDialogWaitingShow(true)

        this.tweens.add({
            targets: [buttPlay, textPlay],
            y: height + 100, // Улетает вниз за экран
            duration: 400,
            ease: 'Cubic.easeIn',

            onComplete: () => {
                // уничтожаем
                buttPlay.destroy();
                textPlay.destroy();
            }
        });
    })
}