import { useStores } from "@orb_App";
import { observer } from "mobx-react-lite";
import { OriginPointPanel } from "./OriginPointPanel";
import { ConfigProvider } from "antd";
import { PanelsThemeConfig } from "@orb_UI/antd/ThemeConfigs";



export const ActivePanels = observer(() => {
    const { isOriginPointMode } = useStores();

    return (
        <ConfigProvider theme={PanelsThemeConfig}>
            {isOriginPointMode && <OriginPointPanel />}
        </ConfigProvider>
    )
})

