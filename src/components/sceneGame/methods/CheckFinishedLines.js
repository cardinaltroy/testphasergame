export function CheckFinishedLines() {
    console.log('check');

    const maxValue = this.cardsValues; // Максимальное значение карты (например, 6 или 13)

    // Сначала снимаем блокировку и затемнение со всех карт
    for (const cell of this.grid) {
        const card = cell.card;
        if (card && card.getData('locked')) {
            card.clearTint();
            card.setInteractive();
            card.setData('locked', false);
        }
    }

    // Проходим по каждому ряду (масти)
    for (let row = 0; row < this.suits; row++) {
        // Получаем и сортируем ячейки этого ряда по колонкам
        const rowCells = this.grid
            .filter(c => c.row === row)
            .sort((a, b) => a.col - b.col);

        let expectedValue = 1;      // Ожидаемая карта (начинаем с туза)
        let baseSuit = null;        // Масть, которую должны соблюдать
        let sequence = [];          // Последовательность подходящих карт

        // Проходим по всем ячейкам ряда слева направо
        for (const cell of rowCells) {
            const card = cell.card;

            // Если ячейка пустая или карты нет — прерываем проверку ряда
            if (!cell.occupied || !card) break;

            const value = this.UtilsGetCardValue(card); // Значение карты
            const suit = card.getData('suit');          // Масть карты

            // Если значение не совпадает с ожидаемым — выход
            if (value !== expectedValue) break;

            // Если это первая карта в ряду — запоминаем масть
            if (expectedValue === 1) {
                baseSuit = suit;
            }
            // Если масть не совпадает с базовой — выход
            else if (suit !== baseSuit) {
                break;
            }

            // Добавляем карту в последовательность
            sequence.push(card);
            expectedValue++;

            // Если достигли максимального значения — прерываем (ряд может быть завершён)
            if (expectedValue > maxValue) break;
        }

        // ✅ Если есть хотя бы одна подходящая карта (включая туза)
        // то блокируем все карты в последовательности (чтобы нельзя было двигать)
        if (sequence.length > 0) {
            for (const card of sequence) {
                if (!card.getData('locked')) {
                    card.setTint(0x888888);           // Затемняем карту
                    card.disableInteractive();        // Запрещаем взаимодействие
                    card.setData('locked', true);     // Помечаем как заблокированную
                }
            }
        }
    }
}
