
import { ItemCollapse, ItemNumber } from "@orb_UI/controller/ControllerItems";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import * as THREE from 'three'

export const InspectorGeometry: React.FC<{ buffergeometry: THREE.BufferGeometry }> = observer(({ buffergeometry }) => {
    const [geometry, setGeometry] = useState(buffergeometry);

    return (
        <>
            <ItemCollapse label={"Object3D"}>
                to-do add geometry here
            </ItemCollapse>
        </>
    );
})