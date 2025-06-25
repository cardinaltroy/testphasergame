import engineStore from "../../../store/engineStore";
import Phaser from 'phaser';

export function UserValidMove(pointer, card, nearest, oldCell) {
    //Проверяем бесплатные монетки
    if (engineStore.isCanDropMoney()) {
        const screenWidth = this.scale.width;
        const screenHeight = this.scale.height;

        const targetX = Phaser.Math.Between(0, 1) === 0 ? 60 : screenWidth - 60;
        const targetY = screenHeight - 60;

        // Создаём объекты
        const coin = this.add.image(0, 0, 'cash').setScale(0.6);
        const glow = this.add.image(0, 0, 'glow').setScale(5).setAlpha(0.7);

        // Объединяем в контейнер
        const container = this.add.container(nearest.x, nearest.y + 70, [glow, coin])
            .setDepth(20)
            .setSize(coin.width, coin.height)
            .setInteractive({ useHandCursor: true });

        // Анимация свечения внутри контейнера (не влияет на позицию контейнера)
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



        let alreadyFlying = false;

        const flyCoinAway = () => {
            if (alreadyFlying) return;
            alreadyFlying = true;

            destroyTimer.remove();
            container.disableInteractive();

            this.tweens.add({
                targets: container,
                y: -50,
                x: this.scale.width * 0.75 - 20,
                scaleX: 0.3,
                scaleY: 0.3,
                alpha: 0.5,
                ease: 'sine.in',
                duration: 500,
                onComplete: () => {
                    container.destroy();
                    engineStore.addCash(5);
                }
            });
        };
        // Клик/ховер по контейнеру
        container.on('pointerdown', flyCoinAway);
        container.on('pointerover', (pointer) => {
            flyCoinAway();
        });

    }

    // Создаём эффект частиц в точке отпускания
    this.UtilsSpawnEffects(pointer, 'sparkGreen', 1.2);

    this.sound.play('drag');
    this.tweens.add({
        targets: card,
        scaleX: 1.1,
        scaleY: 1.1,
        yoyo: true,
        duration: 100,
        ease: 'Power2'
    });

    this.lastMove = {
        card: card,
        oldX: card.getData('originalX'),
        oldY: card.getData('originalY'),
        oldCell: card.getData('cell'),
        nearest: nearest,
    };

    oldCell.occupied = false;
    oldCell.card = null;

    card.x = nearest.x;
    card.y = nearest.y;
    card.setData('cell', nearest);
    card.setData('originalX', nearest.x);
    card.setData('originalY', nearest.y);

    nearest.occupied = true;
    nearest.card = card;

    engineStore.addMoves();
    engineStore.addScores();
    this.UpdateCellHints();
    this.CheckFinishedLines();
}