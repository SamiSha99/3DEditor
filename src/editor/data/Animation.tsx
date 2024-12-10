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
    action?: THREE.AnimationAction | null,
    clips?: THREE.AnimationClip[] | null
}

const animator: AnimatorInterface = { mixer: null, action: null, clips: null };

const initialize = (obj: THREE.Object3D, clips: THREE.AnimationClip[]) => {

    // Cleanup hack when switching between objects while the animation tab open
    if (animator.action) {
        animator.action.stop();
        animator.action = null;
    }
    animator.mixer = new THREE.AnimationMixer(obj);
    animator.clips = clips;
}

export const InspectorAnimation: React.FC<{ animations: THREE.AnimationClip[] }> = observer(({ animations }) => {
    const { target } = useViewport();

    initialize(target!, animations);

    const playAnimation = (clip: THREE.AnimationClip) => {
        animator.action && animator.action.isRunning() && animator.action.stop();
        animator.action = animator.mixer?.clipAction(clip);
        animator.action?.play();
        loopStart();
    }

    const stopAnimation = () => {
        animator.action?.stop();
    }

    const [_loopStop, loopStart, _isActive] = useDeltaTime((d) => {
        animator.mixer?.update(d);
    })

    useOnUnmount(() => {
        if (animator.action) {
            animator.action.stop();
            animator.action = null;
        }
    }, []);

    const dataSource = !animations ? undefined : animations.map((ani, i) => {
        return {
            key: i,
            index: i,
            name: ani.name,
            actions: (
                <ButtonGroup>
                    <Button icon={<CaretRightOutlined />} onClick={() => playAnimation(ani)} />
                    <Button icon={<PauseOutlined />} onClick={() => stopAnimation()} />
                </ButtonGroup>
            )
        }
    })

    return (
        <>
            <Divider children="Clips" orientation="left" />
            {
                animations.length &&
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
                >

                </Table>
            }
            {
                !animations.length && <i>No animations found...</i>
            }
        </>
    );
})