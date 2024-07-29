import * as TYPES from '../store/type'
import { useStores } from '@orb_App';
import { observer } from 'mobx-react-lite';
import { MenuBar } from './ui/Menubar';
import { ControlsBar } from './ui/ControlsBar';
import { Object3D } from 'three';
import { useHotkeys } from 'react-hotkeys-hook';

let environment = 0;

export const EditorUI = observer(() => {
    const { setEnvironment, setControlsTarget, intersectedObjects, controlsObject3D } = useStores()

    useHotkeys("e", () => { setEnvironment(++environment >= TYPES.environments.length ? (environment = 0) : environment); })
    
    document.body.onmouseup = function (e) {
        if (intersectedObjects?.length) {
            setControlsTarget(intersectedObjects[0]);
        }
    }

    return (
        <div style={{ zIndex: 1 }}>
            <MenuBar />
            <ControlsBar />
        </div>
    )
})

export default EditorUI