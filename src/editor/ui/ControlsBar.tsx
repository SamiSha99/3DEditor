import { DragOutlined, ExpandAltOutlined, SyncOutlined } from "@ant-design/icons"
import { ControlsBarButton, ControlsBarStyle } from "./style"
import { useStores } from "@orb_App"
import { observer } from "mobx-react-lite"
import { Checkbox, Divider } from "antd";
import { useHotkeys } from 'react-hotkeys-hook';

export const ControlsBar = observer(() => {
    return(
        <ControlsBarStyle>
            <TranslationButton />
            <Divider style={{backgroundColor:"white"}} type="vertical" />
            <TranslationSpaceButton />
            <Divider style={{backgroundColor:"white"}} type="vertical" />
            <RootSelectionButton />
        </ControlsBarStyle>
    )
})

const TranslationButton = observer(() => {
    const { controlsMode, setControlsModeByName } = useStores();

    useHotkeys("space", () => {
        const newControlsMode = (() => {
            switch(controlsMode) {
                case "translate": return "rotate";
                case "rotate": return "scale";
                case "scale": return "translate";
            }
        })()
        setControlsModeByName(newControlsMode);
    })

    return (
        <>
            <ControlsBarButton pressed={controlsMode == "translate"} onClick={() => setControlsModeByName("translate")} icon={<DragOutlined />} />
            <ControlsBarButton pressed={controlsMode == "rotate"} onClick={() => setControlsModeByName("rotate")} icon={<SyncOutlined />} />
            <ControlsBarButton pressed={controlsMode == "scale"} onClick={() => setControlsModeByName("scale")} icon={<ExpandAltOutlined />} />
        </>
    )
})

const TranslationSpaceButton = observer(() => {
    const { setControlSpaceByName, controlsSpace } = useStores();
    
    useHotkeys("l", () => {
        setControlSpaceByName(controlsSpace == "world" ? "local" : "world")
    })

    return (
        <ControlsBarButton pressed={false} onClick={() => setControlSpaceByName(controlsSpace == "world" ? "local" : "world")}>
            <Checkbox checked={controlsSpace == "local"} onChange={(e) => setControlSpaceByName(controlsSpace == "world" ? "local" : "world")} style={{paddingRight:"5px"}} />
            {"Local"}
        </ControlsBarButton>
    )
})

const RootSelectionButton = observer(() => {
    const { setRootSelection, useRootSelection } = useStores();
    useHotkeys("r", () => setRootSelection(!useRootSelection));

    return (
        <ControlsBarButton onClick={(e) => {setRootSelection(!useRootSelection), e.stopPropagation()}} pressed={false}>
            <Checkbox checked={useRootSelection} onChange={(e) => setRootSelection(e.target.checked)} style={{paddingRight:"5px"}} />
            {"Root Selection"}
        </ControlsBarButton>
    )
})
