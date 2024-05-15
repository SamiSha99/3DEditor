import * as TYPES from '../../store/type'
import { DragOutlined, ExpandAltOutlined, SyncOutlined } from "@ant-design/icons"
import { ControlsBarButton, ControlsBarStyle } from "./style"
import { useStores } from "@orb_App"
import { observer } from "mobx-react-lite"
import { Checkbox, Button } from "antd";

let space = 0;

export const ControlsBar = observer(() => {
    const { setControlSpace, setRootSelection, useRootSelection, controlsSpace } = useStores();
    return(
        <ControlsBarStyle>
            <ControlsBarButton children={<DragOutlined />} />
            <ControlsBarButton children={<SyncOutlined />} />
            <ControlsBarButton children={<ExpandAltOutlined />} />
            <ControlsBarButton onClick={() => setControlSpace(++space >= TYPES.transformSpaces.length ? (space = 0) : space)}>{controlsSpace.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())}</ControlsBarButton>
            <ControlsBarButton>
            <Checkbox checked={useRootSelection} onChange={(e) => {
                setRootSelection(e.target.checked);
            }}></Checkbox>
            </ControlsBarButton>
        </ControlsBarStyle>
    )
})

