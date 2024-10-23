import { useEditor } from "@orb_Editor";
import { observer } from "mobx-react-lite";
import { ConfigProvider } from "antd";
import { PanelsThemeConfig } from "@orb_UI/antd/ThemeConfigs";


export const Overlay = observer(() => {
    const { activePanels } = useEditor();

    return (
        <ConfigProvider theme={PanelsThemeConfig}>
            {activePanels.length > 0 && activePanels.map(child => child.panel)}
        </ConfigProvider>
    )
})

export default Overlay;