import { ReactNode, StrictMode } from 'react'
import './App.css'
import { Editor } from './editor/Editor.tsx'
import { EditorScene } from './editor/EditorScene.tsx'

import { useContext,createContext } from 'react'
import { AppStore } from './store/appStore.ts'


export const StoreContext = createContext<AppStore>({} as any)
export const useStores = ()=>useContext(StoreContext)

type StoreComponent = React.FC<{store:any,children:ReactNode}>

const StoreProvider:StoreComponent = ({store,children})=>{
    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    )
}

function App() {
  
    return (
        <>
        <StoreProvider store={new AppStore()}>
            {/* <Editor/>     */}
            <EditorScene />
        </StoreProvider>
        </>
    )
}

export default App
