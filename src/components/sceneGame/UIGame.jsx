import { observer } from 'mobx-react-lite';
import engineStore from '../../store/engineStore';
import './UIGame.scss';
import ListIcon from '@mui/icons-material/List';
import UndoIcon from '@mui/icons-material/Undo';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { useEffect } from 'react';
import botsStore from '../../store/botsStore';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

const UIGame = observer(() => {
    const menu = () => {
        engineStore.setScene('sceneMenu');
        botsStore.clearAll()
    }
    const undo = () => engineStore.undoMove();
    const reshaffle = () => engineStore.shuffleLastCards();
    const hint = () => engineStore.showUserHint();


    return (
        <div className="UI Game">
            <div className="gameNav">

                {botsStore.getCurrentBots.map((bot, key) =>
                    <div className="userBox" key={key} style={{ backgroundImage: "url('/bots/bot_panel.png')" }}>
                        <div className="userImg"><img src={`./bots/${bot.img}`} /></div>
                        <div className="userData">
                            <div className="userName">{bot.name}</div>
                            <div className="userCards"><img src="./bots/cards.png" alt="" /> {bot.cardsFinished}/{engineStore.cards * 4}</div>
                        </div>
                    </div>
                )}

            </div>
            <div className="gameFooter" style={{ backgroundImage: "url('/panel_down.png')" }}>
                <div className="gameLabel" ><img src="./cash.webp" alt="" />{engineStore.userCash}</div>
                <div className="gameButton" onClick={menu}><ListIcon fontSize='large' /></div>
                <div className="gameButton" onClick={hint}><TipsAndUpdatesIcon fontSize='large' />25</div>
                <div className="gameButton" onClick={reshaffle}><ShuffleIcon fontSize='large' /><img src="./cash.webp" alt="" />50</div>
                <div className="gameButton" onClick={undo}><UndoIcon fontSize='large' /></div>
            </div>
        </div>
    );
});

export default UIGame;