import * as THREE from 'three';
import * as IMPORTER from '@orb_tools/Importer';
import * as EXPORTER from '@orb_tools/Exporter';
import { observer } from "mobx-react-lite";
import { useViewport } from "src/store/Viewport";
import { Alert, Button, message } from 'antd';
import { useDeltaTime, useOnUnmount } from '@orb_Hooks';
import ButtonGroup from 'antd/es/button/button-group';
import { CaretRightOutlined, PauseOutlined, StopOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { ItemBoolean, ItemButton, ItemCollapse, ItemGroup, ItemInput, ItemNumber, ItemSelect } from '@orb_UI/controller/ControllerItems';
import { Left, Right } from 'src/assets/icons';

enum AnimatorStatus {
    STOPPED = 0,
    PLAYING = 1,
    PAUSED = 2
}

class Animator {
    mixer: THREE.AnimationMixer | null = null;
    actions: { [key: string]: THREE.AnimationAction } | null = null;
    status: AnimatorStatus = AnimatorStatus.STOPPED;

    constructor() { }

    initialize = (obj: THREE.Object3D, clips: THREE.AnimationClip[]) => {
        this.cleanup();
        this.mixer = new THREE.AnimationMixer(obj);
        this.actions = {};
        clips.forEach((clip) => this.actions![clip.uuid] = this.mixer!.clipAction(clip));
        !this.mixer.hasEventListener("finished", (e) => this.onFinished(e)) && this.mixer.addEventListener("finished", (e) => this.onFinished(e));
        !this.mixer.hasEventListener("loop", (e) => this.onLoop(e)) && this.mixer.addEventListener("loop", (e) => this.onLoop(e));
    }

    cleanup = () => {
        if (!this.actions) return;
        this.stopAll();
        this.actions = null;
    }

    add = (clip: THREE.AnimationClip) => {
        if (this.actions) {
            this.actions[clip.uuid] = this.mixer!.clipAction(clip);
        }
    }

    play = (action: THREE.AnimationAction) => {
        this.stop(action);
        action.play();
        this.status = AnimatorStatus.PLAYING;
    }

    pause = (action: THREE.AnimationAction, paused?: boolean) => {
        action.paused = paused ?? !action.paused;
        this.status = action.paused ? AnimatorStatus.PAUSED : AnimatorStatus.PLAYING;
    }

    stop = (action: THREE.AnimationAction) => {
        action.stop();
        this.status = AnimatorStatus.STOPPED;
    }

    stopAll = () => {
        if (this.status !== AnimatorStatus.STOPPED && this.actions) {
            Object.values(this.actions).forEach((action) => this.stop(action));
        }
        this.status = AnimatorStatus.STOPPED;
    }

    onLoop = (event: { action: THREE.AnimationAction; loopDelta: number; }) => {
        console.log("onLoop:", event);
    }

    onFinished = (event: { action: THREE.AnimationAction; direction: number }) => {
        console.log("onFinished:", event);
        event.action.time = 0;
        this.stop(event.action);
    }
}

const animator = new Animator();

interface Animation {
    animations: THREE.AnimationClip[];
}

export const InspectorAnimation = observer((props: Animation) => {
    const { animations } = props;
    const { target } = useViewport();
    animator.initialize(target!, animations);

    const [_loopStop, _loopStart, _isActive] = useDeltaTime((d) => {
        animator.mixer?.update(d);
    });
    useOnUnmount(() => animator.cleanup(), []);

    const animationSelect = animations.map((ani) => {
        return { value: ani.uuid, label: ani.name };
    }) as { value: string; label: string }[];

    return (
        <>
            <AnimationClips list={animationSelect} />
        </>
    );
});

interface AnimationClips {
    list: { value: string; label: string }[];
}

export const AnimationClips = observer((props: AnimationClips) => {
    const { list } = props;
    const [index, setIndex] = useState(list.length === 0 ? -1 : 0);
    const { target } = useViewport();
    const selected = list[index]?.value;
    const label = list[index]?.label;

    return (
        <>
            <ItemCollapse label={"Animation Clips"}>
                {list.length === 0 && (
                    <ItemGroup
                        label="Clips"
                        children={<Alert type="info" showIcon message="No animations 🎬" />}
                    />
                )}
                {list.length !== 0 && (
                    <ItemGroup sizes={[1, 8, 1]} label="Clips">
                        <ItemButton
                            buttonName={<Left />}
                            disabled={list.length <= 1}
                            size="middle"
                            onClick={() => {
                                setIndex(index - 1 < 0 ? list.length - 1 : index - 1);
                                animator.stopAll();
                            }}
                        />
                        <ItemSelect
                            key={selected}
                            object={{ clips: list }}
                            variable="clips"
                            label={false}
                            defaultValue={label!}
                            onChangeSelect={(v) => {
                                animator.stopAll();
                                const newIndex = list.findIndex((item) => item.value === v);
                                setIndex(newIndex);
                            }}
                        />
                        <ItemButton
                            buttonName={<Right />}
                            disabled={list.length <= 1}
                            size="middle"
                            onClick={() => {
                                setIndex(index + 1 > list.length - 1 ? 0 : index + 1);
                                animator.stopAll();
                            }}
                        />
                    </ItemGroup>
                )}
                <ItemGroup sizes={[1, 1, 1]} label=" ">
                    <ItemButton
                        buttonName="Import"
                        onClick={() => {
                            if (target) {
                                IMPORTER.doImportAnimationClip((clip) => {
                                    (target as THREE.Object3D).animations.push(clip);
                                    animator.add(clip);
                                    list.push({ value: clip.uuid, label: clip.name });
                                    setIndex(list.length - 1);
                                });
                            } else {
                                message.warning("Select an object to import an animation!");
                            }
                        }}
                    />
                    <ItemButton
                        buttonName="Export"
                        disabled={list.length === 0}
                        onClick={() => {
                            const ac = animator.actions![selected!].getClip();
                            EXPORTER.exportAnimationClip(ac, true, (blob) =>
                                EXPORTER.save(blob, ac.name + ".ac")
                            );
                        }}
                    />
                    <ItemButton
                        buttonName="Remove"
                        disabled={list.length === 0}
                        onClick={() => {
                            message.warning("Remove animation clip not implemented yet!");
                        }}
                    />
                </ItemGroup>
            </ItemCollapse>
            {list.length !== 0 && selected !== undefined && (
                <ItemCollapse key={selected} label={`${label} (Animation Clip)`}>
                    <ActionControls action={animator.actions![selected]} />
                </ItemCollapse>
            )}
        </>
    );
});

interface AnimationAction {
    action: THREE.AnimationAction;
}

export const ActionControls = observer((props: AnimationAction) => {
    const { action } = props;
    const [playing, setPlaying] = useState(action.isRunning());
    const [started, setStarted] = useState(false);
    const [time, setTime] = useState(action.time);
    const clip = action.getClip();

    const [loopStop, loopStart, _isActive] = useDeltaTime(() => {
        setTime(action.time);
    }, false);

    const playAction = () => {
        animator.play(action);
        setPlaying(true);
        !started && setStarted(true);
        loopStart();
    };

    const pauseAction = (b?: boolean) => {
        animator.pause(action, b);
        setPlaying(false);
        b ? loopStop() : loopStart();
    };

    const stopAction = () => {
        animator.stop(action);
        setPlaying(false);
        setStarted(false);
        loopStop();
    };

    return (
        <>
            <ItemGroup label={"Controls"} sizes={[1, 5]}>
                <ButtonGroup>
                    {!playing && !started && <Button icon={<CaretRightOutlined />} onClick={playAction} />}
                    {started && (
                        <Button
                            icon={action.paused ? <PauseOutlined /> : <CaretRightOutlined />}
                            onClick={() => pauseAction()}
                        />
                    )}
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
                        if (action.time <= 0 && v > 0) {
                            playAction();
                            pauseAction(true);
                        }
                        action.time = v;
                        if (action.time <= 0) stopAction();
                    }}
                />
            </ItemGroup>
            <ItemNumber object={action} variable="timeScale" labelInVariable />
            <ItemGroup label='Loop' sizes={[1, 1]}>
                <ItemBoolean object={{ infinite: action.loop == THREE.LoopRepeat && action.repetitions == Infinity }} variable='infinite' onChange={(b) => { action.setLoop(b ? THREE.LoopRepeat : THREE.LoopOnce, b ? Infinity : 0); action.clampWhenFinished = !b; }} />
                <ItemNumber object={action} variable="repetitions" step={1} onChange={(v) => { action.setLoop(v > 1 ? THREE.LoopRepeat : THREE.LoopOnce, v) }} />
            </ItemGroup>

            {/* {clip.tracks.map((k) => {
                return <ItemInput object={{ [k.name]: k.name }} variable={k.name} labelInVariable onChange={(v) => k.name = v} />
            })} */}
        </>
    );
});