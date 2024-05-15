import * as TYPES from '../store/type'
import { useStores } from '@orb_App';
import { observer } from 'mobx-react-lite';
import { Checkbox } from 'antd';
import { MenuBar } from './ui/Menubar';
import { ControlsBar } from './ui/ControlsBar';

let mode = 0;

let environment = 0;

export const EditorUI = observer(() => {
    const {controlsSpace, setControlsMode, setControlSpace, 
        setEnvironment, pushComponentToScene, 
        setControlsTarget, intersectedObjects, useRootSelection, setRootSelection} = useStores()
    
    document.body.onkeyup = function(e) {
        if(document.activeElement?.tagName?.toLowerCase() != "body") return;
        if(e.key == " "|| e.code == "Space") 
            setControlsMode(++mode > TYPES.transformSpaces.length ? (mode = 0) : mode)
        if(e.key.toUpperCase() == "E" || e.code == "KeyE")
            setEnvironment(++environment >= TYPES.environments.length ? (environment = 0) : environment);
    }
    
    document.body.onmouseup = function(e) {
        if(intersectedObjects?.length) {
            setControlsTarget(intersectedObjects[0]);
        }
    }

    return (
        <div style={{zIndex:1}}>        
            <MenuBar />
            <ControlsBar />
        </div>
    )
})

export default EditorUI