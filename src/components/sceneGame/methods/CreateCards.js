import Phaser from 'phaser';
import engineStore from '../../../store/engineStore';

export function CreateCards() {
    const cardsPerRow = engineStore.cards;
    const totalCols = cardsPerRow + 1;
    const randomPercent = engineStore.random;
    const suits = 4;

    this.cardsData = [];
    this.cards = [];
    this.flyInSprites = [];

    // Генерация всех карт
    for (let suit = 0; suit < suits; suit++) {
        for (let value = 1; value <= cardsPerRow; value++) {
            this.cardsData.push({ suit, value });
        }
    }

    const aces = this.cardsData.filter(c => c.value === 1);
    let others = this.cardsData.filter(c => c.value !== 1);

    // Пустые ячейки в последнем столбце
    const lastColCells = this.grid.filter(c => c.col === totalCols - 1);
    Phaser.Utils.Array.Shuffle(lastColCells);
    const emptyCellCount = Phaser.Math.Between(1, Math.min(4, lastColCells.length));
    const initialEmptyCells = lastColCells.slice(0, emptyCellCount);
    initialEmptyCells.forEach(c => {
        c.occupied = false;
        c.card = null;
    });

    // Подготовка cardsLayout
    this.cardsLayout = [];

    for (let suit = 0; suit < suits; suit++) {
        // Туз
        const ace = aces.find(c => c.suit === suit);
        const aceCell = this.grid.find(c => c.row === suit && c.col === 0);
        this.cardsLayout.push({ cell: aceCell, cardData: ace, x: aceCell.x, y: aceCell.y });

        // Остальные карты
        const rowOthers = others.filter(c => c.suit === suit);
        for (let i = 0; i < rowOthers.length && i < totalCols - 2; i++) {
            const cell = this.grid.find(c => c.row === suit && c.col === i + 1);
            this.cardsLayout.push({ cell, cardData: rowOthers[i], x: cell.x, y: cell.y });
        }

        // Последняя ячейка
        const endCell = this.grid.find(c => c.row === suit && c.col === totalCols - 1);
        if (initialEmptyCells.includes(endCell)) {
            this.cardsLayout.push({ cell: endCell, cardData: null, x: endCell.x, y: endCell.y });
        } else {
            const extraCard = others.find(c => c.suit === suit && !this.cardsLayout.some(l => l.cardData === c));
            this.cardsLayout.push({ cell: endCell, cardData: extraCard || null, x: endCell.x, y: endCell.y });
        }
    }

    // Перемешивание
    const movableSlots = this.cardsLayout.filter(slot => slot.cardData && slot.cardData.value !== 1);
    const maxShuffleCount = movableSlots.length;
    let shuffleCount = Math.floor((randomPercent / 100) * maxShuffleCount);
    if (randomPercent > 0 && shuffleCount === 0) shuffleCount = 1;

    let emptyCells = this.cardsLayout.filter(slot => !slot.cardData);

    while (shuffleCount > 0 && emptyCells.length > 0 && movableSlots.length > 0) {
        const source = Phaser.Utils.Array.GetRandom(movableSlots);
        const target = Phaser.Utils.Array.RemoveRandomElement(emptyCells);

        const temp = source.cardData;
        source.cardData = null;
        target.cardData = temp;

        movableSlots.splice(movableSlots.indexOf(source), 1);
        movableSlots.push(target);
        emptyCells.push(source);

        shuffleCount--;
    }
}