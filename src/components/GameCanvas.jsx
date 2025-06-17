import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import sceneMenu from './sceneMenu/sceneMenu';
import sceneGame from './sceneGame/sceneGame';
import sceneGameOver from './sceneGameOver/sceneGameOver';
import engineStore from '../store/engineStore';
import { observer } from 'mobx-react-lite';

const GameCanvas = observer(() => {
    const gameRef = useRef(null);

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: '#007c0a',
            scene: [sceneMenu, sceneGame, sceneGameOver],
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH,
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
        {engineStore.getUI}
        <div ref={gameRef} />
    </>;
});

export default GameCanvas;