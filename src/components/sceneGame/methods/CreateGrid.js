export function CreateGrid() {
    const cols = this.columns;
    const rows = 4;

    const spacingX = 75;
    const spacingY = 105;

    const fieldWidth = (cols - 1) * spacingX;
    const fieldHeight = (rows - 1) * spacingY;

    const startX = this.sys.game.config.width / 2 - fieldWidth / 2;
    const startY = this.sys.game.config.height / 2 - fieldHeight / 2;

    // тут проста сітка для карт, щоб розміщувати їх нормально на полі,а заодно підсказки показати
    this.grid = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = startX + col * spacingX;
            const y = startY + row * spacingY;

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
                }).setOrigin(0.5)
            });


            this.add.rectangle(x, y, this.cardWidth, this.cardHeight)
                .setStrokeStyle(1, 0x00ff00)
                .setOrigin(0.5);
        }
    }
}