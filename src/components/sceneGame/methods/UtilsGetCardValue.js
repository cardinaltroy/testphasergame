export function UtilsGetCardValue(card) {
    if (!card) return -1;
    return card.getData('value') ?? -1;
}
