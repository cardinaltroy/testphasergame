export function ClearCellHints() {
    // зачистить все подсказки и стрелку если уровень закончился
    if (this.lvlFinished) {
        for (const cell of this.grid) {
            cell.hint.setText('');
        }

        if (this.arrowHint) {
            this.arrowHint.destroy();
            this.arrowHint = null;
        }

        this.hintsAvailable = 0;
        return;
    }
}