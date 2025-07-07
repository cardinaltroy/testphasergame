import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import sceneMenu from './sceneMenu/sceneMenu';
import sceneGame from './sceneGame/sceneGame';
import engineStore from '../store/engineStore';

const GameCanvas = () => {
    const gameRef = useRef(null);

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 'black',
            scene: [sceneMenu, sceneGame],
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                resizeTo: window
            },
            
            parent: gameRef.current // div в який спавниться канвас
        };

        const game = new Phaser.Game(config);
        engineStore.setGame(game) // тут зберігаємо лінк на об'єкт гри щоб працювати з ним потім

        return () => {
            game.destroy(true);
            engineStore.unmount();
        };
    }, []);


    return <>
        <div ref={gameRef} />
    </>;
};

export default GameCanvas;