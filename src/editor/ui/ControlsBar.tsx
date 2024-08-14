import { DragOutlined, ExpandAltOutlined, SyncOutlined } from "@ant-design/icons"
import { ControlsBarStyle } from "./style"
import { useStores } from "@orb_App"
import { observer } from "mobx-react-lite"
import { Button, Checkbox, Divider, Radio, RadioChangeEvent, Tooltip } from "antd";
import { useHotkeys } from 'react-hotkeys-hook';
import { CheckboxChangeEvent } from "antd/es/checkbox";

export const ControlsBar = observer(() => {
    return (
        <>
            <ControlsBarStyle>
                <TranslationButton />
                <GeometryButton />
                <Divider type="vertical" />
                <TranslationSpaceButton />
                <Divider type="vertical" />
                <RootSelectionButton />
            </ControlsBarStyle>
        </>
    )
})

const TranslationButton = observer(() => {
    const { controlsMode, setControlsModeByName, isOriginPointMode } = useStores();

    useHotkeys("space", () => {
        if (isOriginPointMode) return;
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
            <Radio.Group onChange={onChange} value={isOriginPointMode ? "translate" : controlsMode}>
                <Radio.Button value={"translate"} children={<DragOutlined />} />
                <Radio.Button disabled={isOriginPointMode} value={"rotate"} children={<SyncOutlined />} />
                <Radio.Button disabled={isOriginPointMode} value={"scale"} children={<ExpandAltOutlined />} />
            </Radio.Group>
        </Tooltip>
    )
})

const GeometryButton = observer(() => {
    const { isOriginPointMode, setIsOriginPointMode, setControlsModeByName } = useStores();

    const onClick = (e?: CheckboxChangeEvent) => {
        setIsOriginPointMode(e?.target.checked);
        if (!isOriginPointMode) setControlsModeByName("translate");
    };
    useHotkeys("g", () => onClick());

    return (
        <Tooltip title="Transform will affect the geometry of this object." placement="bottom">
            <Button onClick={() => onClick()}>
                <Checkbox checked={isOriginPointMode} onChange={onClick} style={{ paddingRight: "5px" }} />
                {"Origin Point"}
            </Button>
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
        <Tooltip title="Causes selection to target the root of the model instead of its children." placement="bottom">
            <Button onClick={(e) => { setRootSelection(!useRootSelection), e.stopPropagation() }}>
                <Checkbox checked={useRootSelection} onChange={(e) => setRootSelection(e.target.checked)} style={{ paddingRight: "5px" }} />
                {"Root Selection"}
            </Button>
        </Tooltip>
    )
})
