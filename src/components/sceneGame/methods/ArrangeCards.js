import Phaser from 'phaser';

export function ArrangeCards() {
    // розтавляємо карти враховуючи що декілька уже правильно повинні бути розкладені, інші рандомно + 1 вільний слот в ряду

    let cardsFixed = this.cardsBase * this.suits;
    let cardsRandom = this.cardsValues * this.suits - cardsFixed;
    let cardsEmpty = this.cardsFree * this.suits;

    this.cards = [];

    let allCells = [];
    let fixedCards = []; 

    let usedCards = []; // сюди добавляємо уже використані карти

    // В кожен ряд добавляємо фіксовані карти наприклад "А,2,3"
    for (let row = 0; row < 4; row++) {
        const suit = row;

        const fixedRowCards = [];
        for (let v = 1; v <= this.cardsBase; v++) {
            const card = this.cardsData.find(c => c.suit === suit && c.value === v);
            if (card) {
                fixedRowCards.push(card);
                usedCards.push(card);
            }
        }
        fixedCards.push({ row, cards: fixedRowCards });

    }

    //  Працюємо лише з пустими слотами тепер
    for (const cell of this.grid) {
        if (cell.col < this.cardsBase) continue;
        allCells.push(cell);
    }

    // вибираємо слоти що залишаться порожні та навпаки заповнені картами
    Phaser.Utils.Array.Shuffle(allCells);
    const emptyCells = allCells.slice(0, cardsEmpty);
    const filledCells = allCells.slice(cardsEmpty, cardsEmpty + cardsRandom);


    //  карти що залишились, "4,5..."
    const remainingCards = this.cardsData.filter(c =>
        !usedCards.includes(c)
    );
    Phaser.Utils.Array.Shuffle(remainingCards);

    // Спочатку рендер  фіксованих карт
    for (const { row, cards } of fixedCards) {
        for (let col = 0; col < this.cardsBase; col++) {
            const cell = this.grid.find(c => c.col === col && c.row === row);
            const cardData = cards[col];

            if (!cell || !cardData) continue;

            const card = this.add.sprite(cell.x, cell.y, 'cards', cardData.frameIndex)
                .setInteractive()
                .setScale(1.5);

            card.setData('cell', cell);
            card.setData('originalX', cell.x);
            card.setData('originalY', cell.y);

            this.input.setDraggable(card);

            cell.occupied = true;
            cell.card = card;

            this.cards.push(card);
        }
    }

    // Рендеримо залишок карт
    for (let i = 0; i < filledCells.length; i++) {
        const cell = filledCells[i];
        const data = remainingCards[i];

        const card = this.add.sprite(cell.x, cell.y, 'cards', data.frameIndex)
            .setInteractive()
            .setScale(1.5);

        card.setData('cell', cell);
        card.setData('originalX', cell.x);
        card.setData('originalY', cell.y);

        this.input.setDraggable(card);

        cell.occupied = true;
        cell.card = card;

        this.cards.push(card);
    }

    // ті що пусті слоти, робимо доступними до використання
    for (const cell of emptyCells) {
        cell.occupied = false;
        cell.card = null;
    }

    this.UpdateCellHints();
}