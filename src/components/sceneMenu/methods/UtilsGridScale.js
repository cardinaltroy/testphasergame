export function UtilsGridScale() {
    const isMobile = this.sys.game.device.os.android || this.sys.game.device.os.iOS;
    return isMobile ? 0.75 : 1;
}