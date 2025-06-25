export function UtilsSpawnEffects(pointer, name, size){
    // Создаём эффект частиц в точке отпускания
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

    particles.setDepth(10);  // поверх всего спавним 

    // удаляем всё когда эффект закончится
    particles.once('complete', () => {
        particles.destroy();
    });
}