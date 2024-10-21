// For pmndrs/assets repo
import * as THREE from 'three';
import { Environments } from '@orb_types';

const sample = ({
    none: null,
    apartment: await import('@pmndrs/assets/hdri/apartment.exr'),
    bridge: await import('@pmndrs/assets/hdri/bridge.exr'),
    city: await import('@pmndrs/assets/hdri/city.exr'),
    dawn: await import('@pmndrs/assets/hdri/dawn.exr'),
    esplanade: await import('@pmndrs/assets/hdri/esplanade.exr'),
    forest: await import('@pmndrs/assets/hdri/forest.exr'),
    hall: await import('@pmndrs/assets/hdri/hall.exr'),
    lab: await import('@pmndrs/assets/hdri/lab.exr'),
    lobby: await import('@pmndrs/assets/hdri/lobby.exr'),
    night: await import('@pmndrs/assets/hdri/night.exr'),
    park: await import('@pmndrs/assets/hdri/park.exr'),
    sky: await import('@pmndrs/assets/hdri/sky.exr'),
    studio: await import('@pmndrs/assets/hdri/studio.exr'),
    sunrise: await import('@pmndrs/assets/hdri/sunrise.exr'),
    sunset: await import('@pmndrs/assets/hdri/sunset.exr'),
    venice: await import('@pmndrs/assets/hdri/venice.exr'),
    warehouse: await import('@pmndrs/assets/hdri/warehouse.exr'),
    workshop: await import('@pmndrs/assets/hdri/workshop.exr'),
} as { [environments: string]: any });

/** Loads an Environment data by a list of provided names */
export const loadEnvironmentSample = async (sampleName: Environments) => {
    if (!sampleName) return;

    const s = sample[sampleName];

    const { EXRLoader } = await import('three/examples/jsm/Addons');
    return new EXRLoader().loadAsync(s.default).then((texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        texture.needsUpdate = true
        return { name: sampleName, data: texture } as { name: string, data: THREE.DataTexture };
    });
}

export const createRoomEnvironment = async () => {
    const canvas = THREE.createCanvasElement();
    canvas.height = 512;
    canvas.width = 512;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(512, 512);
    const pmremGen = new THREE.PMREMGenerator(renderer);
    const { RoomEnvironment } = await import('three/examples/jsm/Addons.js')
    const environmentTexture = pmremGen.fromScene(new RoomEnvironment(), 0.5).texture;
    return environmentTexture;
}