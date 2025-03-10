import * as THREE from 'three';

export interface IModelFileResponse {
    fileName: string;
    fileUrl: string;
    fileThumbnail: string;
    fileUrlAndroid: string;
    metadata: IModelFileMetadata; // Holds metadata for the USDZ file.
    metadataAndroid: IModelFileMetadata; // Holds metadata for the GLB file.
    metadataThumbnail: IModelFileMetadata;
    settings: I3DFileSettings | null;
}

export interface IModelFileMetadata {
    displayName: string;
    saveName: string;
    type: FilesCategory; // This is gonna be "Models"
    fileType: string;
    uploadDate: string;
    folder: string;
}

export enum FilesCategory {
    VIDEOS = "Videos",
    IMAGES = "Images",
    AUDIOS = "Audios",
    MODELS = "Models",
    ZIPS = "ZIPS"
}

export interface I3DFileSettings {
    allowUserGestures: boolean
    size: number
    scaleAxis: number
    addToAnalytics: boolean
}

// Every material implements these differently, so we make sure to constraint it for typescript sake.
export interface Alpha { material: THREE.MeshStandardMaterial | THREE.MeshBasicMaterial | THREE.MeshPhongMaterial | THREE.MeshToonMaterial | THREE.MeshDepthMaterial | THREE.MeshLambertMaterial | THREE.MeshMatcapMaterial }
export interface AmbientOcclusion { material: THREE.MeshStandardMaterial | THREE.MeshPhongMaterial | THREE.MeshToonMaterial | THREE.MeshBasicMaterial }
export interface Bump { material: THREE.MeshStandardMaterial | THREE.MeshPhongMaterial | THREE.MeshToonMaterial | THREE.MeshLambertMaterial | THREE.MeshMatcapMaterial | THREE.MeshNormalMaterial }
export interface Displacement { material: THREE.MeshStandardMaterial | THREE.MeshPhongMaterial | THREE.MeshToonMaterial | THREE.MeshDepthMaterial | THREE.MeshLambertMaterial | THREE.MeshMatcapMaterial | THREE.MeshNormalMaterial }
export interface Emissive { material: THREE.MeshStandardMaterial | THREE.MeshLambertMaterial | THREE.MeshPhongMaterial | THREE.MeshToonMaterial }
export interface Environment { material: THREE.MeshStandardMaterial | THREE.MeshBasicMaterial | THREE.MeshPhongMaterial | THREE.MeshLambertMaterial }
export interface Light { material: THREE.MeshStandardMaterial | THREE.MeshBasicMaterial | THREE.MeshPhongMaterial | THREE.MeshToonMaterial | THREE.MeshLambertMaterial }
export interface Normal { material: THREE.MeshStandardMaterial | THREE.MeshPhongMaterial | THREE.MeshMatcapMaterial | THREE.MeshNormalMaterial | THREE.MeshLambertMaterial | THREE.MeshToonMaterial }
export interface Roughness { material: THREE.MeshStandardMaterial }
export interface Specular { material: THREE.MeshBasicMaterial | THREE.MeshPhongMaterial | THREE.MeshLambertMaterial }
export interface Reflectivity { material: THREE.MeshPhongMaterial | THREE.MeshBasicMaterial }