import botsStore from "../../../store/botsStore";
import engineStore from "../../../store/engineStore";

export function UIGameDialogExit() {
    const funcYes = () => {
        engineStore.setScene('sceneMenu');
        botsStore.clearAll();
    }

    const funcNo = () => {
        this.UIGameDialogExitShow(false)
    }

    const { width, height } = this.sys.game.config;
    const scale = 1.2; //this.UtilsGridScale();

    const contWidth = (width / 2) * scale;
    const contHeight = (height / 2) * scale;

    const startX = width / 2;
    const startY = height / 2;

    const background = this.add.sprite(0, 0, 'common2', 'money_box_panel')
        .setDisplaySize(contWidth, contHeight)
        .setOrigin(0.5)
        .setInteractive();

    const title = this.add.text(0, -50 * scale, 'Do you really want to exit ? Tournament will be interrupted', {
        fontSize: `${30 * scale}px`,
        color: 'black',
        fontFamily: 'monospace',
        wordWrap: {
            width: contWidth * 0.9,
            useAdvancedWrap: true
        }
    })
        .setOrigin(0.5);

    const buttonYes = this.add.sprite(-100 * scale, 50, 'common1', 'but_blue_down')
        .setOrigin(0.5)
        .setScale(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', funcYes)

    const buttonYesTitle = this.add.text(-100 * scale, 50, 'YES', {
        fontSize: `${30 * scale}px`, color: 'WHITE', fontFamily: 'monospace',
    })
        .setOrigin(0.5)

    const buttonNo = this.add.sprite(100 * scale, 50, 'common1', 'but_blue_out')
        .setOrigin(0.5)
        .setScale(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', funcNo)

    const buttonNoTitle = this.add.text(100 * scale, 50, 'NO', {
        fontSize: `${30 * scale}px`, color: 'black', fontFamily: 'monospace',
    })
        .setOrigin(0.5)

    const buttonClose = this.add.sprite(contWidth / 2 - 15 * scale, -contHeight / 2 + 10 * scale, 'common1', 'icon_close')
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', funcNo)

    // Создаём контейнер внизу за экраном
    this.ui.UIGameDialogExit = this.add.container(startX, height + contHeight, [
        background, title, buttonYes, buttonYesTitle, buttonNo, buttonNoTitle, buttonClose,
    ])
        .setDepth(1000);
}


export function UIGameDialogExitShow(show) { // true - open / false - hidden
    const { height } = this.sys.game.config;
    const dialog = this.ui.UIGameDialogExit;
    const contHeight = dialog.list[0].displayHeight; // берем высоту background

    if (show) {
        // Показать — сдвинуть в центр экрана (по Y)
        this.tweens.add({
            targets: dialog,
            y: height / 2,
            duration: 300,
            ease: 'Cubic.easeOut',
        });
    } else {
        // Скрыть — сдвинуть вниз за экран
        this.tweens.add({
            targets: dialog,
            y: height + contHeight,
            duration: 300,
            ease: 'Cubic.easeIn',
        });
    }
}
