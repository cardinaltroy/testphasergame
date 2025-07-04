import Phaser from 'phaser';
import engineStore from '../../../store/engineStore';

export function GetUserHint(AFK = true) {
    const availableMoves = []; // Список доступных ходов

    // Собираем все возможные ходы
    for (const cell of this.grid) {
        if (cell.occupied) continue;

        const leftCell = this.grid.find(c => c.row === cell.row && c.col === cell.col - 1);
        const leftCard = leftCell?.card;

        if (leftCard) {
            const value = leftCard.getData('value');
            const nextValue = value + 1;

            if (nextValue <= this.cardsValues) {
                availableMoves.push({ leftCard, nextValue, cell });
            }
        }
    }

    if (availableMoves.length === 0) return;

    if (this.arrowHint) {
        this.arrowHint.destroy();
        this.arrowHint = null;
    }

    if (!AFK) {
        const { width } = this.sys.game.config;
        this.EffectMinusCash(engineStore.userHintPrice, width / 2 + 30);
    }

    const isCardAtFinalPosition = (card, nextValue, leftCard) => {
        const finalRow = nextValue - 1;
        const finalCell = this.grid.find(c => c.row === finalRow && c.col === leftCard.getData('col'));
        return finalCell && finalCell.card === card;
    };

    // Фильтруем только те карты, которые на финальном месте
    const finalCandidates = availableMoves.filter(({ leftCard, nextValue }) => {
        const target = this.grid.find(c =>
            c.card &&
            c.card.getData('value') === nextValue &&
            c.card.getData('suit') === leftCard.getData('suit')
        );
        return target && isCardAtFinalPosition(target.card, nextValue, leftCard);
    });

    // Сортируем (финальные или обычные) по наименьшему nextValue
    const sorted = (finalCandidates.length ? finalCandidates : availableMoves)
        .sort((a, b) => a.nextValue - b.nextValue);

    const { leftCard, nextValue, cell } = sorted[0];

    const targetCardCell = this.grid.find(c =>
        c.card &&
        c.card.getData('value') === nextValue &&
        c.card.getData('suit') === leftCard.getData('suit')
    );

    if (targetCardCell) {
        const cardPosition = targetCardCell.card;

        this.arrowHint = this.add.image(
            cardPosition.x + (cardPosition.width / 4),
            cardPosition.y - 10 - (cardPosition.displayHeight / 2),
            'arrow'
        )
            .setOrigin(0.5)
            .setAlpha(1)
            .setRotation(Phaser.Math.DegToRad(-45))
            .setInteractive()
            .setDepth(505)
            .setScale(0.5);

        this.arrowHint.targetCell = cell;
        this.arrowHint.targetCard = targetCardCell;

        this.tweens.add({
            targets: this.arrowHint,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
}
