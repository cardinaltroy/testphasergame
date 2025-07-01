import Phaser from 'phaser';

export function EffectShuffleArrow() {
    const { width, height } = this.sys.game.config;
    const scale = this.UtilsGridScale()
    let panelX = width / 2;
    let panelY = height - 35 * scale;


    // Рисуем стрелку в центре экрана, если её нет
    this.arrowHint = this.add.image(panelX + 140 * scale, panelY - 70 * scale, 'arrow')
        .setOrigin(0.5)
        .setScale(0.7)
        .setAlpha(1)// Стартовая альфа - полная видимость
        .setRotation(Phaser.Math.DegToRad(-90))
        .setDepth(100);

    // Анимация мигания стрелки
    this.tweens.add({
        targets: this.arrowHint,
        alpha: { from: 1, to: 0 }, // Прозрачность от 1 до 0
        duration: 500, // Период мигания
        yoyo: true,  // Возврат
        repeat: -1,  // Бесконечный повтор
        ease: 'Sine.easeInOut'
    });
}