import './App.css'
import { ConfigProvider } from 'antd'
import { MainTheme } from '@orb_UI/antd/ThemeConfigs.ts'
import { Editor } from '@orb_Editor'
import { MenuBar, Inspector } from './editor/EditorComponents'
import { EditorProvider, ViewportProvider } from './store/Providers'
import { geometryPositionToText, mergeVertices } from '@orb_utils/Mesh';
import * as THREE from 'three';

const editor = new Editor();

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
