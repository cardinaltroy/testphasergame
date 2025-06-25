export function UtilsSpawnEffects(pointer, name, size){
    // Создаём эффект частиц в точке отпускания
    console.log(this)
    const particles = this.add.particles(pointer.x, pointer.y, name, {
        color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],
        colorEase: 'quad.out',
        lifespan: 500,
        scale: { start: size, end: 0, ease: 'sine.out' },
        speed: 200,
        advance: 500,
        frequency: 10,
        blendMode: 'ADD',
        duration: 100,
    });

    particles.setDepth(10);  // например, сверху всего

    // Ждём, пока эффект закончится, и удаляем частицы
    particles.once('complete', () => {
        particles.destroy();
    });
}