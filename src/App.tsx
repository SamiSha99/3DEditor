import './App.css'
import { App as AntdApp, ConfigProvider } from 'antd'
import { MainTheme } from '@orb_UI/antd/ThemeConfigs.ts'
import { Editor } from '@orb_Editor'
import { EditorProvider, ViewportProvider } from './store/Providers'
import Menubar from './editor/MenuBar'
import Inspector from './editor/Inspector'
import { setMessage } from '@orb_utils/Message'

const editor = new Editor();

const MessageBinder = () => {
    setMessage(AntdApp.useApp().message);
    return null;
}

function App() {
    return (
        <EditorProvider editor={editor}>
            <ViewportProvider viewport={editor.viewport}>
                <ConfigProvider theme={MainTheme}>
                    <AntdApp component={false}>
                        <MessageBinder />
                        <div style={{ display: "flex", flexWrap: "wrap", height: "100vh", width: "100vw", overflow: "hidden" }}>
                            <Menubar />
                            <Inspector />
                        </div>
                    </AntdApp>
                </ConfigProvider>
            </ViewportProvider>
        </EditorProvider>
    )
}

export default App
