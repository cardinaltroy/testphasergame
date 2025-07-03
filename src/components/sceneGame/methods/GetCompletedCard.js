export function GetCompletedCard() {
    const rows = 4;
    let count = 0;

    for (let row = 0; row < rows; row++) {
        const rowCells = this.grid
            .filter(c => c.row === row)
            .sort((a, b) => a.col - b.col);

        for (let i = 0; i < this.cardsValues; i++) {
            const cell = rowCells[i];
            const card = cell?.card;
            if (!card) break;

            const value = this.UtilsGetCardValue(card);
            const suit = card.getData('suit');

            // проверка, что карта на нужном месте, нужного значения и масти
            if (value === i + 1 && suit === row) {
                count++;
            } else {
                break; // как только последовательность нарушена — стоп
            }
        }
    }

    return count;
}
