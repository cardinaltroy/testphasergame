
export function RenderCardsGameOver() {
    let sequence = [];
    // Собираем все существующие карты с доски
    this.grid.forEach(cell => {
        if (cell.card) {
            sequence.push(cell.card);
        }
    });
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.height + 200;

    this.lvlFinished = true;

    sequence.reverse().forEach((card, i) => {
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
                        //engineStore.setScene('sceneMenu');
                        this.lvlFinished = false;

                    });
                }
            }
        });
    });
}