import Phaser from 'phaser';
import engineStore from '../../../store/engineStore';

export function GetUserHint(AFK = true) {
    const availableMoves = []; // Список доступных ходов

    // находим все доступные ходы, как в UpdateCellHints, но добавляем в availableMoves
    for (const cell of this.grid) {
        if (cell.occupied) continue;

        const leftCell = this.grid.find(c => c.row === cell.row && c.col === cell.col - 1);
        const leftCard = leftCell?.card;

        if (leftCard) {
            const value = leftCard.getData('value');
            const nextValue = value + 1;

            if (nextValue <= this.cardsValues) {
                // находим подходящую карту для этой клетки
                let hintText;
                switch (nextValue) {
                    case 11: hintText = 'J'; break;
                    case 12: hintText = 'Q'; break;
                    case 13: hintText = 'K'; break;
                    default: hintText = nextValue.toString(); break;
                }

                // Сохраняем информацию о нужной карте, чтобы спавнить стрелку над ней
                availableMoves.push({ leftCard, nextValue, cell, hintText });
            }
        }
    }


    // eсли нет доступных ходов, ничего не делаем
    if (availableMoves.length === 0) {
        return;
    }

    // Удаляем старую стрелку, если она есть
    if (this.arrowHint) {
        this.arrowHint.destroy();
        this.arrowHint = null;
    }

    // за афк срабатывание не запускаем анимацию снятие денег
    if (!AFK) {
        const { width } = this.sys.game.config;

        this.EffectMinusCash(engineStore.userHintPrice, width / 2 + 30);
    }



    //список доступных ходов для отладки
    // console.log('Доступные ходы:', availableMoves);

    // Функция для проверки, может ли карта быть поставлена на своё финальное место
    const isCardAtFinalPosition = (card, nextValue, leftCard) => {
        const finalRow = nextValue - 1; // строка для карты, например, 1 для "2", 2 для "3" и так далее
        const finalCell = this.grid.find(c => c.row === finalRow && c.col === leftCard.getData('col'));

        return finalCell && finalCell.card === card; // Проверяем, что карта уже на своём месте
    };

    // Попытаемся найти карту, которая уже на своём финальном месте
    const cardAtFinalPosition = availableMoves.find(({ leftCard, nextValue }) => {
        const targetCard = this.grid
            .find(c => c.card && c.card.getData('value') === nextValue && c.card.getData('suit') === leftCard.getData('suit'));

        // Проверка, может ли эта карта быть поставлена на своё финальное место
        if (targetCard) {
            return isCardAtFinalPosition(targetCard.card, nextValue, leftCard);
        }
        return false;
    });

    // Если такая карта найдена, используем её, иначе используем первую доступную карту
    const { leftCard, nextValue, cell, hintText } = cardAtFinalPosition || availableMoves[0];

    // Ищем, какая карта подходит для этого хода
    const targetCard = this.grid
        .find(c => c.card && c.card.getData('value') === nextValue && c.card.getData('suit') === leftCard.getData('suit'));

    // Если подходящая карта найдена, создаем стрелку
    if (targetCard) {
        const cardPosition = targetCard.card;
        //  cпавним стрелку над картой, которая подходит
        this.arrowHint = this.add.image(
            cardPosition.x + (cardPosition.width / 4),
            cardPosition.y - 10 - (cardPosition.displayHeight / 2),
            'arrow'
        )
            .setOrigin(0.5)
            .setAlpha(1)
            .setRotation(Phaser.Math.DegToRad(-45))
            .setInteractive()
            .setDepth(505)
            .setScale(0.5);

        //  cохраняем ячейку, куда нужно положить карту
        this.arrowHint.targetCell = cell;
        this.arrowHint.targetCard = targetCard;

        // Добавляем анимацию мигания стрелки
        this.tweens.add({
            targets: this.arrowHint,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    } else {
        // console.log('Не найдена подходящая карта для подсказки!');
    }
}