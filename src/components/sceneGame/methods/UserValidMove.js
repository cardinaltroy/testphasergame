import engineStore from "../../../store/engineStore";

export function UserValidMove(pointer, card, nearest, oldCell) {
    //Проверяем бесплатные монетки
    if (engineStore.isCanDropMoney()) {
        this.EffectFreeCash(nearest)
    }

    // Создаём эффект частиц в точке отпускания
    this.EffectCardsParticles(pointer, 'sparkGreen', 1.2);

    this.sound.play('drag');
    this.tweens.add({
        targets: card,
        scaleX: 1.1,
        scaleY: 1.1,
        yoyo: true,
        duration: 100,
        ease: 'Power2'
    });

    this.ui.UIGameFooterUndo = {
        card: card,
        oldX: card.getData('originalX'),
        oldY: card.getData('originalY'),
        oldCell: card.getData('cell'),
        nearest: nearest,
    };

    oldCell.occupied = false;
    oldCell.card = null;

    card.x = nearest.x;
    card.y = nearest.y;
    card.setData('cell', nearest);
    card.setData('originalX', nearest.x);
    card.setData('originalY', nearest.y);

    nearest.occupied = true;
    nearest.card = card;

    engineStore.addMoves();
    engineStore.addScores();

    this.check()
}