import engineStore from "../../../store/engineStore";

export function EffectMinusCash(cash, posX = this.cameras.main.width / 2, posY = this.cameras.main.height - 50) {
    this.UIGameFooterUpdate();

    const text = this.add.text(posX, posY, `-${cash}`, {
        font: '32px Arial',
        fill: '#ff4d4d',
        stroke: '#000',
        strokeThickness: 4,
    }).setOrigin(0.5).setDepth(100);

    const icon = this.add.image(posX - 50, posY, 'cash')
        .setScale(0.5)
        .setOrigin(0.5)
        .setDepth(100);

    this.tweens.add({
        targets: [text, icon],
        y: posY - 100,
        alpha: 0,
        duration: 1000,
        ease: 'cubic.out',
        onComplete: () => {
            text.destroy();
            icon.destroy();
        }
    });
}