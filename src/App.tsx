import { ReactNode } from 'react'
import './App.css'
import { useContext, createContext } from 'react'
import { AppStore } from '@orb_AppStore'
import Editor from './editor/Editor.tsx'
import { ConfigProvider } from 'antd'
import { MainTheme } from '@orb_UI/antd/ThemeConfigs.ts'

export const StoreContext = createContext<AppStore>({} as any)
export const useStores = () => useContext(StoreContext)

type StoreComponent = React.FC<{ store: any, children: ReactNode }>

const StoreProvider: StoreComponent = ({ store, children }) => {
    return (
        <StoreContext.Provider value={store} children={children} />
    )
}

const session = new AppStore();
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
                <Editor />
            </ConfigProvider>
        </StoreProvider>
    )
}

export default App
