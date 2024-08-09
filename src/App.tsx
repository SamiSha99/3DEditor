import { ReactNode } from 'react'
import './App.css'
import { useContext, createContext } from 'react'
import { AppStore } from '@orb_AppStore'
import Editor from './editor/Editor.tsx'
import { ConfigProvider, ThemeConfig, theme } from 'antd'

export const StoreContext = createContext<AppStore>({} as any)
export const useStores = () => useContext(StoreContext)

type StoreComponent = React.FC<{ store: any, children: ReactNode }>

const StoreProvider: StoreComponent = ({ store, children }) => {
    return (
        <StoreContext.Provider value={store} children={children} />
    )
}

const session = new AppStore();

const themeConfig: ThemeConfig = {
    algorithm: [theme.darkAlgorithm,],
    components: {
        Form: {
            itemMarginBottom: 0
        },
        InputNumber: {
            size: 10,
            inputFontSizeSM: 12,
            inputFontSize: 12,
            inputFontSizeLG: 12,
            paddingBlock: 2,
            colorBorder: "rgba(0, 0, 0, 0.02)"
        },
        Input: {
            size: 10,
            inputFontSizeSM: 12,
            inputFontSize: 12,
            inputFontSizeLG: 12,
            paddingBlock: 2,
            colorBorder: "rgba(0, 0, 0, 0.02)"
        },
        Select: {
            colorBorder: "rgba(0, 0, 0, 0.02)"
        },
        Button: {
            defaultBg: "#212121",
            defaultHoverBg: "#323232",
            defaultActiveBg: "#323232",
            colorBorder: "none",
        },
        Radio: {
            colorBorderSecondary: "none",
            colorPrimaryBorder: "none",
            buttonBg: "none",
            colorBorder: "rgb(0,0,0,0)",
        },
        Divider: {
            colorSplit: "rgb(255, 255, 255, 0.5)",
            lineWidth: 2,
            fontSize: 28
        },
        Tree: {

        }
    },
    token: {
        borderRadius: 0,
        borderRadiusSM: 0,
        borderRadiusLG: 0,
        borderRadiusOuter: 0,
        borderRadiusXS: 0,
        motion: false
    }
}

function App() {

    return (
        <StoreProvider store={session}>
            <ConfigProvider theme={themeConfig}>
                <Editor />
            </ConfigProvider>
        </StoreProvider>
    )
}

export default App
