import { observer } from 'mobx-react-lite';
import engineStore from '../../store/engineStore';
import './UIMenu.scss';

const UIMenu = observer(() => {
    const play = () => {
        engineStore.setScene('sceneGame')
        engineStore.userDrop()
    }
    const setDiff = (e) => engineStore.setDifficult(Number(e.target.id))

    return (
        <div className="UI Menu">
            <div className="menuTitle">PROTOTYPE GAME on REACT/PHASER/MobX/SCSS/MUI &copy; Cardinal Troy</div>
            <div className="menuButton" onClick={play}>PLAY</div>
            <div className="menuDiff">
                <div className={`btnSelect ${engineStore.difficultMode === 0 && 'on'}`} id={0} onClick={setDiff}>24 Cards</div>
                <div className={`btnSelect ${engineStore.difficultMode === 1 && 'on'}`} id={1} onClick={setDiff}>52 Cards</div>
            </div>
        </div>
    );
});

export default UIMenu;