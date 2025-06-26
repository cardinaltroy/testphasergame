import { observer } from 'mobx-react-lite';
import engineStore from '../../store/engineStore';
import './UIMenu.scss';

const UIMenu = observer(() => {
    const play = (C, R) => {
        engineStore.setDifficult(C, R)
        engineStore.setScene('sceneGame')
        engineStore.userDrop()
    }
    return (
        <div className="UI Menu">
            <div className="menuDiff" style={{
                backgroundImage: "url('/win_bg_info.png')",
            }}>
                <div className="boxTitle">LEVELS</div>
                <div className="boxItems">
                    <div className='btnSelect' style={{ backgroundImage: "url('/but_red_down.png')" }}
                        onClick={() => play(4, 10)} >1 Level <br />(C:4, R:10)</div>

                    <div className='btnSelect' style={{ backgroundImage: "url('/but_red_down.png')" }}
                        onClick={() => play(4, 50)}>2 Level <br />(C:4, R:50)</div>
                    <div className='btnSelect' style={{ backgroundImage: "url('/but_red_down.png')" }}
                        onClick={() => play(4, 100)}>3 Level <br />(C:4, R:100)</div>

                    <div className='btnSelect' style={{ backgroundImage: "url('/but_red_down.png')" }}
                        onClick={() => play(6, 10)}>4 Level <br />(C:6, R:10)</div>
                    <div className='btnSelect' style={{ backgroundImage: "url('/but_red_down.png')" }}
                        onClick={() => play(6, 50)}>5 Level <br />(C:6, R:50)</div>
                    <div className='btnSelect' style={{ backgroundImage: "url('/but_red_down.png')" }}
                        onClick={() => play(6, 100)}>6 Level <br />(C:6, R:100)</div>

                    <div className='btnSelect' style={{ backgroundImage: "url('/but_red_down.png')" }}
                        onClick={() => play(8, 20)}>7 Level <br />(C:8, R:20)</div>
                    <div className='btnSelect' style={{ backgroundImage: "url('/but_red_down.png')" }}
                        onClick={() => play(8, 50)}>8 Level <br />(C:8, R:50)</div>
                    <div className='btnSelect' style={{ backgroundImage: "url('/but_red_down.png')" }}
                        onClick={() => play(8, 100)}>9 Level <br />(C:8, R:100)</div>

                    <div className='btnSelect' style={{ backgroundImage: "url('/but_red_down.png')" }}
                        onClick={() => play(13, 20)}>10 Level <br />(C:13, R:20)</div>
                    <div className='btnSelect' style={{ backgroundImage: "url('/but_red_down.png')" }}
                        onClick={() => play(13, 50)}>11 Level <br />(C:13, R:50)</div>
                    <div className='btnSelect' style={{ backgroundImage: "url('/but_red_down.png')" }}
                        onClick={() => play(13, 100)}>12 Level <br />(C:13, R:100)</div>
                </div>

            </div>
        </div>
    );
});

export default UIMenu;