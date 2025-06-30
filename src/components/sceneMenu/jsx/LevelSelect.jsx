import botsStore from "../../../store/botsStore";
import engineStore from "../../../store/engineStore";

const LevelSelect = () => {

    const play = (cards, random) => { // Cards(4-13), Random (1-100)
        engineStore.setDifficult(cards, random)
        botsStore.initNextRound();
    }
    return (
        <>
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
        </>
    );
};

export default LevelSelect;