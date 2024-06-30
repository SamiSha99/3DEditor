import { DragOutlined, ExpandAltOutlined, SyncOutlined } from "@ant-design/icons"
import { ControlsBarButton, ControlsBarStyle } from "./style"
import { useStores } from "@orb_App"
import { observer } from "mobx-react-lite"
import { Checkbox, Divider, Tooltip } from "antd";
import { useHotkeys } from 'react-hotkeys-hook';

export const ControlsBar = observer(() => {
    return (
        <ControlsBarStyle>
            <TranslationButton />
            <Divider style={{ backgroundColor: "white" }} type="vertical" />
            <TranslationSpaceButton />
            <Divider style={{ backgroundColor: "white" }} type="vertical" />
            <RootSelectionButton />
        </ControlsBarStyle>
    )
})

const TranslationButton = observer(() => {
    const { controlsMode, setControlsModeByName } = useStores();

    useHotkeys("space", () => {
        const newControlsMode = (() => {
            switch (controlsMode) {
                case "translate": return "rotate";
                case "rotate": return "scale";
                case "scale": return "translate";
            }
        })()
        setControlsModeByName(newControlsMode);
    })

    return (
        <Tooltip title="Change between Translation, Rotation and Scale" placement="bottom">
            <ControlsBarButton pressed={controlsMode == "translate"} onClick={() => setControlsModeByName("translate")} icon={<DragOutlined />} />
            <ControlsBarButton pressed={controlsMode == "rotate"} onClick={() => setControlsModeByName("rotate")} icon={<SyncOutlined />} />
            <ControlsBarButton pressed={controlsMode == "scale"} onClick={() => setControlsModeByName("scale")} icon={<ExpandAltOutlined />} />
        </Tooltip>
    )
})

const TranslationSpaceButton = observer(() => {
    const { setControlSpaceByName, controlsSpace } = useStores();

    useHotkeys("l", () => {
        setControlSpaceByName(controlsSpace == "world" ? "local" : "world")
    })

    return (
        <Tooltip title="Local Position/Rotation" placement="bottom">
            <ControlsBarButton pressed={false} onClick={() => setControlSpaceByName(controlsSpace == "world" ? "local" : "world")}>
                <Checkbox checked={controlsSpace == "local"} onChange={(e) => setControlSpaceByName(controlsSpace == "world" ? "local" : "world")} style={{ paddingRight: "5px" }} />
                {"Local"}
            </ControlsBarButton>
        </Tooltip>
    )
})

const RootSelectionButton = observer(() => {
    const { setRootSelection, useRootSelection } = useStores();
    useHotkeys("r", () => setRootSelection(!useRootSelection));

    return (
        <Tooltip title="Causes selection to target the root of the model." placement="bottom">
            <ControlsBarButton onClick={(e) => { setRootSelection(!useRootSelection), e.stopPropagation() }} pressed={false}>
                <Checkbox checked={useRootSelection} onChange={(e) => setRootSelection(e.target.checked)} style={{ paddingRight: "5px" }} />
                {"Root Selection"}
            </ControlsBarButton>
        </Tooltip>
    )
})
