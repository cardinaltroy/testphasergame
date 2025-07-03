import { gameMap } from "../../../content/gameMap";
import botsStore from "../../../store/botsStore";
import engineStore from "../../../store/engineStore";

export function RenderUserLevels() {
    // Коэффициент сдвига карты для кнопок (если сдвинули по x, нужно компенсировать)
    const scale = this.background.scale;
    const offsetX = this.background.x;
    const offsetY = 0;
    const buttonScale = this.sys.game.device.os.android || this.sys.game.device.os.iOS ? 0.7 : 1;

    // Отрисовка кнопок уровней
    gameMap.forEach((point, index) => {
        // Основание кнопки
        const button = this.add.image(
            offsetX + point.x * scale,
            offsetY + point.y * scale,
            'menuButton'
        ).setScale(buttonScale).setInteractive({ useHandCursor: true });

        // цветная крышка
        let isFinished = engineStore.levelsFinished[point.id];

        this.add.sprite(
            offsetX + point.x * scale,
            offsetY + (point.y + 3) * scale,
            'common1',
            isFinished ? 'level_item_passed' : 'level_item_forward'
        ).setScale(buttonScale)

        // Добавим текст (название уровня)
        this.add.text(
            button.x,
            button.y - 10,
            point.title,
            {
                fontSize: `${buttonScale * 25}px`,
                color: '#fff',
                fontFamily: 'monospace'
            }
        ).setOrigin(0.5);

        //Запускаем раунд, спавним ботов
        button.on('pointerdown', () => {
            engineStore.setDifficult(point.cards, point.random, point.id);
            botsStore.initNextRound();
            this.UIMenuDialogWaitingShow(true)
        });

        // === Рисуем юзера ===
        let maxLevel = engineStore.levelsFinished.length - 1;
        let target = engineStore.targetId;

        if (target !== null) {// с анимацией
            point.id === maxLevel && this.RenderUserFrame(button, scale);
            point.id === maxLevel + 1 && this.RenderUserFrameMove(button);
        } else {//без анимации
            point.id === maxLevel + 1 && this.RenderUserFrame(button, scale);
        }

    });
}