import * as TYPES from '../../store/type'
import { DragOutlined, FontSizeOutlined, RotateLeftOutlined } from "@ant-design/icons"
import { ControlsBarButton, ControlsBarStyle } from "./style"
import { useStores } from "@orb_App"
import { observer } from "mobx-react-lite"
import { Checkbox } from "antd";

let space = 0;

export const ControlsBar = observer(() => {
    const { setControlSpace, setRootSelection, useRootSelection, controlsSpace } = useStores();
    return(
        <ControlsBarStyle>
            <ControlsBarButton children={<DragOutlined />} />
            <ControlsBarButton children={<RotateLeftOutlined />} />
            <ControlsBarButton children={<FontSizeOutlined />} />
            <button onClick={() => setControlSpace(++space >= TYPES.transformSpaces.length ? (space = 0) : space)}>{controlsSpace.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())}</button>
            <Checkbox checked={useRootSelection} onChange={(e) => {
                setRootSelection(e.target.checked);
            }}></Checkbox>
        </ControlsBarStyle>
    )
})

