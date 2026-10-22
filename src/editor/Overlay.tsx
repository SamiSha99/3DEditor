import { useEditor } from "@orb_Editor";
import { observer } from "mobx-react-lite";
import { ConfigProvider } from "antd";
import { Fragment } from "react";
import { PanelsThemeConfig } from "@orb_UI/antd/ThemeConfigs";

export const Overlay = observer(() => {
    const { activePanels } = useEditor();

    return (
        <ConfigProvider theme={PanelsThemeConfig}>
            <div id="overlay" style={{ display: "flex", width: "100%", height: "100%", position: "absolute", pointerEvents: "none" }}>
                {activePanels.map(child => <Fragment key={child.id}>{child.panel}</Fragment>)}
            </div>
        </ConfigProvider>
    )
})

export default Overlay;