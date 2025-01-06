import File from "@orb_UI/menubar/File";
import Add from "@orb_UI/menubar/Add";
import Tools from "@orb_UI/menubar/Tools";
import View from "@orb_UI/menubar/View"
import { MenuBarStyle } from "@orb_UI/style";

export const Menubar = () => {
    return (
        <MenuBarStyle>
            <File />
            <Add />
            <Tools />
            <View />
        </MenuBarStyle>
    )
}

export default Menubar;