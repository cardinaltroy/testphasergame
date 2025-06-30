import Phaser from 'phaser';

export function EffectShuffleArrow(scene) {
    let posX = scene.cameras.main.centerX + 100;
    let posY = scene.cameras.main.height - 90;

    // Рисуем стрелку в центре экрана, если её нет
    scene.arrowHint = scene.add.image(posX, posY, 'arrow')
        .setOrigin(0.5)
        .setScale(0.7)
        .setAlpha(1)// Стартовая альфа - полная видимость
        .setRotation(Phaser.Math.DegToRad(-90))
        .setDepth(100);

    // Анимация мигания стрелки
    scene.tweens.add({
        targets: scene.arrowHint,
        alpha: { from: 1, to: 0 }, // Прозрачность от 1 до 0
        duration: 500, // Период мигания
        yoyo: true,  // Возврат
        repeat: -1,  // Бесконечный повтор
        ease: 'Sine.easeInOut'
    });
}