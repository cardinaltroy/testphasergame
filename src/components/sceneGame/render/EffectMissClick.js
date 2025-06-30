export function EffectMissClick(scene, pointer) {
    const cross = scene.add.image(pointer.x, pointer.y, 'icon_x')
        .setOrigin(0.5)
        .setScale(0.5);

    // Мигающий эффект: меняем прозрачность крестика
    scene.tweens.add({
        targets: cross,
        alpha: { from: 1, to: 0 },
        duration: 500,
        repeat: -1,  // Бесконечное мигание
        yoyo: true,
    });

    // Удаляем крестик после 2 секунд
    scene.time.delayedCall(500, () => {
        cross.destroy();
    });
}