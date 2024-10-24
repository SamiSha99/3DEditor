import File from "./ui/menubar_dropdowns/File";
import Add from "./ui/menubar_dropdowns/Add";
import Tools from "./ui/menubar_dropdowns/Tools";
import View from "./ui/menubar_dropdowns/View"
import { MenuBarStyle } from "./ui/style";

export const MenuBar = () => {
    return (
        <MenuBarStyle>
            <File />
            <Add />
            <Tools />
            <View />
        </MenuBarStyle>
    )
}

export default MenuBar;