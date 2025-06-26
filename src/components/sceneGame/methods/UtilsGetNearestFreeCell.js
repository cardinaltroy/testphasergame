export function UtilsGetNearestFreeCell(x, y) {
    // пошук ближнього слоту для розміщеня карти
    const maxDistance = 60; // не далі ніж 60пікселів шукаємо слот
    let minDist = Infinity;

    let nearest = null;

    for (const cell of this.grid) {
        if (cell.occupied) continue;
        
        const dx = cell.x - x;
        const dy = cell.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < minDist && dist <= maxDistance) {
            nearest = cell;
            minDist = dist;
        }
    }
    return nearest;
}