import { observer } from 'mobx-react-lite';
import engineStore from '../../store/engineStore';
import './UIGame.scss';
import ListIcon from '@mui/icons-material/List';
import UndoIcon from '@mui/icons-material/Undo';
import ShuffleIcon from '@mui/icons-material/Shuffle';

const UIGame = observer(() => {
    const menu = () => engineStore.setScene('sceneMenu');
    const undo = () => engineStore.undoMove();
    const reshaffle = () => engineStore.shuffleLastCards();

    const format = (sec) => {
        const mins = Math.floor(sec / 60);
        const secs = sec % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }


    return (
        <div className="UI Game">
            <div className="gameNav">
                <div className="gameLabel">SCORE: {engineStore.userScores}</div>
                <div className="gameLabel">TIME: {format(engineStore.userPlayTIme)}</div>
                <div className="gameLabel" >MOVES: {engineStore.userMoves}</div>
            </div>
            <div className="gameFooter">
                <div className="gameButton" onClick={menu}><ListIcon fontSize='large' /></div>
                <div className="gameButton" onClick={reshaffle}><ShuffleIcon fontSize='large' /> {engineStore.userShuffles}</div>
                <div className="gameButton" onClick={undo}><UndoIcon fontSize='large' /></div>
            </div>
        </div>
    );
});

export default UIGame;