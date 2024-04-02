import { useStores } from "../../App"
import * as THREE from 'three'
import { useEffect, useRef, useState } from "react"
import { ThreeEvent } from "@react-three/fiber"
import { GUI } from "dat.gui"
import { Pane } from 'tweakpane';

export class EditorObject {
    component: THREE.Object3D | null = null;
    pane: Pane = new Pane();
    paneDisposed: boolean = false;
    testNumber: number = 0;
    // gui: GUI = new GUI();
    
    constructor(component?: THREE.Object3D)
    {
        this.component = component ? component : null;
        // this.gui.hide();
        this.pane.hidden = true;
    }
    
    buildGUI() {
        console.log("building")
        // "refresh"
        this.destroyGUI();
        this.paneDisposed = false;
        this.pane = new Pane();
        this.pane.hidden = false;
        const PARAMS = {
            position: {x: this.component?.position.x as number, y: this.component?.position.y as number, z: this.component?.position.z as number},
            number: this.testNumber
        };
        this.pane.addBinding(PARAMS, 'position').on('change', (ev) => {
            this.component?.position.set(ev.value.x, ev.value.y, ev.value.z);
            console.log(ev);
        });
        // this.pane.addBinding(PARAMS, 'number').on();
        // console.log("binding....")
        console.log("this.testNumber:", this.testNumber);
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
    const [selected, setSelected] = useState(false);
    const {setControlsTarget} = useStores();
    const ref = useRef(null!);

    // [verify!] primitive seems rather dangerous considering its a manual dispose, better solution for this?
    // does it auto dispose? needs testing!
    return (
        <>
            <primitive
                ref={ref}
                key={node.component?.id}
                object={node.component}
                onClick={(e: ThreeEvent<MouseEvent>) => {e.stopPropagation(), setSelected(true), node.buildGUI(), setControlsTarget(e.object)}}
                onPointerMissed={(e: ThreeEvent<MouseEvent>) => {e.stopPropagation(), node.destroyGUI(), setSelected(false)}}
                onPointerOver={(e: ThreeEvent<MouseEvent>) => (e.stopPropagation(), setHovered(true))}
                onPointerOut={() => (setHovered(false))} 
            />
        </>
    )
}
