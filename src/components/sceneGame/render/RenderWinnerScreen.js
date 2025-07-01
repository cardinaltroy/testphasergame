
export function RenderWinnerScreen(winner, round) {
    const { width, height } = this.sys.game.config;
    const isBot = winner.isBot;

    // Фон
    const background = this.add.rectangle(width / 2, height / 2, width, height, 0x000000)
        .setDepth(1000)
        .setAlpha(0);
    // Анимация появления фона
    this.tweens.add({
        targets: background,
        alpha: 0.5,
        duration: 400,
        ease: 'Linear'
    });
    // победил игрок и это был последний раунд
    if (!isBot && round === 0) {
        // Загрузка изображения кубка из атласа
        const cup = this.add.sprite(width / 2, -200, 'common1', 'wind_win1').setOrigin(0.5).setDepth(1002).setAlpha(0);

        // Текст, сообщающий, что победил игрок
        const playerWinText = this.add.text(width / 2, height + 50, `Player ${winner.name} won the tournament!`, {
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setDepth(1003).setAlpha(0).setScale(0.8);

        // Анимация появления кубка сверху (приближается к центру)
        this.tweens.add({
            targets: cup,
            y: height / 2 - 200, // Центр по вертикали
            alpha: 1,
            duration: 700,
            ease: 'Bounce.Out',
            delay: 500 // Задержка, чтобы анимация была после появления фона и текста
        });

        // Анимация текста победителя снизу (приближается с нижней части экрана)
        this.tweens.add({
            targets: playerWinText,
            y: height / 2 + 100,
            alpha: 1,
            duration: 700,
            ease: 'Bounce.Out',
            delay: 700 // Задержка для синхронизации с кубком
        });
    } else {
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


}
