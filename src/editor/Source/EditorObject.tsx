import { useStores } from "../../App"
import * as THREE from 'three'
import { useRef, useState } from "react"
import { ThreeEvent } from "@react-three/fiber"
import { Pane } from 'tweakpane';
import { AppStore } from "../../store/appStore";

export class EditorObject {
    component: THREE.Object3D | null = null;
    pane: Pane = new Pane();
    paneDisposed: boolean = false;
    testNumber: number = 0;
    // gui: GUI = new GUI();
    
    constructor(component?: THREE.Object3D, name?: string)
    {
        this.component = component ? component : null;
        if(name)
            this.component!.name = name;
        this.pane.hidden = true;
    }
    
    buildGUI(object: THREE.Object3D) {
        
        if(!object) {
            if(!this.component) return false;
            object = this.component;
        };
        // "refresh"
        this.destroyGUI();
        this.paneDisposed = false;
        this.pane = new Pane();
        this.pane.hidden = false;

        const PARAMS = {
            position: {x: object.position.x as number, y: object.position.y as number, z: object.position.z as number},
            rotation: {x: object.rotation.x as number, y: object.rotation.y as number, z: object.position.z as number},
            scale: {x: object.scale.x as number, y: object.scale.y as number, z: object.scale.z as number},
            type: object.type as string,
            name: object.name as string,
            visible: object.visible as boolean,
            castShadow: object.castShadow as boolean,
            receiveShadow: object.receiveShadow as boolean,
            renderOrder: object.renderOrder as number,
            parent: object.parent as THREE.Object3D
        };

        this.pane.addBinding(PARAMS, 'type', {label: "Type", readonly:true});
        
        this.pane.addBinding(PARAMS, 'name', {label: "Name"}).on('change', (ev) => {
            object.name = ev.value;
        });

        this.pane.addBinding(PARAMS, 'position', {label: "Position"}).on('change', (ev) => {
            object.position.set(ev.value.x, ev.value.y, ev.value.z);
        });

        this.pane.addBinding(PARAMS, 'rotation', {label: "Rotation"}).on('change', (ev) => {
            object.rotation.set(ev.value.x, ev.value.y, ev.value.z);
        });

        this.pane.addBinding(PARAMS, 'scale', {label: "Scale"}).on('change', (ev) => {
            object.scale.set(ev.value.x, ev.value.y, ev.value.z);
        });

        this.pane.addBinding(PARAMS, 'visible', {label: "Visible"}).on('change', (ev) => {
            object.visible = ev.value;
        });

        this.pane.addBinding(PARAMS, 'castShadow', {label: "Cast Shadow"}).on('change', (ev) => {
            object.castShadow = ev.value;
        });

        this.pane.addBinding(PARAMS, 'receiveShadow', {label: "Receive Shadow"}).on('change', (ev) => {
            object.receiveShadow = ev.value;
        });
        
        this.pane.addBinding(PARAMS, 'renderOrder', {step: 1, label: "Render Order"}).on('change', (ev) => {
            object.renderOrder = ev.value;
        });

        // const hierarchy  = this.pane.addFolder({title:"Hierarchy "})
        // hierarchy.addButton({title:"Select Parent", disabled: object.parent == null || !(object.parent instanceof THREE.Scene)}).on("click", () => {
            // console.log(object, "parent for it:", object.parent);
            // if(object.parent)
                // AppStore.Instance.setControlsTarget(object.parent);
        // });
        // if(object.parent && !(object.parent instanceof THREE.Scene))
            // 
        // object.children.map((child, number) => {
            // hierarchy.addButton({title:"Select Child #" + number}).on("click", () => {
                // if(child)
                    // AppStore.Instance.setControlsTarget(child);
            // });
// 
        // })
    }

    destroyGUI() {

        if(this.paneDisposed) return;
        this.pane.dispose();
        this.paneDisposed = true;
    }
    
    // The renderer to directly modify the selected component, maybe super call?
    renderGUI() {
        return (
            <p style={{position:"absolute", right:"0"}}>{this.component?.id}</p>
        )
    }



    render() {
        return this.component && <EditorObjectNode node={this} />;
    }
}

export const EditorObjectNode:React.FC<{node: EditorObject}> = ({node}) => {
    const [hovered, setHovered] = useState(false);
    const {setControlsTarget} = useStores();
    const ref = useRef(null!);

    // [verify!] primitive seems rather dangerous considering its a manual dispose, better solution for this?
    // does it auto dispose? needs testing!
    return (
        <>
            {
                node.component &&
                <primitive
                    ref={ref}
                    key={node.component?.id}
                    object={node.component}
                    onClick={(e: ThreeEvent<MouseEvent>) => {e.stopPropagation(), node.buildGUI(), setControlsTarget(e.object)}}
                    onPointerMissed={(e: ThreeEvent<MouseEvent>) => {e.stopPropagation(), node.destroyGUI()}}
                    onPointerOver={(e: ThreeEvent<MouseEvent>) => (e.stopPropagation(), setHovered(true))}
                    onPointerOut={() => (setHovered(false))} 
                />
            }
        </>
    )
}
