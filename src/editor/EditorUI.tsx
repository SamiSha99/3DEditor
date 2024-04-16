import { useStores } from '../App';
import { observer } from 'mobx-react-lite';
import { CreateDropDown, FileDropDown } from './UIComponents/Dropdowns';
import * as TYPES from '../store/type'
import { importThenConvert } from './Converters';
import { convertObject, loadFileData, screenshot } from './WaelRequest';
import { EditorObject } from './Source/EditorObject';
import { doExportUSDZ, save } from './Exporters';
import { Mesh, MeshStandardMaterial, SRGBColorSpace, Texture } from 'three';
import * as THREE from 'three';

let mode = 0;
let space = 0;
let environment = 0;

export const EditorUI = observer(() => {
    const {controlsSpace, setControlsMode, setControlSpace, setEnvironment, controlsTarget, objects, pushComponentToScene} = useStores()
    
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
                <button onClick={() => {
                    const input = document.createElement('input');
                    input.type = "file";
                    // input.accept = ALLOWED_FORMAT_TYPES;
                    input.style.display = "none";
                    input.click();
                    input.onchange = (e => {
                        const file = ((e as any as React.ChangeEvent<HTMLInputElement>).target.files as FileList)[0];
                        file.arrayBuffer().then(value => {
                            console.log("inside success!");
                            loadFileData(value,".glb").then(result => {
                                console.log("result:", result);
                                if(!result) return;
                                screenshot(result, blob => {
                                    if(blob)
                                        save(blob, "screenshot.png");
                                    setTimeout(() => {
                                        convertObject(result, ".usdz").then(file => {
                                            if(file)
                                                save(new Blob([file], {type: 'application/octet-stream'}), "export.usdz");
                                        });
                                    }, 1000);
                                });
                                const eo =  new EditorObject(result);
                                pushComponentToScene(eo);
                            });
                        });
                    })
                    // importThenConvert(".obj")
                }}>
                    Convert Test</button>
            </div>
            {objects.map((value) => (
                value.component?.id == controlsTarget && value.renderGUI()
            ))} 
        </>
    )
})

export default EditorUI