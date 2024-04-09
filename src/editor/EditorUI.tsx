import { useStores } from '../App';
import { observer } from 'mobx-react-lite';
import { CreateDropDown, FileDropDown } from './UIComponents/Dropdowns';
import * as TYPES from '../store/type'
import { doConversion } from './Converters';

let mode = 0;
let space = 0;
let environment = 0;

export const EditorUI = observer(() => {
    const {controlsSpace, setControlsMode, setControlSpace, setEnvironment, controlsTarget, objects} = useStores()
    
    document.body.onkeyup = function(e) {
        if(document.activeElement?.tagName?.toLowerCase() != "body") return;
        if(e.key == " "|| e.code == "Space" || e.keyCode == 32) 
            setControlsMode(++mode > TYPES.transformSpaces.length ? (mode = 0) : mode)
        if(e.key.toUpperCase() == "E" || e.code == "KeyE")
            setEnvironment(++environment >= TYPES.environments.length ? (environment = 0) : environment);
    }
    return (
        <>
            <div style={{position:'absolute', zIndex:2}}>
                <FileDropDown />
                <CreateDropDown />
                <button onClick={() => setControlSpace(++space >= TYPES.transformSpaces.length ? (space = 0) : space)}>{controlsSpace.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())}</button>
                <button onClick={() => doConversion("gltf")}>Convert Test</button>
            </div>
            {objects.map((value) => (
                value.component?.id == controlsTarget && value.renderGUI()
            ))} 
        </>
    )
})

export default EditorUI