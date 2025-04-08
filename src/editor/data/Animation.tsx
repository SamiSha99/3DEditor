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
import { ItemBoolean, ItemButton, ItemCollapse, ItemGroup, ItemNumber, ItemSelect } from '@orb_UI/controller/ControllerItems';
import { Left, Right } from 'src/assets/icons';

enum AnimatorStatus {
    STOPPED = 0,
    PLAYING = 1,
    PAUSED = 2
}


interface AnimationClipsList {
    list: { value: string; label: string }[];
}

export class Animator {
    mixer: THREE.AnimationMixer;
    target: THREE.Object3D;
    clips: THREE.AnimationClip[];
    actions: { [key: string]: THREE.AnimationAction } = {};
    status: AnimatorStatus = AnimatorStatus.STOPPED;

    constructor(target: THREE.Object3D, clips?: THREE.AnimationClip[]) {
        this.target = target;
        this.clips = clips ? clips : target.animations;
        this.mixer = new THREE.AnimationMixer(target);
        this.clips.forEach((clip) => this.actions![clip.uuid] = this.mixer!.clipAction(clip));
        !this.mixer.hasEventListener("finished", (e) => this.onFinished(e)) && this.mixer.addEventListener("finished", (e) => this.onFinished(e));
        !this.mixer.hasEventListener("loop", (e) => this.onLoop(e)) && this.mixer.addEventListener("loop", (e) => this.onLoop(e));
    }

    render = () => { return <this.TabAnimation />; }

    cleanup = () => {
        if (!this.actions) return;
        this.stopAll();
        this.actions = {};
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
        this.stop(event.action);
    }

    TabAnimation = observer(() => {

        const [_loopStop, _loopStart, _isActive] = useDeltaTime((d) => { this.mixer.update(d); });

        useOnUnmount(() => this.cleanup(), []);

        const animationSelect = this.clips.map((ani) => {
            return { value: ani.uuid, label: ani.name };
        });

        return (<this.AnimationClips list={animationSelect} />);
    });

    AnimationClips = observer((props: AnimationClipsList) => {
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
                                    this.stopAll();
                                }}
                            />
                            <ItemSelect
                                key={selected}
                                object={{ clips: list }}
                                variable="clips"
                                label={false}
                                defaultValue={label!}
                                onChangeSelect={(v) => {
                                    this.stopAll();
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
                                    this.stopAll();
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
                                        this.add(clip);
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
                                const ac = this.actions![selected!].getClip();
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
                        <this.ActionControls action={this.actions![selected]} />
                    </ItemCollapse>
                )}
            </>
        );
    });

    ActionControls = observer((props: { action: THREE.AnimationAction }) => {
        const { action } = props;
        const [playing, setPlaying] = useState(action.isRunning());
        const [started, setStarted] = useState(false);
        const [time, setTime] = useState(action.time);
        const clip = action.getClip();

        const [loopStop, loopStart, _isActive] = useDeltaTime(() => {
            setTime(action.time);
        }, false);

        const playAction = () => {
            this.play(action);
            setPlaying(true);
            !started && setStarted(true);
            loopStart();
        };

        const pauseAction = (b?: boolean) => {
            this.pause(action, b);
            setPlaying(false);
            b ? loopStop() : loopStart();
        };

        const stopAction = () => {
            this.stop(action);
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
                    <ItemBoolean object={{ infinite: action.loop == THREE.LoopRepeat && action.repetitions == Infinity }} variable='infinite' onChange={(b) => { action.setLoop(b ? THREE.LoopRepeat : THREE.LoopOnce, b ? Infinity : 0); }} />
                    <ItemNumber object={action} variable="repetitions" step={1} onChange={(v) => { action.setLoop(v > 1 ? THREE.LoopRepeat : THREE.LoopOnce, v) }} />
                </ItemGroup>
                <ItemBoolean object={action} variable="clampWhenFinished" labelInVariable />
                {/* {clip.tracks.map((k) => {
                    return <ItemInput object={{ [k.name]: k.name }} variable={k.name} labelInVariable onChange={(v) => k.name = v} />
                })} */}
            </>
        );
    });
}