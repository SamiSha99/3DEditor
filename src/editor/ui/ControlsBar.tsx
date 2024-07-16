import { DragOutlined, ExpandAltOutlined, SyncOutlined } from "@ant-design/icons"
import { ControlsBarStyle } from "./style"
import { useStores } from "@orb_App"
import { observer } from "mobx-react-lite"
import { Button, Checkbox, Divider, Radio, RadioChangeEvent, Tooltip } from "antd";
import { useHotkeys } from 'react-hotkeys-hook';

export const ControlsBar = observer(() => {
    return (
        <ControlsBarStyle>
            <TranslationButton />
            <Divider type="vertical" />
            <TranslationSpaceButton />
            <Divider type="vertical" />
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

    const onChange = (e: RadioChangeEvent) => { setControlsModeByName(e.target.value); }

    return (
        <Tooltip title="Change between Translation, Rotation and Scale" placement="bottom">
            <Radio.Group onChange={onChange} value={controlsMode}>
                <Radio.Button value={"translate"} children={<DragOutlined />} />
                <Radio.Button value={"rotate"} children={<SyncOutlined />} />
                <Radio.Button value={"scale"} children={<ExpandAltOutlined />} />
            </Radio.Group>
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
            <Button onClick={() => setControlSpaceByName(controlsSpace == "world" ? "local" : "world")}>
                <Checkbox checked={controlsSpace == "local"} onChange={(e) => setControlSpaceByName(controlsSpace == "world" ? "local" : "world")} style={{ paddingRight: "5px" }} />
                {"Local"}
            </Button>
        </Tooltip>
    )
})

const RootSelectionButton = observer(() => {
    const { setRootSelection, useRootSelection } = useStores();
    useHotkeys("r", () => setRootSelection(!useRootSelection));

    return (
        <Tooltip title="Causes selection to target the root of the model." placement="bottom">
            <Button onClick={(e) => { setRootSelection(!useRootSelection), e.stopPropagation() }}>
                <Checkbox checked={useRootSelection} onChange={(e) => setRootSelection(e.target.checked)} style={{ paddingRight: "5px" }} />
                {"Root Selection"}
            </Button>
        </Tooltip>
    )
})
