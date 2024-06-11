import * as THREE from 'three';

export const test = {}

export function LevaMesh(o: THREE.Object3D | undefined) {
    return {
        name: {
            value: o ? o.name : '',
            onChange: (value: string) => { if(o) o.name = value }
        },
        visible: true,
        position: (o ? [o.position.x, o.position.y, o.position.z] : [0, 0, 0]) as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number]
    }
}

export default LevaMesh