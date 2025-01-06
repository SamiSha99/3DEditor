import File from "./ui/menubar/File";
import Add from "./ui/menubar/Add";
import Tools from "./ui/menubar/Tools";
import View from "./ui/menubar/View"
import { MenuBarStyle } from "./ui/style";

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