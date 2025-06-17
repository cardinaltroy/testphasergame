import engineStore from "../../../store/engineStore";

export function IsGameOver() {
    // Відпрацьовує після кожного перетягуваня карти
    const rows = 4;

    for (let row = 0; row < rows; row++) {
        // отримуємо ряд
        const rowCells = this.grid
            .filter(c => c.row === row)
            .sort((a, b) => a.col - b.col);

        for (let i = 0; i < this.cardsValues; i++) {
            const cell = rowCells[i];
            const card = cell?.card;
            if (!card) return; // є пусті слоти

            const value = this.UtilsGetCardValue(card);
            const suit = card.frame.name / 13 | 0;

            if (value !== i + 1 || suit !== row) {
                return; // карта не та що повинна бути
            }
        }
    }

    engineStore.setScene('sceneGameOver')
}