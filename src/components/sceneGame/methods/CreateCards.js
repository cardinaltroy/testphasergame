import Phaser from 'phaser';
import engineStore from '../../../store/engineStore';
import { RenderCard } from './Render/RenderCard';

export function CreateCards() {
    const cardsPerRow = engineStore.cards;
    const totalCols = cardsPerRow + 1;
    const randomPercent = engineStore.random;
    const suits = 4;

    this.cardsData = [];
    this.cards = [];

    // 1. Генерируем карты
    for (let suit = 0; suit < suits; suit++) {
        for (let value = 1; value <= cardsPerRow; value++) {
            this.cardsData.push({ suit, value });
        }
    }

    const aces = this.cardsData.filter(c => c.value === 1);
    let others = this.cardsData.filter(c => c.value !== 1);

    // 2. Размещаем все карты строго по местам
    for (let suit = 0; suit < suits; suit++) {
        // Туз в первую колонку
        const ace = aces.find(c => c.suit === suit);
        const aceCell = this.grid.find(c => c.row === suit && c.col === 0);
        if (ace && aceCell) {
            RenderCard(this, aceCell, ace.value, suit, this.cards);
        }

        // Остальные карты (2 и выше)
        const rowOthers = others.filter(c => c.suit === suit);
        for (let i = 0; i < rowOthers.length && i < totalCols - 2; i++) {
            const cell = this.grid.find(c => c.row === suit && c.col === i + 1);
            if (cell) {
                RenderCard(this, cell, rowOthers[i].value, suit, this.cards);
            }
        }
    }

    // 3. Подготавливаем 1–4 случайные пустые ячейки в последнем столбце
    const lastColCells = this.grid.filter(c => c.col === totalCols - 1);
    Phaser.Utils.Array.Shuffle(lastColCells);
    const emptyCellCount = Phaser.Math.Between(1, Math.min(4, lastColCells.length));
    const initialEmptyCells = lastColCells.slice(0, emptyCellCount);

    for (const cell of initialEmptyCells) {
        cell.occupied = false;
        cell.card = null;
    }

    // 4. Вычисляем shuffleCount (кол-во перестановок)
    const maxShuffleCount = others.length;
    let shuffleCount = Math.floor((randomPercent / 100) * maxShuffleCount);
    if (randomPercent > 0 && shuffleCount === 0) shuffleCount = 1;

    // 5. Получаем текущие свободные ячейки
    let posEmptyCells = [...initialEmptyCells];

    // 6. Выполняем перемешивание
    while (shuffleCount > 0 && posEmptyCells.length > 0) {
        // Выбираем карту, которую можно переместить (не туз, и сейчас стоит на месте)
        const movableCards = this.cards.filter(sprite => {
            const cell = sprite.getData('cell');
            const value = sprite.getData('value');
            return cell && cell.occupied && value !== 1;
        });

        if (movableCards.length === 0) break;

        const chosenCard = Phaser.Utils.Array.GetRandom(movableCards);
        const fromCell = chosenCard.getData('cell');
        const toCell = Phaser.Utils.Array.RemoveRandomElement(posEmptyCells);

        // Перемещаем карту
        chosenCard.setPosition(toCell.x, toCell.y);
        chosenCard.setData('cell', toCell);
        chosenCard.setData('originalX', toCell.x);
        chosenCard.setData('originalY', toCell.y);

        toCell.card = chosenCard;
        toCell.occupied = true;

        fromCell.card = null;
        fromCell.occupied = false;

        posEmptyCells.push(fromCell); // теперь она стала пустой
        shuffleCount--;
    }

    this.UpdateCellHints();
}
