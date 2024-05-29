import { Button } from "antd";
import styled from "styled-components";

export const MenuBarStyle = styled.div`
    background-color: #212121;
    width: 100vw;
    height: 5vh;
`;

export const ControlsBarStyle = styled.div`
    position: absolute;
    top: 7.5%;
    left: 2.5%;
    background-color: #212121;
`;

export const ControlsBarButton = styled(Button)<{pressed:any}>`
    overflow-y: hidden;
    background-color: ${(props)=>props.pressed?"#323232":"#212121"};
    border-color: #212121;
    border-radius: 0px;
    color: white;
    ant-btn {
        background-color: #212121;
        border-color: #212121;
        color: white;
    }
    &:hover {
        background-color: #212121 !important;
        border-color: #212121 !important;
    }
`