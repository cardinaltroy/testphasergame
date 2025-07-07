import botsStore from "../../../store/botsStore";
import engineStore from "../../../store/engineStore";
import userStore from "../../../store/userStore";

export function UIMenuDialogWaiting() {
    const { width, height } = this.sys.game.config;
    const scale = 1.2;
    const contWidth = (width / 2) * scale;
    const contHeight = (height / 2) * scale;
    const startX = width / 2;

    const background = this.add.sprite(0, 0, 'common2', 'money_box_panel')
        .setDisplaySize(contWidth, contHeight)
        .setOrigin(0.5)
        .setInteractive();



    const title = this.add.text(0, 35 * scale - contHeight / 2, 'WAITING OTHERS...', {
        fontSize: `${30 * scale}px`, color: 'black', fontFamily: 'monospace',
    }).setOrigin(0.5);



    // так надо :)
    let rnd = botsStore.currentRound === 0 ? 1 : botsStore.currentRound;

    const titleRound = this.add.text(0, 70 * scale - contHeight / 2, `Round: ${rnd}`, {
        fontSize: `${20 * scale}px`, color: 'grey', fontFamily: 'monospace',
    }).setOrigin(0.5);

    const buttonClose = this.add.sprite(contWidth / 2 - 15 * scale, -contHeight / 2 + 10 * scale, 'common1', 'icon_close')
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            this.UIMenuDialogWaitingShow(false)
            botsStore.clearAll();
        })

    // Пустой контейнер
    this.ui.UIMenuDialogWaiting = this.add.container(startX, height + contHeight, [
        background, title, titleRound, buttonClose
    ]).setDepth(1000);

    if (botsStore.currentRound !== 0) this.UIMenuDialogWaitingShow(true)
}

//вызываем только здесь поэтому без экспорта и через scene
function UIMenuDialogWaitingBots(scene) {
    const container = scene.ui.UIMenuDialogWaiting;
    const background = container.list[0];
    const { width } = scene.sys.game.config;
    const scale = scene.UtilsGridScale();
    const user = userStore.dataGet;

    const bots = [user, ...botsStore.bots, ]; //...botsStore.losers - если надо рендерить и проигравших
    const contWidth = background.displayWidth;
    const padding = 5 * scale;
    const avatarAreaWidth = contWidth * 0.9;
    const avatarSize = (avatarAreaWidth - 3 * padding) / 4 * 0.7;

    const startYAvatars = 20;
    const totalWidth = bots.length * avatarSize + (bots.length - 1) * padding;
    const startXAvatars = -totalWidth / 2 + avatarSize / 2;

    let index = 0;

    let timer = scene.time.addEvent({
        delay: 1000,               // Интервал в мс
        repeat: bots.length - 1,  // повторить (N - 1) раз
        callback: () => {
            if (!botsStore.bots.length) return timer.remove();
            const bot = bots[index];
            const x = startXAvatars + index * (avatarSize + padding);
            const y = startYAvatars;

            const frame = scene.add.sprite(x, y, 'common1', 'ava_user_frame')
                .setDisplaySize(avatarSize, avatarSize)
                .setOrigin(0.5);

            const image = scene.add.image(x, y, bot.isBot ? `bot_${bot.img}` : bot.img)
                .setDisplaySize(avatarSize * 0.8, avatarSize * 0.8)
                .setOrigin(0.5);

            if (bot.loser) {
                image.setTint(0x888888);
                frame.setTint(0x000000);
            }

            const name = scene.add.text(x, y + avatarSize / 2 + 10, bot.name || 'BOT', {
                fontSize: `${16 * scale}px`, color: 'black', fontFamily: 'monospace',
            }).setOrigin(0.5, 0);

            container.add([frame, image, name]);

            //START TOURNAMENT
            if (index === bots.length - 1) scene.time.delayedCall(1000, () => {
                engineStore.setScene('sceneGame');
                engineStore.userDrop();
            })

            index++;
        }
    });
}

export function UIMenuDialogWaitingShow(show) {
    const { height } = this.sys.game.config;
    const dialog = this.ui.UIMenuDialogWaiting;
    const contHeight = dialog.list[0].displayHeight;

    if (show) {
        botsStore.setPause(false)

        this.tweens.add({
            targets: dialog,
            y: height / 2,
            duration: 300,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                UIMenuDialogWaitingBots(this); //рисуем ботов после появления меню
            }
        });
    } else {
        this.tweens.add({
            targets: dialog,
            y: height + contHeight,
            duration: 300,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                // пересоздадим конт весь что бы сброить нарисованых ботов
                this.UIMenuPlayShow(true)
                this.ui.UIMenuDialogWaiting.destroy(true);
                this.UIMenuDialogWaiting();
            }
        });
    }
}