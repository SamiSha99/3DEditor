import { Box, Plane, Cylinder, Sphere } from './MeshCreator/Primitives'
import { Exporter, ExporterUSDZ } from './Exporters';
import { useStores } from '../App';
import { observer } from 'mobx-react-lite';
let mode = 0;
let space = 0;


export const EditorUI = observer(() => {
    const {controlsSpace, setControlsMode, setControlSpace} = useStores()
    document.body.onkeyup = function(e) {
        if(e.key == " "|| e.code == "Space" || e.keyCode == 32) 
            setControlsMode(++mode >= 3 ? (mode = 0) : mode)
    }
    return (
        <div style={{position:'absolute', zIndex:2}}>
            <Box />
            <Sphere />
            <Cylinder />
            <Plane />
            <button onClick={() => setControlSpace(++space >= 2 ? (space = 0) : space)}>{controlsSpace.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())}</button>
            <Exporter />
            <ExporterUSDZ />
        </div>
    )
})

export default EditorUI