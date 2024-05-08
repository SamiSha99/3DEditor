import { useStores } from '../App';
import { observer } from 'mobx-react-lite';
import { CreateDropDown, FileDropDown, AddDropDown } from './UIComponents/Dropdowns';
import * as TYPES from '../store/type'
import { convertObject, loadFileData, screenshot } from './WaelRequest';
import { save } from './Exporters';
import * as MESH_UTILS from './Utils/MeshUtils';
import { Checkbox } from 'antd';

let mode = 0;
let space = 0;
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
        <>        
            <div style={{}}>
                <FileDropDown />
                <CreateDropDown />
                <AddDropDown />
                <button onClick={() => setControlSpace(++space >= TYPES.transformSpaces.length ? (space = 0) : space)}>{controlsSpace.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())}</button>
                <Checkbox checked={useRootSelection} onChange={(e) => {
                    setRootSelection(e.target.checked);
                }}></Checkbox>
                <button onClick={() => {
                    const input = document.createElement('input');
                    input.type = "file";
                    input.style.display = "none";
                    input.click();
                    input.onchange = (e => {
                        const file = ((e as any as React.ChangeEvent<HTMLInputElement>).target.files as FileList)[0];
                        file.text().then(value => {
                            console.log("inside success!");
                            loadFileData(value,".glb").then(result => {
                                console.log("result:", result);
                                if(!result) return;
                                MESH_UTILS.computeAllVertexNormals(result);
                                screenshot(result, blob => {
                                    if(blob)
                                        save(blob, "screenshot.png");
                                    setTimeout(() => {
                                        convertObject(result, ".glb").then(file => {
                                            if(file)
                                                save(new Blob([file], {type: 'application/octet-stream'}), "export.obj");
                                        });
                                    }, 1000);
                                });
                                // const eo =  new EditorObject(result);
                                pushComponentToScene(result);
                            });
                        });
                    })
                }}>
                    Convert Test</button>
            </div>
        </>
    )
})

export default EditorUI