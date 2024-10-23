import './App.css'
import { ReactNode } from 'react'
import { useContext, createContext } from 'react'
import { ConfigProvider } from 'antd'
import { MainTheme } from '@orb_UI/antd/ThemeConfigs.ts'
import { Editor } from '@orb_Editor'
import { MenuBar, Inspector, Panels } from './editor/EditorComponents'

export const StoreContext = createContext<Editor>({} as any)
export const useStores = () => useContext(StoreContext)

type StoreComponent = React.FC<{ store: any, children: ReactNode }>
const StoreProvider: StoreComponent = ({ store, children }) => { return <StoreContext.Provider value={store} children={children} /> }

const session = new Editor();
const initScene = async () => {
    const { Box } = await import("@orb_tools/create/Primitive");
    const { loadEnvironmentSample } = await import("@orb_utils/Samples.ts");
    session.setControlsTarget(session.addObject(Box()))
    loadEnvironmentSample('city').then((o) => o && session.setEnvironment(o.data))
}
initScene();

function App() {

    return (
        <StoreProvider store={session}>
            <ConfigProvider theme={MainTheme}>
                <div style={{ display: "flex", flexWrap: "wrap", height: "100vh", width: "100vw", overflow: "hidden" }}>
                    <MenuBar />
                    <Inspector />
                    <Panels />
                </div>
            </ConfigProvider>
        </StoreProvider>
    )
}

export default App
