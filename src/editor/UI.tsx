import { observer } from 'mobx-react-lite';
import { MenuBar } from './ui/Menubar';
import { ControlsBar } from './ui/ControlsBar';

export const EditorUI = observer(() => {


    return (
        <>
            <MenuBar />
            <div style={{ zIndex: 1 }}>
                <ControlsBar />
            </div>
        </>
    )
})

export default EditorUI