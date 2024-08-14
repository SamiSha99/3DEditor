import { useStores } from "@orb_App";
import { ConfigProvider, ThemeConfig } from "antd";
import { observer } from "mobx-react-lite";
import { OriginPointPanel } from "./OriginPointPanel";

const themeConfig: ThemeConfig = {
    components: {
        Divider: {
            margin: 0,
        },
        Button: {
            defaultBg: "#4d4d4d",
            dangerColor: "red"
        }
    },
    token: {
        motion: false
    }
}

export const ActivePanels = observer(() => {
    const { isOriginPointMode } = useStores();

    return (
        <ConfigProvider theme={themeConfig}>
            {isOriginPointMode && <OriginPointPanel />}
        </ConfigProvider>
    )
})

