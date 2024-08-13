import { observer } from 'mobx-react-lite';
import { MenuBar } from './ui/Menubar';
import { ControlsBar } from './ui/ControlsBar';
import { ActivePanels } from '@orb_UI/panels/ActivePanels';

export const EditorUI = observer(() => {
    

    return (
        <div style={{ zIndex: 1 }}>
            <MenuBar />
            <ControlsBar />
            <ActivePanels />
        </div>
    )
})

export default EditorUI