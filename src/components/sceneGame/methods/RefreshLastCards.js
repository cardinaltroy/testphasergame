import Phaser from 'phaser';

export function RefreshLastCards() {
    // Перемішати карти якщо в не осталось ходів
    const reshuffleCols = this.difficultMode === 0 ? 3 : 5; // 3 або 5 колонок будемо перемішувати

    // сюди всі карти напушимо які будемо перемішувати
    const targetCols = []; 
    for (let i = this.columns - reshuffleCols; i < this.columns; i++) {
        targetCols.push(i);
    }

    // слоти
    const targetCells = this.grid.filter(c => targetCols.includes(c.col));

    // карти
    const cardsToReshuffle = targetCells
        .filter(c => c.card)
        .map(c => c.card);

    if (cardsToReshuffle.length === 0) return;

    // обнуляємо слоти
    for (const cell of targetCells) {
        if (cell.card) {
            cell.card = null;
        }
        cell.occupied = false;
    }

    // мішаємо карти і слоти під них
    Phaser.Utils.Array.Shuffle(cardsToReshuffle);
    const emptyCells = targetCells.filter(c => !c.occupied);
    Phaser.Utils.Array.Shuffle(emptyCells); 

    // Виставляємо карти
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

    // Також оновлємо підсказки і обнулити lastMove для корректної роботи кнопки "UNDO"
    this.UpdateCellHints();
    this.lastMove = null;
}
