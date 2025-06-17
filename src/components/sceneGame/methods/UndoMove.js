export function UndoMove() {
    // метод простий для того щоб 1 крок назад відтворити. Для того щоб більше потрібно робити історію уже
    if (this.lastMove) {
        // коли перетянули карту записується lastMove
        const {
            card, // карта
            oldX, // координати звідки ми перетягували 
            oldY, 
            oldCell, // і слот сітки з якого перетянули карту
            nearest  // а а це слот в який ми закинули карту, щоб при ундо його обнулити і підказки працювали коорректно
        } = this.lastMove;

        card.x = oldX; // повертаєм спрайт назад
        card.y = oldY;

        if (oldCell) {
            oldCell.occupied = true; // указуєм що повернулись в колонку і тепер занята
            oldCell.card = card;
        }

        if (nearest) { // а тут навпаки
            nearest.occupied = false;
            nearest.card = null;
        }

        // в карті обновляємо актуальну інфу про неї
        card.setData('cell', oldCell);
        card.setData('originalX', oldX);
        card.setData('originalY', oldY);

        this.lastMove = null; // чистим "історію"

        //обновити підсказки
        this.UpdateCellHints();
    }
}