export function RenderBackground() {
    this.background = this.add.image(0, 0, 'gameMap1').setOrigin(0, 0);

    const screenHeight = this.cameras.main.height;
    const screenWidth = this.cameras.main.width;

    const texture = this.textures.get('back');
    const frame = texture.getSourceImage();

    const originalWidth = frame.width;
    const originalHeight = frame.height;

    const scale = screenHeight / originalHeight;
    this.background.setScale(scale);
    this.background.x = (screenWidth - originalWidth * scale) / 2;
    this.background.scale = scale;
}