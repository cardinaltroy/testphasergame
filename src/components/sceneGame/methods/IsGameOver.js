import engineStore from "../../../store/engineStore";

export function IsGameOver() {
    const rows = 4;

    for (let row = 0; row < rows; row++) {
        const rowCells = this.grid
            .filter(c => c.row === row)
            .sort((a, b) => a.col - b.col);

        for (let i = 0; i < this.cardsValues; i++) {
            const cell = rowCells[i];
            const card = cell?.card;
            if (!card) return; // слот пустой — рано завершать

            const value = this.UtilsGetCardValue(card); // теперь напрямую
            const suit = card.getData('suit'); // масть

            if (value !== i + 1 || suit !== row) {
                return; // неправильная карта в ряду
            }
        }
    }

    // Если все карты на местах:
    engineStore.setScene('sceneGameOver');
}
