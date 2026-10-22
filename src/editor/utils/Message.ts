import { message as staticMessage } from "antd";
import { MessageInstance } from "antd/es/message/interface";

export let message: MessageInstance = staticMessage;
export const setMessage = (instance: MessageInstance) => {
    message = instance;
};

