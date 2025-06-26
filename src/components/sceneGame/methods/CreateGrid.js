export function CreateGrid() {
    const cols = this.columns;
    const rows = 4;
    const scale = 1.2;
    const spacingX = 75*scale;
    const spacingY = 105*scale;

    const fieldWidth = (cols - 1) * spacingX;
    const fieldHeight = (rows - 1) * spacingY;

    const startX = this.sys.game.config.width / 2 - fieldWidth / 2;
    const startY = this.sys.game.config.height / 2 - fieldHeight / 2;

    this.grid = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = startX + col * spacingX;
            const y = startY + row * spacingY;

            // Создаём спрайт ячейки
            const placeSprite = this.add.image(x, y, 'card_place')
                .setOrigin(0.5)
                .setScale(0.7*scale)

            // Можно добавить интерактивность, если нужно, например:
            // placeSprite.setInteractive();

            this.grid.push({
                col,
                row,
                x,
                y,
                occupied: false,
                card: null,
                hint: this.add.text(x, y, '', {
                    fontSize: '18px',
                    color: '#ffffff',
                    fontFamily: 'monospace'
                }).setOrigin(0.5),
                placeSprite // сохраняем ссылку на спрайт ячейки, если нужно будет работать с ним позже
            });
        }
    }
}
