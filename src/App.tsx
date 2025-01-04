import './App.css'
import { ConfigProvider } from 'antd'
import { MainTheme } from '@orb_UI/antd/ThemeConfigs.ts'
import { Editor } from '@orb_Editor'
import { MenuBar, Inspector } from './editor/EditorComponents'
import { EditorProvider, ViewportProvider } from './store/Providers'
import { geometryVertexPositionToText, mergeVertices } from '@orb_utils/Mesh'
import * as THREE from 'three';

const editor = new Editor();

const initScene = async () => {
    const { Torus } = await import("@orb_tools/create/Primitive");
    const { loadEnvironmentSample } = await import("@orb_utils/Samples.ts");
    const b = Torus();
    const box = editor.addObject(b);

    loadEnvironmentSample('city').then((o) => o && editor.setEnvironment(o.data))
    editor.viewport.setTarget(box);
    false && setTimeout(() => {
        (b.geometry as THREE.BufferGeometry) = mergeVertices(b.geometry);
        const group = geometryVertexPositionToText((box as THREE.Mesh).geometry)
        group && editor.addObject(group);
    }, 5000);
}
initScene();

function App() {

    return (
        <EditorProvider editor={editor}>
            <ViewportProvider viewport={editor.viewport}>
                <ConfigProvider theme={MainTheme}>
                    <div style={{ display: "flex", flexWrap: "wrap", height: "100vh", width: "100vw", overflow: "hidden" }}>
                        <MenuBar />
                        <Inspector />
                    </div>
                </ConfigProvider>
            </ViewportProvider>
        </EditorProvider>
    )
}

export default App
