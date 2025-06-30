import { RenderCard } from "./RenderCard";

export function RenderCardsRevealAnimation() {
    // ждем всех прилётов, потом разворачиваем все
    const totalDelay = this.cardsLayout.length * 100 + 700;

    this.time.delayedCall(totalDelay, () => {
        this.flyInSprites.forEach(({ sprite, slot }) => {
            this.tweens.add({
                targets: sprite,
                scaleX: 0,
                ease: 'Linear',
                duration: 200,
                onComplete: () => {
                    const cardData = sprite.getData('cardData');
                    const cell = sprite.getData('cell');
                    sprite.destroy();

                    if (cardData) {
                        RenderCard(this, cell, cardData.value, cardData.suit, this.cards);
                    } else {
                        cell.card = null;
                        cell.occupied = false;
                    }

                    this.UpdateCellHints();
                    this.CheckFinishedLines();
                }
            });
        });
    });

}