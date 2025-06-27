export function RenderEffectMinusCash(scene, cash = 0) {
    const centerX = scene.cameras.main.centerX + 20;
    const bottomY = scene.cameras.main.height - 50;

    const text = scene.add.text(centerX, bottomY, `-${cash}`, {
        font: '32px Arial',
        fill: '#ff4d4d',
        stroke: '#000',
        strokeThickness: 4,
    }).setOrigin(0.5).setDepth(100);

    const icon = scene.add.image(centerX - 50, bottomY, 'cash')
        .setScale(0.5)
        .setOrigin(0.5)
        .setDepth(100);

    scene.tweens.add({
        targets: [text, icon],
        y: bottomY - 100,
        alpha: 0,
        duration: 1000,
        ease: 'cubic.out',
        onComplete: () => {
            text.destroy();
            icon.destroy();
        }
    });
}