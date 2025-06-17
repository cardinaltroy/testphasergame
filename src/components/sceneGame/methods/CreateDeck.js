import Phaser from 'phaser';

export function CreateDeck() {
    this.cardsData = [];
    // створюємо массив карт, проходячи по масті та номеру карти та перемішуємо

    for (let suit = 0; suit < this.suits; suit++) { 
        for (let value = 1; value <= this.cardsValues; value++) {
            const frameIndex = suit * 13 + (value - 1);
            this.cardsData.push({ suit, value, frameIndex });
        }
    }

    Phaser.Utils.Array.Shuffle(this.cardsData);
}