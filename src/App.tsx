import { ReactNode, useEffect } from 'react'
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

function App() {

    useEffect(()=>{
        console.log("@@@",window.location.search)
    },[])


    return (
        <StoreProvider store={session}>
            <ConfigProvider theme={MainTheme}>
                <Editor  />
            </ConfigProvider>
        </StoreProvider>
    )
}

export default App
