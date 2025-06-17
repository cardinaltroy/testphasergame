export function UtilsGetCardValue(card) {
    // отримуємо номер карти 1-13 (від туза до короля), 

    if (!card) return -1;
    const frameIndex = card.frame.name; // назва фрейма "0", "12", "25", ... і т.д.
    const index = parseInt(frameIndex, 10); // в число
    return (index % 13) + 1; // отримуємо value з frameIndex
}