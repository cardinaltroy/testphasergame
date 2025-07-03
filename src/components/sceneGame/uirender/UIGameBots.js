import botsStore from "../../../store/botsStore";
import engineStore from "../../../store/engineStore";
import userStore from "../../../store/userStore";

export function UIGameBots() {
    const { width } = this.sys.game.config;
    const bots = botsStore.getCurrentBots;
    const scale = this.UtilsGridScale();
    const panelSpacing = 10;
    const panelWidth = 200 * scale;
    const panelHeight = 65 * scale;
    const startY = 35 * scale;

    this.ui.UIGameBotsContainers = [];

    const createContainer = (name, imgKey, finishedCards) => {
        const panel = this.add.image(0, 0, 'bot_panel')
            .setOrigin(0, 0.5)
            .setDepth(500)
            .setDisplaySize(panelWidth, panelHeight);

        const avatar = this.add.image(10, 0, imgKey)
            .setOrigin(0, 0.5)
            .setScale(0.6 * scale)
            .setDepth(501);

        const nameText = this.add.text(panelWidth / 2, -15, name, {
            fontSize: `${18 * scale}px`,
            color: 'black',
            fontFamily: 'Arial'
        })
            .setOrigin(0, 0.5)
            .setDepth(501);

        const cardsImg = this.add.image(70 * scale, 10, 'bot_cards')
            .setOrigin(0, 0.5)
            .setScale(0.4 * scale)
            .setDepth(501);

        const cardsText = this.add.text(120 * scale, 10, `${finishedCards}/${engineStore.cards * 4}`, {
            fontSize: `${20 * scale}px`,
            color: 'black',
            fontFamily: 'Arial'
        })
            .setOrigin(0, 0.5)
            .setDepth(501);

        const container = this.add.container(0, startY, [panel, avatar, nameText, cardsImg, cardsText]);
        container.cardsFinished = finishedCards;
        return { container, cardsText };
    };

    // Игрок
    const player = bots[0];
    const { container: userContainer, cardsText: userCardsText } = createContainer("PLAYER", userStore.userImg, this.GetCompletedCard());
    this.uiGameBotsUser = userCardsText;
    this.ui.UIGameBotsContainers.push(userContainer);

    // Боты
    bots.forEach(bot => {
        const { container, cardsText } = createContainer(bot.name, `bot_${bot.img}`, bot.cardsFinished);
        bot.textCars = cardsText;
        container.cardsFinished = bot.cardsFinished;
        this.ui.UIGameBotsContainers.push(container);
    });

    this.UIGameBotsUpdate(); // сразу выравниваем
}


export function UIGameBotsUpdate() {
    const { width } = this.sys.game.config;
    const scale = this.UtilsGridScale();
    const panelSpacing = 10;
    const panelWidth = 200 * scale;
    const total = this.ui.UIGameBotsContainers.length;

    // Сортировка по количеству собранных карт (X из "X/Y")
    const parseCards = (container) => {
        const textObj = container.list.find(child => child?.style && child.text?.includes('/'));
        return textObj ? parseInt(textObj.text.split('/')[0]) : 0;
    };

    this.ui.UIGameBotsContainers.sort((a, b) => parseCards(b) - parseCards(a));

    // Центрируем панели
    const totalWidth = total * panelWidth + (total - 1) * panelSpacing;
    const startX = width / 2 - totalWidth / 2;

    // Получаем общее Y (все панели на одной высоте)
    const y = 35 * scale;

    // Распределение по X
    this.ui.UIGameBotsContainers.forEach((container, index) => {
        const targetX = startX + index * (panelWidth + panelSpacing);

        this.tweens.add({
            targets: container,
            x: targetX,
            y: y,
            duration: 300,
            ease: 'Sine.easeInOut'
        });
    });
}
