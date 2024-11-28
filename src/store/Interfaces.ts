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