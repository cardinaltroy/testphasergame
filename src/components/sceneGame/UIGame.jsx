import { observer } from 'mobx-react-lite';
import engineStore from '../../store/engineStore';
import './UIGame.scss';
import botsStore from '../../store/botsStore';

const UIGame = observer(() => {
    return;


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
        </div>
    );
});

export default UIGame;