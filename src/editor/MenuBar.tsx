import { useState } from "react";
import File from "@orb_UI/menubar/File";
import Add from "@orb_UI/menubar/Add";
import Tools from "@orb_UI/menubar/Tools";
import View from "@orb_UI/menubar/View"
import { MenuBarStyle } from "@orb_UI/style";

export const Menubar = () => {
    const [_state, setState] = useState("");
    return (
        <MenuBarStyle>
            <File onclick={() => setState("file")} />
            <Add onclick={() => setState("add")} />
            <Tools onclick={() => setState("tools")} />
            <View onclick={() => setState("view")} />
        </MenuBarStyle>
    )
}

export default Menubar;