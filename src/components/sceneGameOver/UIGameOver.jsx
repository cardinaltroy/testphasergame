import engineStore from '../../store/engineStore';
import './UIGameOver.scss';

const UIGameOver = () => {
    const play = () => {
        engineStore.setScene('sceneGame')
        engineStore.userDrop()
    }
    return (
        <div className="UI GameOver">
            <div className="overTitle">YOU WIN!!!</div>
            <div className="overButton" onClick={play}>PLAY<br/>AGAIN</div>
            <div className="overTitle">WANT TRY AGAIN?</div>
        </div>
    );
};

export default UIGameOver;