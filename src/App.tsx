import './App.css'
import { ConfigProvider } from 'antd'
import { MainTheme } from '@orb_UI/antd/ThemeConfigs.ts'
import { Editor } from '@orb_Editor'
import { EditorProvider, ViewportProvider } from './store/Providers'
import Menubar from './editor/Menubar'
import Inspector from './editor/Inspector'

const editor = new Editor();

function App() {
    return (
        <EditorProvider editor={editor}>
            <ViewportProvider viewport={editor.viewport}>
                <ConfigProvider theme={MainTheme}>
                    <div style={{ display: "flex", flexWrap: "wrap", height: "100vh", width: "100vw", overflow: "hidden" }}>
                        <Menubar />
                        <Inspector />
                    </div>
                </ConfigProvider>
            </ViewportProvider>
        </EditorProvider>
    )
}

export default App
