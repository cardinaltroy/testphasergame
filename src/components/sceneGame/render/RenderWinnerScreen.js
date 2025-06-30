export function RenderWinnerScreen(winner) {
    const { width, height } = this.sys.game.config;

    // Фон 
    const background = this.add.rectangle(width / 2, height / 2, width, height, 0x000000)
        .setDepth(1000)
        .setAlpha(0);

    // Текст победителя
    const winnerTitle = this.add.text(width / 2, height / 2 - 75, `Player ${winner.name}`, {
        fontSize: '36px',
        fontFamily: 'Arial',
        color: '#ffffff',
        align: 'center'
    }).setOrigin(0.5).setDepth(1001).setAlpha(0).setScale(0.8);

    const winnerText = this.add.text(width / 2, height / 2 + 25, `was the first to collect solitaire`, {
        fontSize: '36px',
        fontFamily: 'Arial',
        color: '#ffffff',
        align: 'center'
    }).setOrigin(0.5).setDepth(1001).setAlpha(0).setScale(0.8);

    // Анимация появления фона
    this.tweens.add({
        targets: background,
        alpha: 0.5,
        duration: 400,
        ease: 'Linear'
    });

    // Анимация появления текста с увеличением
    this.tweens.add({
        targets: [winnerTitle, winnerText],
        alpha: 1,
        scale: 1,
        duration: 500,
        ease: 'Back.Out',
        delay: 200
    });
}
