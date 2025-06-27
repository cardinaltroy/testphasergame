import { useEffect, useState } from "react";
import engineStore from "../../../store/engineStore";
import botsStore from "../../../store/botsStore";
import { observer } from "mobx-react-lite";

import CircularProgress from '@mui/material/CircularProgress';

const LevelWaiting = observer((props) => {
    const [displayedBots, setDisplayedBots] = useState([]);
    const { level } = props;

    const play = () => {
        engineStore.setDifficult(level.cards, level.random);
        engineStore.setScene('sceneGame');
        engineStore.userDrop();
    };

    useEffect(() => {
        // Сначала очищаем старых ботов, если они были
        botsStore.clearAll();
        // Спавним 4 бота
        botsStore.spawn(4);

        // Массив ботов для отображения
        const bots = botsStore.getCurrentBots;

        // Симуляция подключения ботов с интервалом 1 секунда
        bots.forEach((bot, index) => {
            setTimeout(() => {
                setDisplayedBots((prevBots) => [...prevBots, bot]); // Добавляем бота в список отображаемых
            }, index * 1000); // Появление бота через каждую секунду
        });

        // После того как все боты отображены, вызываем play через 1 секунду
        setTimeout(() => {
            play();
        }, bots.length * 1000 + 1000); // Ждем пока все боты появятся и еще 1 секунду
    }, []);

    return (
        <>
            <div className="boxTitle">WAITING OTHERS</div>
            <div className="boxUsers" >
                {displayedBots.length === 0 ? (
                    <CircularProgress />
                ) : (
                    displayedBots.map((bot, key) => (
                        <div className="userBox" key={key}>
                            <div className="userFrame" style={{ backgroundImage: "url('/bots/bot_panel.png')" }}>
                                <div className="userImg">
                                    <img src={`./bots/${bot.img}`} alt={bot.name} />
                                </div>
                            </div>
                            <div className="userName">{bot.name}</div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
});

export default LevelWaiting;
