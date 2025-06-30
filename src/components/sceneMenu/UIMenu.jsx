import { observer } from 'mobx-react-lite';
import './UIMenu.scss';
import LevelSelect from './jsx/LevelSelect';
import LevelWaiting from './jsx/LevelWaiting';
import botsStore from '../../store/botsStore';

const UIMenu = observer(() => {
    const isWaiting = botsStore.currentRound != 0;
    if(!isWaiting) return;
    return (
        <div className="UI Menu">
            <div className="menuDiff" style={{
                backgroundImage: "url('/win_bg_info.png')",
            }}>
                <LevelWaiting />
            </div>
        </div>
    );
});

export default UIMenu;