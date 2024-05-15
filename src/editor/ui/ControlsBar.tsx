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
        // to-do: this should be radio buttons!
        <ControlsBarStyle>
            <ControlsBarButton pressed={true} icon={<DragOutlined />} />
            <ControlsBarButton pressed={false} icon={<SyncOutlined />} />
            <ControlsBarButton pressed={false} icon={<ExpandAltOutlined />} />
            <ControlsBarButton pressed={false} onClick={() => setControlSpace(++space >= TYPES.transformSpaces.length ? (space = 0) : space)}>{controlsSpace.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())}</ControlsBarButton>
            <ControlsBarButton pressed={false}>
            <Checkbox checked={useRootSelection} onChange={(e) => {
                setRootSelection(e.target.checked);
            }}></Checkbox>
            </ControlsBarButton>
        </ControlsBarStyle>
    )
})

