import * as THREE from 'three';
import { observer } from "mobx-react-lite";
import { useViewport } from "src/store/Viewport";
import { Button, Divider, Table } from 'antd';
import { useDeltaTime, useOnUnmount } from '@orb_Hooks';
import ButtonGroup from 'antd/es/button/button-group';
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import { useState } from 'react';

type AnimatorInterface = {
    mixer?: THREE.AnimationMixer | null,
    actions?: { [key: string]: THREE.AnimationAction } | null
}

const animator: AnimatorInterface = { mixer: null, actions: null };

const initialize = (obj: THREE.Object3D, clips: THREE.AnimationClip[]) => {
    if (animator.actions) animator.actions = null;
    animator.mixer = new THREE.AnimationMixer(obj);
    animator.actions = {};
    Object.assign(animator.actions, ...clips.map((c) => { return { [c.uuid]: animator.mixer!.clipAction(c) } }));
}

const play = (action: THREE.AnimationAction) => { stop(action); action.play(); }
const stop = (action: THREE.AnimationAction) => { action.isRunning() && action.stop(); }
const stopAll = () => { animator.actions && Object.keys(animator.actions).forEach((key) => stop(animator.actions![key])) }

export const InspectorAnimation = observer<{ animations: THREE.AnimationClip[] }>(({ animations }) => {
    const { target } = useViewport();
    initialize(target!, animations);

    const [_loopStop, _loopStart, _isActive] = useDeltaTime((d) => { animator.mixer?.update(d); })

    useOnUnmount(() => {
        if (animator.actions) {
            stopAll();
            animator.actions = null;
        }
    }, []);

    const dataSource = animations ? animations.map((ani, i) => {
        return {
            key: i,
            index: i,
            name: ani.name,
            time: (
                <ActionTime action={animator.actions![ani.uuid]} />
            ),
            actions: (
                <ActionControls action={animator.actions![ani.uuid]} />
            )
        }
    }) : undefined;

    return (
        <>
            <Divider children="Clips" orientation="left" />
            {
                <Table
                    style={{ border: "1px solid grey", width: "95%", margin: "auto" }}
                    size='small'
                    showHeader={false}
                    pagination={false}
                    columns={[
                        { dataIndex: 'index', width: "0px" },
                        { dataIndex: 'name' },
                        { dataIndex: 'time' },
                        { dataIndex: 'actions', width: "0px" }
                    ]}
                    dataSource={dataSource}
                />
            }
        </>
    );
})

export const ActionControls = observer<{ action: THREE.AnimationAction }>(({ action }) => {
    return (
        <ButtonGroup>
            <Button icon={<CaretRightOutlined />} onClick={() => play(action)} />
            <Button icon={<PauseOutlined />} onClick={() => stop(action)} />
        </ButtonGroup>
    )
})

export const ActionTime = observer<{ action: THREE.AnimationAction }>(({ action }) => {
    const [time, setTime] = useState(action.time);
    const clip = action.getClip();
    const [_loopStop, _loopStart, _isActive] = useDeltaTime(() => { setTime(action.time) })

    return <>{time.toFixed(2) + " / " + clip.duration.toFixed(2)}</>
})