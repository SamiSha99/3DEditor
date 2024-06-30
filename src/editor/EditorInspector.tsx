import { useStores } from "@orb_App";
import { observer } from "mobx-react-lite";
import { createContext, useMemo } from "react";
import * as THREE from "three"


export const EditorInspector = observer(() => {
    // @ts-ignore
    const { sceneObjects, scene, onUpdateInspector} = useStores();
    const HierarchyContext = createContext(sceneObjects);
    
    let hierarchy = sceneObjects?.map((child) => <ObjectElement object={child} />);
    
    useMemo(() => {
        hierarchy = sceneObjects?.map((child) => <ObjectElement object={child} />);
        console.log("main memo updated");
    }, [sceneObjects, scene.children])
    
    return (
        <div style={{ backgroundColor: "red", flex: "15%" }}>
            <HierarchyContext.Provider value={sceneObjects}>
                {hierarchy}
            </HierarchyContext.Provider>
        </div>
    )
})

export const ObjectElement: React.FC<{ object: THREE.Object3D }> = ({ object }) => {
    let hierarchy = object.children?.map((child) => <ObjectElement object={child} />);
    useMemo(() => {
        hierarchy = object.children?.map((child) => <ObjectElement object={child} />);
    }, [hierarchy, object, object.children])
    return (
        <div>
            {object.name}
            {hierarchy}
        </div>
    )
}

export default EditorInspector