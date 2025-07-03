import Phaser from 'phaser';
import engineStore from '../../../store/engineStore';

export function EffectFreeCash(nearest) {
    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;

    const targetX = Phaser.Math.Between(0, 1) === 0 ? 60 : screenWidth - 60;
    const targetY = nearest.y + 50;

    // Создаём объекты
    const coin = this.add.image(0, 0, 'cash').setScale(1.6);
    const glow = this.add.image(0, 0, 'glow').setScale(5).setAlpha(0.7);

    // Объединяем в контейнер
    const container = this.add.container(nearest.x, nearest.y + 100, [glow, coin])
        .setDepth(501)
        .setSize(coin.width, coin.height)
        .setInteractive({ useHandCursor: true });

    // Анимация свечения внутри контейнера 
    this.tweens.add({
        targets: glow,
        alpha: { from: 0.4, to: 0.9 },
        scale: { from: 1.2, to: 1.6 },
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
    });

    // Анимация падения контейнера
    this.tweens.add({
        targets: container,
        x: targetX,
        y: targetY,
        scaleX: 0.4,
        scaleY: 0.4,
        angle: Phaser.Math.Between(-180, 180),
        ease: 'cubic.out',
        duration: 1000
    });

    // Удалить через 10 сек
    const destroyTimer = this.time.delayedCall(10000, () => {
        container.destroy();
    });


    //Второй этап анимации, когда ловим монетку
    let alreadyFlying = false;

    const flyCoinAway = () => {
        if (alreadyFlying) return;
        alreadyFlying = true;

        const { width, height } = this.sys.game.config;
        const scale = this.UtilsGridScale()
        let panelX = width / 2;
        let panelY = height - 35 * scale;
        destroyTimer.remove();
        container.disableInteractive();

        //улетаем к нашему UI где находяться монетки/алмазы
        this.tweens.add({
            targets: container,
            x: panelX - 170 * scale,
            y: panelY,
            scaleX: 0.3,
            scaleY: 0.3,
            alpha: 0.5,
            ease: 'sine.in',
            duration: 500,
            onComplete: () => {
                container.destroy();
                engineStore.addCash(5);
                this.UIGameFooterUpdate();
                this.EffectCardsParticles({ x: panelX - 170 * scale, y: panelY, }, 'sparkRed', 1.2);
            }
        });
    };
    // Клик/ховер по контейнеру
    container.on('pointerdown', flyCoinAway);
    container.on('pointerover', flyCoinAway);

}