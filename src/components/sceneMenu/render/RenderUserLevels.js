import { gameMap } from "../../../content/gameMap";
import engineStore from "../../../store/engineStore";

export function RenderUserLevels() {
    // Коэффициент сдвига карты для кнопок (если сдвинули по x, нужно компенсировать)
    const scale = this.background.scale;
    const offsetX = this.background.x;
    const offsetY = 0;
    const buttonScale = this.UtilsGridScale()*0.85

    // Отрисовка кнопок уровней
    gameMap.forEach((point, index) => {
        let isFinished = engineStore.levelsFinished[point.id] === 3;

        // Основание кнопки
        const button = this.add.image(
            offsetX + point.x * scale,
            offsetY + point.y * scale,
            'menuButton'
        )
            .setScale(buttonScale)
            .setInteractive({ useHandCursor: true });


        // цветная крышка
        this.add.sprite(
            offsetX + point.x * scale,
            offsetY + (point.y + 3) * scale,
            'common1',
            isFinished ? 'level_item_passed' : 'level_item_forward'
        )
            .setScale(buttonScale)

        // название уровня
        this.add.text(
            button.x,
            button.y - 10,
            point.title,
            {
                fontSize: `${buttonScale * 25}px`,
                color: '#fff',
                fontFamily: 'monospace'
            }
        )
            .setOrigin(0.5);

        // принудительный запуск уровня
        button.on('pointerdown', () => this.start(point.id));

        // === Рисуем юзера ===
        // ищем последний пройденый уровень на 3 звезды
        let lastDrawPoint = engineStore.levelsFinished.lastIndexOf(3);
        //мы перешли на новый уровень а значит запустим анимацию
        let target = engineStore.targetId;

        if (target !== null) {// с анимацией
            console.log(lastDrawPoint, target)
            point.id === lastDrawPoint && this.RenderUserFrame(button, scale);
            point.id === lastDrawPoint + 1 && this.RenderUserFrameMove(button);
        } else {//без анимации
            point.id === lastDrawPoint + 1 && this.RenderUserFrame(button, scale);
        }
    });
}