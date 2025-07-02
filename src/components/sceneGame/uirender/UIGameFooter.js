import botsStore from "../../../store/botsStore";
import engineStore from "../../../store/engineStore";

export function UIGameFooter() {
    const { width, height } = this.sys.game.config;
    const scale = this.UtilsGridScale()
    let panelX = width / 2;
    let panelY = height - 35 * scale;

    // Панель
    this.add.sprite(width / 2, height, 'common1', 'panel7')
        .setOrigin(0.5, 1)
        .setDepth(500)
        .setScale(1.5 * scale, scale)



    // Меню
    this.add.sprite(panelX - 280 * scale, panelY, 'common1', 'but_options3')
        .setOrigin(0.5)
        .setDepth(501)
        .setScale(0.7 * scale)

    const menu = this.add.sprite(panelX - 280 * scale, panelY, 'common2', 'game_exit_icon')
        .setOrigin(0.5)
        .setDepth(501)
        .setScale(0.3 * scale)
        .setInteractive({ useHandCursor: true });

    menu.on('pointerdown', () => {
        engineStore.setScene('sceneMenu');
        botsStore.clearAll();
    });

    // Игровая валюта
    this.add.sprite(panelX - 170 * scale, panelY, 'common1', 'diamond_ico_big')
        .setOrigin(0.5)
        .setDepth(501)
        .setScale(0.7 * scale)

    this.uiGameFooterMoney = this.add.text(panelX - 110 * scale, panelY, engineStore.userCash, { fontSize: `${30 * scale}px`, color: '#fff', fontFamily: 'monospace' })
        .setOrigin(0.5)
        .setDepth(501);

    // Подсказка
    this.add.sprite(panelX, panelY, 'common1', 'but_options3')
        .setOrigin(0.5)
        .setDepth(501)
        .setScale(0.7 * scale)
        .setInteractive({ useHandCursor: true });

    const hint = this.add.image(panelX, panelY, 'icon_hint')
        .setOrigin(0.5)
        .setDepth(501)
        .setScale(0.3 * scale)
        .setInteractive({ useHandCursor: true });

    hint.on('pointerdown', () => {
        engineStore.showUserHint();
    });

    // Иконка для подсказки и стоимость
    this.add.sprite(panelX + 40 * scale, panelY + 10 * scale, 'common1', 'diamond_ico_big')
        .setOrigin(0.5)
        .setDepth(502)
        .setScale(0.5 * scale);

    this.add.text(panelX + 70 * scale, panelY + 10 * scale, '25', {
        fontSize: `${20 * scale}px`,
        color: '#fff',
        fontFamily: 'monospace'
    })
        .setOrigin(0.5)
        .setDepth(502);

    // Перемешать
    this.add.sprite(panelX + 140 * scale, panelY, 'common1', 'but_options3')
        .setOrigin(0.5)
        .setDepth(501)
        .setScale(0.7 * scale)
        .setInteractive({ useHandCursor: true });

    const shuffle = this.add.image(panelX + 140 * scale, panelY, 'icon_shuffle')
        .setOrigin(0.5)
        .setDepth(501)
        .setScale(0.3 * scale)
        .setInteractive({ useHandCursor: true });

    shuffle.on('pointerdown', () => {
        engineStore.shuffleLastCards();
    });

    // Иконка для перемешивания и стоимость
    this.add.sprite(panelX + 180 * scale, panelY + 10 * scale, 'common1', 'diamond_ico_big')
        .setOrigin(0.5)
        .setDepth(502)
        .setScale(0.5 * scale);

    this.add.text(panelX + 210 * scale, panelY + 10 * scale, '50', {
        fontSize: `${20 * scale}px`,
        color: '#fff',
        fontFamily: 'monospace'
    })
        .setOrigin(0.5)
        .setDepth(502);

    // Ундо    
    this.add.sprite(panelX + 280 * scale, panelY, 'common1', 'but_options3')
        .setOrigin(0.5)
        .setDepth(501)
        .setScale(0.7 * scale)

    const undo = this.add.sprite(panelX + 280 * scale, panelY, 'common1', 'undo_icon')
        .setOrigin(0.5)
        .setDepth(501)
        .setScale(0.7 * scale)
        .setInteractive({ useHandCursor: true });

    undo.on('pointerdown', () => {
        engineStore.undoMove();
    });
}
