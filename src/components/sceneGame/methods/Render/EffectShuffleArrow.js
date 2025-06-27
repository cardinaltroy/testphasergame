import Phaser from 'phaser';

export function EffectShuffleArrow(scene) {
    let posX = scene.cameras.main.centerX + 50;
    let posY = scene.cameras.main.height - 90;

    // Рисуем стрелку в центре экрана, если её нет
    scene.arrow = scene.add.image(posX, posY, 'arrow')
        .setOrigin(0.5)
        .setScale(0.7)
        .setAlpha(1)// Стартовая альфа - полная видимость
        .setRotation(Phaser.Math.DegToRad(-90))
        .setDepth(100);

    // Анимация мигания стрелки
    scene.tweens.add({
        targets: scene.arrow,
        alpha: { from: 1, to: 0 }, // Прозрачность от 1 до 0
        duration: 500, // Период мигания
        yoyo: true,  // Возврат
        repeat: -1,  // Бесконечный повтор
        ease: 'Sine.easeInOut'
    });
}