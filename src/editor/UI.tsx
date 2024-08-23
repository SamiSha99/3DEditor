import { observer } from 'mobx-react-lite';
import { MenuBar } from './ui/Menubar';
import { ControlsBar } from './ui/ControlsBar';

export const EditorUI = observer(() => {
    

    return (
        <div style={{ zIndex: 1 }}>
            <MenuBar />
            <ControlsBar />
        </div>
    )
})

export default EditorUI