import engineStore from "../../../store/engineStore";
import userStore from "../../../store/userStore";

export function RenderUserFrame(button, scale) {
    const userX = button.x;
    const userY = button.y - 50;

    const frame = this.add.sprite(0, 0, 'common1', 'ava_user_frame')
        .setOrigin(0.5)
        .setScale(0.75 * scale);

    const avatar = this.add.image(0, 0, userStore.userImg)
        .setOrigin(0.5)
        .setScale(0.7 * scale);

    this.userContainer = this.add.container(userX, userY, [frame, avatar]);

    // Сохраняем анимацию покачивания для управления
    this.userContainer._floatTween = this.tweens.add({
        targets: this.userContainer,
        y: userY - 5,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
}

export function RenderUserFrameMove(button) {
    const targetX = button.x;
    const targetY = button.y - 50;

    // Останавливаем старую покачивающую анимацию
    if (this.userContainer._floatTween) {
        this.userContainer._floatTween.stop();
    }

    this.tweens.add({
        targets: this.userContainer,
        x: targetX,
        y: targetY,
        duration: 500,
        ease: 'Sine.easeInOut',
        onComplete: () => {
            engineStore.targetId = null;

            // Запускаем новую анимацию покачивания на новой позиции
            this.userContainer._floatTween = this.tweens.add({
                targets: this.userContainer,
                y: targetY - 5,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    });
}
