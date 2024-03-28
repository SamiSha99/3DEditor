import { useStores } from '../App';
import { observer } from 'mobx-react-lite';
import { CreateDropDown, FileDropDown } from './UIComponents/Dropdowns';
let mode = 0;
let space = 0;


export const EditorUI = observer(() => {
    const {controlsSpace, setControlsMode, setControlSpace, controlsObject3D} = useStores()
    document.body.onkeyup = function(e) {
        if(e.key == " "|| e.code == "Space" || e.keyCode == 32) 
            setControlsMode(++mode >= 3 ? (mode = 0) : mode)
        console.log(controlsObject3D);
    }
    return (
        <div style={{position:'absolute', zIndex:2}}>
            <FileDropDown />
            <CreateDropDown />
            <button onClick={() => setControlSpace(++space >= 2 ? (space = 0) : space)}>{controlsSpace.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())}</button>
        </div>
    )
})

export default EditorUI