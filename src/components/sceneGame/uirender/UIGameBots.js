import botsStore from "../../../store/botsStore";
import engineStore from "../../../store/engineStore";

export function UIGameBots() {
    const { width, height } = this.sys.game.config;
    const bots = botsStore.getCurrentBots;
    const scale = this.UtilsGridScale() // return 0.75 : 1.2

    // Расстояние между панельками, чтобы они не перекрывались
    const panelSpacing = 10;
    const panelWidth = 200; // Ширина панели
    const panelHeight = 80;
    // Вычисляем позицию начала (центрируем по горизонтали)

    const startX = width / 2 - (bots.length * panelWidth / 2) + ((bots.length - 1) * panelSpacing )/ 2;
    const startY = 40;

    /*console.log(width/2)
    console.log(bots.length * panelWidth / 2)
    console.log((bots.length - 1) * panelSpacing)
    console.log(startX)*/

    // Создаем панели для каждого бота
    bots.forEach((bot, index) => {

        // Позиция каждой панели
        const x = startX + index * (panelWidth + panelSpacing);
        const y = startY;

        // Панель как задний фон
        this.add.image(x, y, 'bot_panel')
            .setOrigin(0.5)
            .setDepth(500)
            .setDisplaySize(panelWidth, panelHeight);

        // Изображение бота
        this.add.image(x - 60, y, `bot_${bot.img}`)
            .setOrigin(0.5)
            .setScale(0.5)
            .setDepth(501)
        // Имя бота
        this.add.text(x, y - 10, bot.name, { fontSize: '16px', color: 'black', fontFamily: 'Arial' })
            .setOrigin(0.25, 0.5)
            .setDepth(501)

        // Количество карт
        bot.textCars = this.add.text(x + 20, y + 10, `${bot.cardsFinished}/${engineStore.cards * 4}`, { fontSize: '14px', color: 'black', fontFamily: 'Arial' })
            .setOrigin(0.5)
            .setDepth(501)

        // Изображение карт
        this.add.image(x - 10, y + 10, 'bot_cards')
            .setOrigin(0.5)
            .setScale(0.2)
            .setDepth(501)
    });
}
