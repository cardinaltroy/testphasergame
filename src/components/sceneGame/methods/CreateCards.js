import Phaser from 'phaser';
import engineStore from '../../../store/engineStore';

export function CreateCards() {
    const cardsPerRow = engineStore.cards;
    const totalCols = cardsPerRow + 1;
    const randomPercent = engineStore.random;

    const suits = 4;

    this.cardsData = [];
    this.cards = [];

    // 1. Создаем все карты
    for (let suit = 0; suit < suits; suit++) {
        for (let value = 1; value <= cardsPerRow; value++) {
            const frameIndex = suit * 13 + (value - 1);
            this.cardsData.push({ suit, value, frameIndex });
        }
    }

    // 2. Разделяем тузы и остальные
    const aces = this.cardsData.filter(c => c.value === 1);
    let others = this.cardsData.filter(c => c.value !== 1);

    // 3. Считаем сколько перемешивать
    const maxShuffleCount = others.length;
    let shuffleCount = Math.floor((randomPercent / 100) * maxShuffleCount);
    if (randomPercent > 0 && shuffleCount === 0) shuffleCount = 1;

    // 4. Размещение карт
    for (let suit = 0; suit < suits; suit++) {
        const ace = aces.find(c => c.suit === suit);
        if (ace) {
            const cell = this.grid.find(c => c.row === suit && c.col === 0);
            if (cell) {
                const cardSprite = this.add.sprite(cell.x, cell.y, 'cards', ace.frameIndex)
                    .setInteractive()
                    .setScale(1.5);
                cardSprite.setData('cell', cell);
                cardSprite.setData('originalX', cell.x);
                cardSprite.setData('originalY', cell.y);
                this.input.setDraggable(cardSprite);

                cell.occupied = true;
                cell.card = cardSprite;
                this.cards.push(cardSprite);
            }
        }

        const rowOthers = others.filter(c => c.suit === suit);
        for (let i = 0; i < rowOthers.length; i++) {
            const col = i + 1;
            if (col >= totalCols - 1) break;

            const cell = this.grid.find(c => c.row === suit && c.col === col);
            if (cell) {
                const cardSprite = this.add.sprite(cell.x, cell.y, 'cards', rowOthers[i].frameIndex)
                    .setInteractive()
                    .setScale(1.5);
                cardSprite.setData('cell', cell);
                cardSprite.setData('originalX', cell.x);
                cardSprite.setData('originalY', cell.y);
                this.input.setDraggable(cardSprite);

                cell.occupied = true;
                cell.card = cardSprite;
                this.cards.push(cardSprite);
            }
        }

        // Пустая ячейка справа
        const emptyCell = this.grid.find(c => c.row === suit && c.col === totalCols - 1);
        if (emptyCell) {
            emptyCell.occupied = false;
            emptyCell.card = null;
        }
    }

    // 5. Получаем список всех пустых ячеек
    const emptyCells = this.grid.filter(c => !c.occupied && c.col === totalCols - 1);
    if (emptyCells.length === 0) {
        console.warn('Нет пустых ячеек!');
        return;
    }

    // 6. Выбираем случайную стартовую пустую ячейку
    let posEmptyCell = Phaser.Utils.Array.GetRandom(emptyCells);

    // 7. Цикл перемешивания
    while (shuffleCount > 0) {
        // 7.1 Выбираем случайную непустую карту (не туз)
        const movableCards = this.cards.filter(sprite => {
            const cell = sprite.getData('cell');
            const frameIndex = sprite.frame.name;
            const value = (frameIndex % 13) + 1;
            return cell && cell.occupied && value !== 1;
        });

        if (movableCards.length === 0) break;

        const chosenCard = Phaser.Utils.Array.GetRandom(movableCards);
        const fromCell = chosenCard.getData('cell');

        // 7.2 Перемещаем карту в пустую ячейку
        chosenCard.setPosition(posEmptyCell.x, posEmptyCell.y);
        chosenCard.setData('cell', posEmptyCell);
        chosenCard.setData('originalX', posEmptyCell.x);
        chosenCard.setData('originalY', posEmptyCell.y);

        posEmptyCell.occupied = true;
        posEmptyCell.card = chosenCard;

        fromCell.occupied = false;
        fromCell.card = null;

        // 7.3 Новая пустая ячейка — та, откуда взяли карту
        posEmptyCell = fromCell;

        shuffleCount--;
    }

    // 8. Обновляем подсказки
    this.UpdateCellHints();
}
