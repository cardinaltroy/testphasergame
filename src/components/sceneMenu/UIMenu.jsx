import { observer } from 'mobx-react-lite';
import engineStore from '../../store/engineStore';
import './UIMenu.scss';

const UIMenu = observer(() => {
    const play = (cards, random) => {
        engineStore.setDifficult(cards, random)
        engineStore.setScene('sceneGame')
        engineStore.userDrop()
    }
    return (
        <div className="UI Menu">
            <div className="menuDiff">
                <div className='btnSelect' onClick={() => play(4, 1)}>1 Level <br/>(cards:4, random:1)</div>
                <div className='btnSelect' onClick={() => play(4, 50)}>2 Level <br/>(cards:4, random:50)</div>
                <div className='btnSelect' onClick={() => play(4, 100)}>3 Level <br/>(cards:4, random:100)</div>

                <div className='btnSelect' onClick={() => play(6, 1)}>4 Level <br/>(cards:6, random:1)</div>
                <div className='btnSelect' onClick={() => play(6, 50)}>5 Level <br/>(cards:6, random:50)</div>
                <div className='btnSelect' onClick={() => play(6, 100)}>6 Level <br/>(cards:6, random:100)</div>

                <div className='btnSelect' onClick={() => play(8, 1)}>7 Level <br/>(cards:8, random:1)</div>
                <div className='btnSelect' onClick={() => play(8, 50)}>8 Level <br/>(cards:8, random:50)</div>
                <div className='btnSelect' onClick={() => play(8, 100)}>9 Level <br/>(cards:8, random:100)</div>

                <div className='btnSelect' onClick={() => play(13, 1)}>10 Level <br/>(cards:13, random:1)</div>
                <div className='btnSelect' onClick={() => play(13, 50)}>11 Level <br/>(cards:13, random:50)</div>
                <div className='btnSelect' onClick={() => play(13, 100)}>12 Level <br/>(cards:13, random:100)</div>
            </div>
        </div>
    );
});

export default UIMenu;