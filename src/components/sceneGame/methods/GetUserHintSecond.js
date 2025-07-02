import Phaser from 'phaser';

export function GetUserHintSecond() {
    if (this.arrowHint && this.arrowHint.targetCell) {
        const scale = this.UtilsGridScale();

        const cellSprite = this.arrowHint.targetCell.placeSprite;
        const targetX = cellSprite.x + (cellSprite.displayWidth / 4);
        const targetY = cellSprite.y - 10 - (cellSprite.displayHeight / 2);

        // Если уже идет tween по стрелке — отменим, чтобы не конфликтовать
        if (this.arrowHint.moveTween) {
            this.arrowHint.moveTween.stop();
        }
        this.children.bringToTop(this.arrowHint);
        // Создаем плавный tween для перемещения стрелки к целевой позиции
        this.arrowHint.moveTween = this.tweens.add({
            targets: this.arrowHint,
            x: targetX,
            y: targetY,
            duration: 500,
            ease: 'Sine.easeInOut'
        });
    }
}
