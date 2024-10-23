import File from "./ui/dropdowns/File";
import Add from "./ui/dropdowns/Add";
import Tools from "./ui/dropdowns/Tools";
import View from "./ui/dropdowns/View"
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