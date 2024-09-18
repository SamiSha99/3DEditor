import { Form, Tooltip, Image, Upload, UploadFile, Button } from "antd";
import React, { useState } from "react";
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
    console.log(object, variable, object[variable]);
    const [v, setValue] = useState<string>(object[variable]);
    const material = (object[variable] as Texture);

    const [fileList, setFileList] = useState<UploadFile[]>([
        {
            uid: material ? material.uuid : "-1",
            name: material?.name,
            url: material?.image.src
        }
    ]);

    const [_loopStop, _loopStart, _isActive] = useDeltaTime(() => {
        v != object[variable] && setValue(object[variable])
    });

    return (
        <Form.Item label={label ? label : labelFromVariable(variable)}>
            <Tooltip title={v} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    accept=".PNG, .JPG, .GIF, .DDS"
                    style={{ display: 'inline-block', width: '100%' }}
                    onChange={(v) => {
                        if (v == null) return;
                        object[variable] = v.target.value;
                        onChange && onChange(v.target.value);
                    }}
                >
                    {/* <div><img src={material?.image.src}/>"hello" </div> */}
                    {fileList.length && null}
                </Upload>
            </Tooltip>
        </Form.Item >
    )
}

export default ItemTexture;