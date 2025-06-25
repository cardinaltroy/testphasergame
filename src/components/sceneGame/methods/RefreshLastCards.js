import Phaser from 'phaser';

export function RefreshLastCards() {
    const reshuffleCols = this.difficultMode === 0 ? 3 : 5; // 3 или 5 колонок

    const targetCols = [];
    for (let i = this.columns - reshuffleCols; i < this.columns; i++) {
        targetCols.push(i);
    }

    const targetCells = this.grid.filter(c => targetCols.includes(c.col));

    // Карты которые можно перемешивать = только разблокированные
    const cardsToReshuffle = targetCells
        .filter(c => c.card && !c.card.getData('locked'))
        .map(c => c.card);

    if (cardsToReshuffle.length === 0) return;

    // Обнуляем только те слоты, где карты НЕ заблокированы (чтобы не трогать заблокированные)
    for (const cell of targetCells) {
        if (cell.card && !cell.card.getData('locked')) {
            cell.card = null;
            cell.occupied = false;
        }
    }

    Phaser.Utils.Array.Shuffle(cardsToReshuffle);

    // Пустые клетки = те, где нет карты или карта заблокирована (занятые клетки с locked === true считаем занятыми!)
    // Поэтому берем только те клетки, которые не заняты (occupied === false)
    const emptyCells = targetCells.filter(c => !c.occupied);
    Phaser.Utils.Array.Shuffle(emptyCells);

    // Размещаем перемешанные карты в пустые клетки
    for (let i = 0; i < cardsToReshuffle.length && i < emptyCells.length; i++) {
        const card = cardsToReshuffle[i];
        const cell = emptyCells[i];

        card.x = cell.x;
        card.y = cell.y;

        card.setData('cell', cell);
        card.setData('originalX', cell.x);
        card.setData('originalY', cell.y);

        cell.card = card;
        cell.occupied = true;
    }

    this.UpdateCellHints();
    this.lastMove = null;

    // --- ЭФФЕКТ СНЯТИЯ ДЕНЕГ ---
    const centerX = this.cameras.main.centerX + 20;
    const bottomY = this.cameras.main.height - 50;

    const text = this.add.text(centerX, bottomY, '-50', {
        font: '32px Arial',
        fill: '#ff4d4d',
        stroke: '#000',
        strokeThickness: 4,
    }).setOrigin(0.5).setDepth(100);

    const icon = this.add.image(centerX - 50, bottomY, 'cash')
        .setScale(0.5)
        .setOrigin(0.5)
        .setDepth(100);

    this.tweens.add({
        targets: [text, icon],
        y: bottomY - 100,
        alpha: 0,
        duration: 1000,
        ease: 'cubic.out',
        onComplete: () => {
            text.destroy();
            icon.destroy();
        }
    });
}
