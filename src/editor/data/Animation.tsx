import * as THREE from 'three';
import { observer } from "mobx-react-lite";
import { useViewport } from "src/store/Viewport";
import { Button, Collapse, Divider, List, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useDeltaTime, useOnUnmount } from '@orb_Hooks';
import { ItemCollapse } from '@orb_UI/controller/ControllerItems';
import Panel from 'antd/es/splitter/Panel';
import ButtonGroup from 'antd/es/button/button-group';
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';

type AnimatorInterface = {
    mixer?: THREE.AnimationMixer | null,
    actions?: THREE.AnimationAction[] | null,
    clips?: THREE.AnimationClip[] | null
}

const animator: AnimatorInterface = { mixer: null, actions: null, clips: null };

const initialize = (obj: THREE.Object3D, clips: THREE.AnimationClip[]) => {

    // Cleanup hack when switching between objects while the animation tab open
    if (animator.actions) {
        animator.actions.forEach((action) => { action.stop(); })
        animator.actions = null;
    }
    animator.mixer = new THREE.AnimationMixer(obj);
    animator.actions = [];
    clips.forEach((clip) => {
        animator.actions!.push(animator.mixer!.clipAction(clip));
    });
    animator.clips = clips;
}

export const InspectorAnimation: React.FC<{ animations: THREE.AnimationClip[] }> = observer(({ animations }) => {
    const { target } = useViewport();

    initialize(target!, animations);

    const play = (clip: THREE.AnimationClip) => {
        animator.actions?.forEach((action) => {
            if (action.getClip() == clip) {
                action.isRunning() && action.stop();
                action.play();
            }
        })
        loopStart();
    }
    const stop = (clip: THREE.AnimationClip) => { animator.actions?.forEach((action) => { action.getClip() == clip && action.isRunning() && action.stop() }) }
    const stopAll = () => { animator.actions?.forEach((action) => { action.isRunning() && action.stop() }) }

    const [_loopStop, loopStart, _isActive] = useDeltaTime((d) => {
        animator.mixer?.update(d);
    })

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
            actions: (
                <ButtonGroup>
                    <Button icon={<CaretRightOutlined />} onClick={() => play(ani)} />
                    <Button icon={<PauseOutlined />} onClick={() => stop(ani)} />
                </ButtonGroup>
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
                        { dataIndex: 'actions', width: "0px" }
                    ]}
                    dataSource={dataSource}
                />
            }
        </>
    );
})