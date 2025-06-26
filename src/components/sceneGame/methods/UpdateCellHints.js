export function UpdateCellHints() {
    // обновляємо підсказки куди і які карит можемо поставити
    for (const cell of this.grid) {
        if (cell.occupied) { // тут вже є карта
            cell.hint.setText('');
            continue;
        }

        //провіряємо ліву карту, і показуємо підсказку + 1 від лівої карти, якщо карта остання або зліва пусто то нічого
        const leftCell = this.grid.find(c => c.row === cell.row && c.col === cell.col - 1);
        const leftCard = leftCell?.card;

        if (leftCard) {
            const value = leftCard.getData('value')

            const nextValue = value + 1;

            if (nextValue <= this.cardsValues) {
                let hintText;
                switch (nextValue) {
                    case 11:
                        hintText = 'J';
                        break;
                    case 12:
                        hintText = 'Q';
                        break;
                    case 13:
                        hintText = 'K';
                        break;
                    default:
                        hintText = nextValue.toString();
                        break;
                }
                cell.hint.setText(hintText);
            } else {
                cell.hint.setText('');
            }
        } else {
            cell.hint.setText('');
        }
    }
}
