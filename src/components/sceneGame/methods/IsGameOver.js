import engineStore from "../../../store/engineStore";

export function IsGameOver() {
    const rows = 4;
    const sequence = [];

    for (let row = 0; row < rows; row++) {
        const rowCells = this.grid
            .filter(c => c.row === row)
            .sort((a, b) => a.col - b.col);

        for (let i = 0; i < this.cardsValues; i++) {
            const cell = rowCells[i];
            const card = cell?.card;
            if (!card) return;

            const value = this.UtilsGetCardValue(card);
            const suit = card.getData('suit');

            if (value !== i + 1 || suit !== row) {
                return;
            }
        }

        // Добавляем в sequence только существующие карточки
        rowCells.forEach(c => {
            if (c.card) sequence.push(c.card);
        });
    }

    if (sequence.length === 0) return;

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.height + 200;

    sequence.forEach((card, i) => {
        const sprite = card.getData('cardSprite');
        if (!sprite) return;

        // Безопасно отключаем интерактивность
        if (card.disableInteractive) card.disableInteractive();
        this.input.setDraggable(card, false);

        this.tweens.add({
            targets: card,
            x: centerX,
            y: centerY,
            scale: 0.1,
            ease: 'Cubic.easeIn',
            duration: 200,
            delay: i * 100,
            onComplete: () => {
                if (i === sequence.length - 1) {
                    this.time.delayedCall(300, () => {
                        engineStore.setScene('sceneGameOver');
                    });
                }
            }
        });
    });
}
