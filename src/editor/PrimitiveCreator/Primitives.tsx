import * as THREE from 'three';
import { Box, Cylinder, Plane, Sphere, useCursor } from '@react-three/drei';
import { useState } from 'react';
import { useStores } from '../../App';
import { GLTFExporter } from 'three/examples/jsm/Addons.js';


export const AddCube = () => {
    const {setControlsTarget, pushPrimitive, sceneComponents} = useStores()
    const [hovered, setHovered] = useState(false)
    const createNewBox = () => {
        const newBox = <Box 
            key={sceneComponents.length}
            material={new THREE.MeshStandardMaterial()}
            onClick={(e) => {
                e.stopPropagation()
                setControlsTarget(e.object)
            }}
            onPointerMissed={(e) => {
                e.stopPropagation()
            }}
            onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
            onPointerOut={() => (setHovered(false))}
            />
        pushPrimitive(newBox)
    }
    
    useCursor(hovered)
    
    return (<button onClick={createNewBox}>Cube</button>)
}

export const AddSphere = () => {
    const {setControlsTarget, pushPrimitive} = useStores()
    const [hovered, setHovered] = useState(false)

    const createNewBox = () => {
        const newBox =
                <Sphere 
                material={new THREE.MeshStandardMaterial()}
                position={[0, 0, 0]}
                onClick={(e) => {
                    e.stopPropagation()
                    setControlsTarget(e.object)
                }}
                onPointerMissed={(e) => {
                    e.stopPropagation()
                }}
                onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
                onPointerOut={() => (setHovered(false))}
                />
            
            pushPrimitive(newBox)
    }
    useCursor(hovered)
    
    return (<button onClick={createNewBox}>Sphere</button>)
}

export const AddCylinder = () => {
    const {setControlsTarget, pushPrimitive} = useStores()
    const [hovered, setHovered] = useState(false)

    const createNewCylinder = () => {
        const newCylinder =
                <Cylinder 
                material={new THREE.MeshStandardMaterial()}
                position={[0, 0, 0]}
                onClick={(e) => {
                    e.stopPropagation()
                    setControlsTarget(e.object)
                }}
                onPointerMissed={(e) => {
                    e.stopPropagation()
                }}
                onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
                onPointerOut={() => (setHovered(false))}
                />
            
            pushPrimitive(newCylinder)
    }
    useCursor(hovered)
    
    return (<button onClick={createNewCylinder}>Cylinder</button>)
}

export const AddPlane = () => {
    const {setControlsTarget, pushPrimitive} = useStores()
    const [hovered, setHovered] = useState(false)

    const createNewPlane = () => {
        const newPlane =
                <Plane 
                material={new THREE.MeshStandardMaterial()}
                position={[0, 0, 0]}
                onClick={(e) => {
                    e.stopPropagation()
                    setControlsTarget(e.object)
                }}
                onPointerMissed={(e) => {
                    e.stopPropagation()
                }}
                onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
                onPointerOut={() => (setHovered(false))}
                />
            
            pushPrimitive(newPlane)
    }
    useCursor(hovered)
    
    return (<button onClick={createNewPlane}>Plane</button>)
}

export const Exporter = () => {
        const {controlsObject3D} = useStores()
        const doExport = (binary : boolean = true) => {
            const exporter = new GLTFExporter();
            const object = controlsObject3D;
            exporter.parse(
                object,
                (gltf: any) => {
                    // glb
                    if(gltf instanceof ArrayBuffer)
                    {
                        const link = document.createElement( 'a' );
                        // workaround for firefox
			            link.style.display = 'none';
			            document.body.appendChild( link );
                        link.href = URL.createObjectURL( new Blob( [ gltf ], { type: 'application/octet-stream' } ) );
				        link.download = 'export.glb';
				        link.click();
                    }
                    // gltf
                    else
                    {
                        const json = JSON.stringify(gltf, null, 2);
                        const blob = new Blob([json], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'export.gltf';
                        a.click();
                        URL.revokeObjectURL(url);
                    }
                },
                function ( error ) {
            
                    console.log( 'An error happened' );
            
                },
                {binary: binary}
            );
        }
    return <button onClick={() => doExport(true)}>Exporter</button>
}