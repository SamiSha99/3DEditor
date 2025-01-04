import './App.css'
import { ConfigProvider } from 'antd'
import { MainTheme } from '@orb_UI/antd/ThemeConfigs.ts'
import { Editor } from '@orb_Editor'
import { MenuBar, Inspector } from './editor/EditorComponents'
import { EditorProvider, ViewportProvider } from './store/Providers'
import { geometryVertexPositionToText } from '@orb_utils/Mesh'
import * as THREE from 'three';

const editor = new Editor();

const initScene = async () => {
    const { Box } = await import("@orb_tools/create/Primitive");
    const { loadEnvironmentSample } = await import("@orb_utils/Samples.ts");
    const box = editor.addObject(Box());

    loadEnvironmentSample('city').then((o) => o && editor.setEnvironment(o.data))
    editor.viewport.setTarget(box);
    const group = geometryVertexPositionToText((box as THREE.Mesh).geometry)
    group && editor.addObject(group);
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
