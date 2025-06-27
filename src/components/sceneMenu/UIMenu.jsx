import { observer } from 'mobx-react-lite';
import './UIMenu.scss';
import LevelSelect from './jsx/LevelSelect';
import { useState } from 'react';
import LevelWaiting from './jsx/LevelWaiting';

const UIMenu = observer(() => {
    const [isWaiting, setWaiting] = useState(false); // false or { C, R }

    return (
        <div className="UI Menu">
            <div className="menuDiff" style={{
                backgroundImage: "url('/win_bg_info.png')",
            }}>
                {isWaiting
                    ? <LevelWaiting level={isWaiting} />
                    : <LevelSelect setWaiting={setWaiting} />
                }
            </div>
        </div>
    );
});

export default UIMenu;