export function UndoMove() {
    if (this.lastMove) {
        const {
            card,    // контейнер карты
            oldX,
            oldY,
            oldCell,
            nearest
        } = this.lastMove;

        // Возвращаем контейнер в исходную позицию
        card.x = oldX;
        card.y = oldY;

        if (oldCell) {
            oldCell.occupied = true;
            oldCell.card = card;
        }

        if (nearest) {
            nearest.occupied = false;
            nearest.card = null;
        }

        // Обновляем данные в контейнере
        card.setData('cell', oldCell);
        card.setData('originalX', oldX);
        card.setData('originalY', oldY);

        // Убираем затемнение со всех спрайтов внутри контейнера
        ['cardSprite', 'bgSprite', 'suitIcon'].forEach(key => {
            const sprite = card.getData(key);
            if (sprite) sprite.clearTint();
        });

        // Включаем взаимодействие и перетаскивание
        card.setInteractive();
        this.input.setDraggable(card, true);
        card.setData('locked', false);

        this.lastMove = null;

        this.check()
    }
}
