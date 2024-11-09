import { DragOutlined, ExpandAltOutlined, SyncOutlined } from "@ant-design/icons"
import { ControlsBarStyle } from "./style"
import { useEditor } from "@orb_Editor"
import { observer } from "mobx-react-lite"
import { Button, Checkbox, Divider, Radio, RadioChangeEvent, Tooltip } from "antd";
import { useHotkeys } from 'react-hotkeys-hook';
import { useViewport } from "src/store/Viewport";

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
    const { setTransformControlsMode, transformControlsMode } = useViewport();

    useHotkeys("space", () => {
        const newControlsMode = (() => {
            switch (transformControlsMode) {
                case "translate": return "rotate";
                case "rotate": return "scale";
                case "scale": return "translate";
            }
        })()
        setTransformControlsMode(newControlsMode);
    })

    const onChange = (e: RadioChangeEvent) => { setTransformControlsMode(e.target.value); }

    return (
        <Tooltip title="Change between Translation, Rotation and Scale" placement="bottom">
            <Radio.Group onChange={onChange} value={transformControlsMode}>
                <Radio.Button value={"translate"} children={<DragOutlined />} />
                <Radio.Button value={"rotate"} children={<SyncOutlined />} />
                <Radio.Button value={"scale"} children={<ExpandAltOutlined />} />
            </Radio.Group>
        </Tooltip>
    )
})

const TranslationSpaceButton = observer(() => {
    const { setTransformControlsSpace, transformControlsSpace } = useViewport();

    useHotkeys("l", () => setTransformControlsSpace(transformControlsSpace == "world" ? "local" : "world"))

    return (
        <Tooltip title="Local Position/Rotation" placement="bottom">
            <Button onClick={() => setTransformControlsSpace(transformControlsSpace == "world" ? "local" : "world")}>
                <Checkbox checked={transformControlsSpace == "local"} onChange={() => setTransformControlsSpace(transformControlsSpace == "world" ? "local" : "world")} style={{ paddingRight: "5px" }} />
                {"Local"}
            </Button>
        </Tooltip>
    )
})

const RootSelectionButton = observer(() => {
    const { setRootSelection, useRootSelection } = useEditor();
    useHotkeys("r", () => setRootSelection(!useRootSelection));

    return (
        <Tooltip title="When selecting part of a model it will select the root of the model instead." placement="bottom">
            <Button onClick={(e) => { setRootSelection(!useRootSelection), e.stopPropagation() }}>
                <Checkbox checked={useRootSelection} onChange={(e) => setRootSelection(e.target.checked)} style={{ paddingRight: "5px" }} />
                {"Root"}
            </Button>
        </Tooltip>
    )
})
