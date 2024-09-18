import { Form, Tooltip, Image, Upload, UploadFile, Button } from "antd";
import React, { createElement, useEffect, useRef, useState } from "react";
import { Item, labelFromVariable, MOUSE_ENTER_DELAY } from "./Item";
import { ItemInvalidAlert, invalidVariable } from "./ItemAlert";
import { useDeltaTime } from "src/store/Hooks";
import { Texture, TextureLoader } from "three";

interface TextureInterface extends Item {
    onChange?: (value: string) => void
}

export const ItemTexture: React.FC<TextureInterface> = (
    { label, object, variable, onChange }
) => {
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    console.log(object[variable]);
    const [v, setValue] = useState<string>(object[variable]);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext('2d');
    const t = (object[variable] as Texture);
    if (t) {
        ctx?.drawImage(t.image, 0, 0, t.image.width, t.image.height, 0, 0, canvas.width, canvas.height);
    }
    const preview = canvas.toDataURL();

    return (
        <Form.Item label={label ? label : labelFromVariable(variable)}>
            <Tooltip title={t.name} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <img src={preview} />
            </Tooltip>
        </Form.Item >
    )
}

export default ItemTexture;