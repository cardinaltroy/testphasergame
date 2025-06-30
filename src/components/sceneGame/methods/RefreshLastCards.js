import Phaser from 'phaser';
import engineStore from '../../../store/engineStore';
import { EffectMinusCash } from '../render/EffectMinusCash';

export function RefreshLastCards() {
    const targetCells = this.grid;

    // Карты для перемешивания — только разблокированные
    const cardsToReshuffle = targetCells
        .filter(cell => cell.card && !cell.card.getData('locked'))
        .map(cell => cell.card);

    if (cardsToReshuffle.length === 0) return;

    // Освобождаем клетки
    for (const cell of targetCells) {
        if (cell.card && !cell.card.getData('locked')) {
            cell.card = null;
            cell.occupied = false;
        }
    }
    
    const emptyCells = targetCells.filter(cell => !cell.occupied);

    // Функция проверки, перемещалась ли хотя бы одна карта
    const isNotSamePlace = () => {
        let flag = false;

        for (let i = 0; i < cardsToReshuffle.length && i < emptyCells.length; i++) {
            const card = cardsToReshuffle[i];
            const oldCell = card.getData('cell');
            const cell = emptyCells[i];

            // если координаты карты и клетки не совпадают, значит хотя бы 1 карта переместилась
            if (oldCell.col !== cell.col || oldCell.row !== cell.row) flag = true; 
        }
        return flag;
    };

    // Перемешиваем карты и пустые клетки независимо
    Phaser.Utils.Array.Shuffle(cardsToReshuffle);
    Phaser.Utils.Array.Shuffle(emptyCells);

    // Перемешиваем несколько раз, если карты не переместились
    let shuffleAttempts = 0;
    const maxAttempts = 3; // Максимальное количество попыток перетасовать карты

    while (!isNotSamePlace() && shuffleAttempts < maxAttempts) {
        Phaser.Utils.Array.Shuffle(cardsToReshuffle);
        Phaser.Utils.Array.Shuffle(emptyCells);
        shuffleAttempts++;
    }

    // После того как карты перемешаны, обновляем их позицию
    for (let i = 0; i < cardsToReshuffle.length && i < emptyCells.length; i++) {
        const card = cardsToReshuffle[i];
        const cell = emptyCells[i];

        // Обновляем cell в карточке
        card.setData('cell', cell);
        card.setData('originalX', cell.x);
        card.setData('originalY', cell.y);

        cell.card = card;
        cell.occupied = true;

        // Плавное перемещение
        this.tweens.add({
            targets: card,
            x: cell.x,
            y: cell.y,
            duration: 300,
            ease: 'Cubic.easeOut'
        });
    }

    this.check();
    this.lastMove = null;

    // --- ЭФФЕКТ СНЯТИЯ ДЕНЕГ ---
    EffectMinusCash(this, engineStore.userShufflesPrice);
}
