import botsStore from "../../../store/botsStore";
import engineStore from "../../../store/engineStore";

export function UIGameBots() {
    const { width, height } = this.sys.game.config;
    const bots = botsStore.getCurrentBots;
    const scale = this.UtilsGridScale(); // return 0.75 : 1.2

    const panelSpacing = 10;
    const panelWidth = 200 * scale;
    const panelHeight = 65 * scale;

    const totalBots = bots.length;
    const startX = width / 2 - ((totalBots + 1) * panelWidth / 2) - (totalBots * panelSpacing) / 2;
    const startY = 35 * scale;

    // ИГРОК
    const player = bots[0];
    const playerX = startX;
    const playerY = startY;

    this.add.image(playerX, playerY, 'bot_panel')
        .setOrigin(0, 0.5)
        .setDepth(500)
        .setDisplaySize(panelWidth, panelHeight);

    this.add.image(playerX + 10, playerY, `bot_${player.img}`)
        .setOrigin(0, 0.5)
        .setScale(0.6 * scale)
        .setDepth(501);

    this.add.text(playerX + panelWidth / 2, playerY - 15, "PLAYER", {
        fontSize: `${18 * scale}px`,
        color: 'black',
        fontFamily: 'Arial'
    })
        .setOrigin(0, 0.5)
        .setDepth(501);

    this.add.image(playerX + 70 * scale, playerY + 10, 'bot_cards')
        .setOrigin(0, 0.5)
        .setScale(0.4 * scale)
        .setDepth(501);

    player.textCars = this.add.text(playerX + 120 * scale, playerY + 10, `--/${engineStore.cards * 4}`, {
        fontSize: `${20 * scale}px`,
        color: 'black',
        fontFamily: 'Arial'
    })
        .setOrigin(0, 0.5)
        .setDepth(501);

    // Остальные — боты
    bots.forEach((bot, i) => {
        const index = i + 1; // сдвигаем индекс, т.к. игрок уже нарисован первым
        const x = startX + index * (panelWidth + panelSpacing);
        const y = startY;

        this.add.image(x, y, 'bot_panel')
            .setOrigin(0, 0.5)
            .setDepth(500)
            .setDisplaySize(panelWidth, panelHeight);

        this.add.image(x + 10, y, `bot_${bot.img}`)
            .setOrigin(0, 0.5)
            .setScale(0.6 * scale)
            .setDepth(501);

        this.add.text(x + panelWidth / 2, y - 15, bot.name, {
            fontSize: `${18 * scale}px`,
            color: 'black',
            fontFamily: 'Arial'
        })
            .setOrigin(0, 0.5)
            .setDepth(501);

        this.add.image(x + 70 * scale, y + 10, 'bot_cards')
            .setOrigin(0, 0.5)
            .setScale(0.4 * scale)
            .setDepth(501);

        bot.textCars = this.add.text(x + 120 * scale, y + 10, `${bot.cardsFinished}/${engineStore.cards * 4}`, {
            fontSize: `${20 * scale}px`,
            color: 'black',
            fontFamily: 'Arial'
        })
            .setOrigin(0, 0.5)
            .setDepth(501);
    });
}
