export function RenderCard(scene, cell, value, suit, cardsArray) {
    const colorChar = suit < 2 ? 'b' : 'r';

    const textureKey = `card_${value - 1}${colorChar}`;

    const scale = scene.UtilsGridScale()
    const bg = scene.add.image(0, 0, 'card_bg2');
    const face = scene.add.image(0, 0, textureKey);
    face.setData('value', value);

    const suitIcon = scene.add.image(bg.width / 2 - 10, -bg.height / 2 + 10, `suit_${suit}`)
        .setScale(0.8)
        .setOrigin(1, 0);

    const container = scene.add.container(cell.x, cell.y, [bg, face, suitIcon])
        .setSize(bg.width, bg.height)
        .setInteractive()
        .setScale(0.7*scale);

    // Сохраняем ссылки на вложенные элементы
    container.setData('cardSprite', face);
    container.setData('bgSprite', bg);
    container.setData('suitIcon', suitIcon);

    container.setData('cell', cell);
    container.setData('suit', suit);
    container.setData('value', value);
    container.setData('originalX', cell.x);
    container.setData('originalY', cell.y);
    container.setData('locked', false); // важно!

    scene.input.setDraggable(container);

    cell.occupied = true;
    cell.card = container;
    cardsArray.push(container);

    return container;
}
