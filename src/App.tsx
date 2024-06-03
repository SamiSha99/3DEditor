import { ReactNode } from 'react'
import './App.css'
import { useContext,createContext } from 'react'
import { AppStore } from '@orb_AppStore'
import Editor from './editor/Editor.tsx'

export const StoreContext = createContext<AppStore>({} as any)
export const useStores = ()=>useContext(StoreContext)

type StoreComponent = React.FC<{store:any,children:ReactNode}>

const StoreProvider:StoreComponent = ({store,children})=>{
    return (
        <StoreContext.Provider value={store} children={children} />
    )
}

let session = new AppStore();

function App() {
    
    return (
        <StoreProvider store={session}>
            <Editor/>
        </StoreProvider>
    )
}

export default App
