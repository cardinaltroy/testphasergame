import { EffectShuffleArrow } from '../render/EffectShuffleArrow';

export function UpdateCellHints() {
    let flagStepsvailable = 0;

    // обновляем подсказки, куда и какие карты можем поставить
    for (const cell of this.grid) {
        if (cell.occupied) { // здесь уже есть карта
            cell.hint.setText('');
            continue;
        }

        // проверяем левую карту и показываем подсказку + 1 от левой карты
        const leftCell = this.grid.find(c => c.row === cell.row && c.col === cell.col - 1);
        const leftCard = leftCell?.card;

        if (leftCard) {
            const value = leftCard.getData('value');
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
                flagStepsvailable++;
            } else {
                cell.hint.setText('');
            }
        } else {
            cell.hint.setText('');
        }
    }

    // Обновляем состояние доступных ходов
    this.hintsAvailable = flagStepsvailable;

    // Если доступных ходов нет, показываем мигающую стрелку

    if (this.hintsAvailable === 0 && !this.lvlFinished) {
        if (!this.arrowHint) {
            EffectShuffleArrow(this)
        }
    } else {
        // Если есть доступные ходы, убираем стрелку
        if (this.arrowHint) {
            this.arrowHint.destroy();
            this.arrowHint = null; // Убираем ссылку на стрелку
        }
    }
}
