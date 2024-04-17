// import { Document, NodeIO } from '@gltf-transform/core';
// import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
// import draco3d from 'draco3dgltf';
// 
// Configure I/O.
// export const io = new NodeIO()
    // .registerExtensions(ALL_EXTENSIONS)
    // .registerDependencies({
        // 'draco3d.decoder': await draco3d.createDecoderModule(),
        // 'draco3d.encoder': await draco3d.createEncoderModule(),
    // });
// 
// Read from URL.
// const document = await io.read('path/to/model.glb');
// 
// Write to byte array (Uint8Array).
// const glb = await io.writeBinary(document);