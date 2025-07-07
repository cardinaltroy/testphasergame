import userStore from "../../../store/userStore";


export function IsGameOver() {
    //console.log('isgameover')
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
    //console.log(sequence.length)
    
    if (sequence.length === 0) return;

    //рендерим анимацию сбора карт
    let user = userStore.dataGet;
    this.finish({ name: user.name, isBot: false })
}
