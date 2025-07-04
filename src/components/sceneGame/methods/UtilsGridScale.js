export function UtilsGridScale() {
    const baseWidth = 1280;
    const baseHeight = 720;

    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;

    const scaleX = screenWidth / baseWidth;
    const scaleY = screenHeight / baseHeight;

    // Берём минимальное значение, чтобы всё влезало на экран
    let scale = 0.2 + Math.min(scaleX, scaleY)
    return scale;
}
