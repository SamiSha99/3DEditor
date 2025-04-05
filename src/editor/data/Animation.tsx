import * as THREE from 'three';
import * as IMPORTER from '@orb_tools/Importer'
import * as EXPORTER from '@orb_tools/Exporter'
import { observer } from "mobx-react-lite";
import { useViewport } from "src/store/Viewport";
import { Alert, Button, message } from 'antd';
import { useDeltaTime, useOnUnmount } from '@orb_Hooks';
import ButtonGroup from 'antd/es/button/button-group';
import { CaretRightOutlined, PauseOutlined, StopOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { ItemButton, ItemCollapse, ItemGroup, ItemNumber, ItemSelect } from '@orb_UI/controller/ControllerItems';
import { Left, Right } from 'src/assets/icons';

enum AnimatorStatus {
    STOPPED = 0,
    PLAYING = 1,
    PAUSED = 2
}

type AnimatorInterface = {
    mixer?: THREE.AnimationMixer | null,
    actions?: { [key: string]: THREE.AnimationAction } | null,
    status: AnimatorStatus
}

const animator: AnimatorInterface = { mixer: null, actions: null, status: AnimatorStatus.STOPPED };

const initialize = (obj: THREE.Object3D, clips: THREE.AnimationClip[]) => {
    if (animator.actions) cleanup();
    animator.mixer = new THREE.AnimationMixer(obj);
    animator.actions = {};
    Object.assign(animator.actions, ...clips.map((c) => { return { [c.uuid]: animator.mixer!.clipAction(c) } }));
}

const cleanup = () => {
    if (!animator.actions) return;
    stopAll();
    animator.actions = null;
}

const add = (clip: THREE.AnimationClip) => animator.actions && Object.assign(animator.actions, { [clip.uuid]: animator.mixer!.clipAction(clip) });


interface Animation {
    animations: THREE.AnimationClip[]
}

export const InspectorAnimation = observer((props: Animation) => {
    const { animations } = props;
    const { target } = useViewport();
    initialize(target!, animations);

    const [_loopStop, _loopStart, _isActive] = useDeltaTime((d) => { animator.mixer?.update(d); })
    useOnUnmount(() => cleanup(), []);

    const animationSelect = animations.map((ani) => { return { value: ani.uuid, label: ani.name } }) as { value: string, label: string }[];

    return (
        <>
            <AnimationClips list={animationSelect} />
        </>
    );
})

interface AnimationClips {
    list: { value: string, label: string }[]
}

export const AnimationClips = observer((props: AnimationClips) => {
    const { list } = props;
    const [index, setIndex] = useState(list.length == 0 ? -1 : 0);
    const { target } = useViewport();
    const selected = list[index]?.value;
    const label = list[index]?.label;

    return (
        <>
            {
                list && list.length != 0 && selected != undefined &&
                <ItemCollapse key={selected} label={`${label} (Animation Clip)`}>
                    <ActionControls action={animator.actions![selected]} />
                </ItemCollapse>
            }
            <ItemCollapse label={"Animation Clips"}>
                {
                    list.length == 0 &&
                    <ItemGroup label='Clips' children={<Alert type="info" showIcon message="No animations 🎬" />} />
                }
                {
                    list && list.length != 0 &&
                    <ItemGroup sizes={[1, 8, 1]} label='Clips'>
                        <ItemButton buttonName={<Left />} disabled={list.length <= 1} size="middle" onClick={() => { setIndex(index - 1 < 0 ? (list.length - 1) : (index - 1)), stopAll(); }} />
                        <ItemSelect key={selected} object={{ clips: list }} variable="clips" label={false} defaultValue={label!}
                            onChangeSelect={(v) => {
                                stopAll();
                                const index = list.findIndex((item) => item.value == v);
                                setIndex(index);
                            }}
                        />
                        <ItemButton buttonName={<Right />} disabled={list.length <= 1} size="middle" onClick={() => { setIndex(index + 1 > list.length - 1 ? (0) : (index + 1)), stopAll(); }} />
                    </ItemGroup>
                }
                <ItemGroup sizes={[1, 1, 1]} label=" ">
                    <ItemButton
                        buttonName="Import"
                        onClick={() => {
                            if (target) {
                                IMPORTER.doImportAnimationClip((clip) => {
                                    (target as THREE.Object3D).animations.push(clip);
                                    add(clip);
                                    Object.assign(list, { [list.length]: { value: clip.uuid, label: clip.name } });
                                    setIndex(list.length - 1);
                                })
                            }
                            else
                                message.warning("Select an object to import an animation!");
                        }}
                    />
                    <ItemButton
                        buttonName="Export"
                        disabled={list.length == 0}
                        onClick={() => {
                            const ac = animator.actions![selected!].getClip();
                            EXPORTER.exportAnimationClip(ac, true, (blob) => EXPORTER.save(blob, ac.name + ".ac"))
                        }}
                    />
                    <ItemButton
                        buttonName="Remove"
                        disabled={list.length == 0}
                        onClick={() => { message.warning("Remove animation clip not implemented yet!"); }}
                    />
                </ItemGroup>
            </ItemCollapse>
        </>
    );
})

interface AnimationAction {
    action: THREE.AnimationAction
}

export const ActionControls = observer((props: AnimationAction) => {
    const { action } = props;
    const [playing, setPlaying] = useState(action.isRunning());
    const [started, setStarted] = useState(false);
    const [time, setTime] = useState(action.time);
    const clip = action.getClip();
    const [_loopStop, _loopStart, _isActive] = useDeltaTime(() => { setTime(action.time) })

    const playAction = () => {
        play(action);
        setPlaying(true);
        !started && setStarted(true)
    }

    const pauseAction = (b?: boolean) => {
        pause(action, b);
        setPlaying(false);
    }

    const stopAction = () => {
        stop(action);
        setPlaying(false);
        setStarted(false);
    }

    return (
        <ItemGroup label={"Controls"} sizes={[1, 5]}>
            <ButtonGroup>
                {!playing && !started && <Button icon={<CaretRightOutlined />} onClick={playAction} />}
                {started && <Button icon={action.paused ? <PauseOutlined /> : <CaretRightOutlined />} onClick={() => pauseAction()} />}
                {<Button disabled={!started} icon={<StopOutlined />} onClick={stopAction} />}
            </ButtonGroup>
            <ItemNumber
                object={{ time: time }}
                variable="time"
                addonAfter={clip.duration.toFixed(2)}
                nodrag
                limit={{ min: 0, max: clip.duration }}
                onFocus={() => pauseAction(true)}
                onBlur={() => pauseAction(true)}
                onChange={(v) => {
                    // action hasn't started? then start it since the value is defined
                    if (action.time <= 0 && v > 0) {
                        playAction();
                        pauseAction(true);
                    }
                    action.time = v;
                    // Stop if we set it back to 0
                    if (action.time <= 0)
                        stopAction()
                }}
            />
        </ItemGroup>
    )
})

const play = (action: THREE.AnimationAction) => {
    stop(action);
    action.play();
    animator.status = AnimatorStatus.PLAYING;
}

const pause = (action: THREE.AnimationAction, b?: boolean) => {
    action.paused = b ?? !action.paused;
    animator.status = action.paused ? AnimatorStatus.PAUSED : AnimatorStatus.PLAYING;
}

const stop = (action: THREE.AnimationAction) => {
    action.stop();
    animator.status = AnimatorStatus.STOPPED;
}

const stopAll = () => {
    if (animator.status != AnimatorStatus.STOPPED && animator.actions) {
        Object.keys(animator.actions).forEach((key) => stop(animator.actions![key]))
    }
    animator.status = AnimatorStatus.STOPPED;
}