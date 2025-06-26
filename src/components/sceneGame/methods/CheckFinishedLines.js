export function CheckFinishedLines() {
    const maxValue = this.cardsValues; // Максимальное значение карты (например, 6 или 13)

    // Снимаем блокировку и затемнение со всех карт
    for (const cell of this.grid) {
        const cardContainer = cell.card;
        if (cardContainer && cardContainer.getData('locked')) {
            ['cardSprite', 'bgSprite', 'suitIcon'].forEach(key => {
                const sprite = cardContainer.getData(key);
                if (sprite) sprite.clearTint();
            });

            cardContainer.setInteractive();
            this.input.setDraggable(cardContainer, true); // Включаем перетаскивание обратно
            cardContainer.setData('locked', false);
        }
    }

    // Проверяем каждый ряд (масть)
    for (let row = 0; row < this.suits; row++) {
        const rowCells = this.grid
            .filter(c => c.row === row)
            .sort((a, b) => a.col - b.col);

        let expectedValue = 1;
        let baseSuit = null;
        let sequence = [];

        for (const cell of rowCells) {
            if (!cell.occupied || !cell.card) break;

            const cardContainer = cell.card;
            const cardSprite = cardContainer.getData('cardSprite');
            if (!cardSprite) break;

            const value = this.UtilsGetCardValue(cardSprite);
            const suit = cardContainer.getData('suit');

            if (value !== expectedValue) break;

            if (expectedValue === 1) {
                baseSuit = suit;
            } else if (suit !== baseSuit) {
                break;
            }

            sequence.push(cardContainer);
            expectedValue++;

            if (expectedValue > maxValue) break;
        }

        if (sequence.length > 0) {
            for (const cardContainer of sequence) {
                if (!cardContainer.getData('locked')) {
                    ['cardSprite', 'bgSprite', 'suitIcon'].forEach(key => {
                        const sprite = cardContainer.getData(key);
                        if (sprite) sprite.setTint(0x888888);
                    });

                    cardContainer.disableInteractive();
                    this.input.setDraggable(cardContainer, false); // Отключаем перетаскивание
                    cardContainer.setData('locked', true);
                }
            }
        }
    }
}
