import './App.css'
import { ReactNode } from 'react'
import { useContext, createContext } from 'react'
import { ConfigProvider } from 'antd'
import { MainTheme } from '@orb_UI/antd/ThemeConfigs.ts'
import { Editor } from '@orb_Editor'
import { MenuBar, Inspector, Overlay } from './editor/EditorComponents'

export const EditorContext = createContext<Editor>({} as any)
export const useEditor = () => useContext(EditorContext);

type EditorComponent = React.FC<{ editor: any, children: ReactNode }>
const EditorProvider: EditorComponent = ({ editor, children }) => { return <EditorContext.Provider value={editor} children={children} /> }

const editor = new Editor();

const initScene = async () => {
    const { Box } = await import("@orb_tools/create/Primitive");
    const { loadEnvironmentSample } = await import("@orb_utils/Samples.ts");
    editor.setControlsTarget(editor.addObject(Box()))
    loadEnvironmentSample('city').then((o) => o && editor.setEnvironment(o.data))
}
initScene();

function App() {

    return (
        <EditorProvider editor={editor}>
            <ConfigProvider theme={MainTheme}>
                <div style={{ display: "flex", flexWrap: "wrap", height: "100vh", width: "100vw", overflow: "hidden" }}>
                    <MenuBar />
                    <Inspector />
                    <Overlay />
                </div>
            </ConfigProvider>
        </EditorProvider>
    )
}

export default App
