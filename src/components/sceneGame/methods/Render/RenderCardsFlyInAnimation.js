export function RenderCardsFlyInAnimation() {
    const scale = this.UtilsGridScale()
    this.cardsLayout.forEach((slot, i) => {
        const sprite = this.add.sprite(this.cameras.main.centerX, this.cameras.main.height + 100, 'card_shirt3')
            .setData('cardData', slot.cardData)
            .setData('cell', slot.cell)
            .setScale(0.7*scale);

        this.flyInSprites.push({ sprite, slot });

        this.tweens.add({
            targets: sprite,
            x: slot.x,
            y: slot.y,
            ease: 'Cubic.easeOut',
            duration: 300,
            delay: i * 100,
        });
    });
}
