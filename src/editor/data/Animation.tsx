import * as THREE from 'three';
import { observer } from "mobx-react-lite";
import { useViewport } from "src/store/Viewport";
import { Alert, Button } from 'antd';
import { useDeltaTime, useOnUnmount } from '@orb_Hooks';
import ButtonGroup from 'antd/es/button/button-group';
import { CaretRightOutlined, PauseOutlined, StopOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { ItemCollapse, ItemSelect, ItemTable } from '@orb_UI/controller/ControllerItems';

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
const pause = (action: THREE.AnimationAction) => { action.paused = !action.paused; }
const stop = (action: THREE.AnimationAction) => { action.stop(); }
const stopAll = () => { animator.actions && Object.keys(animator.actions).forEach((key) => stop(animator.actions![key])) }

interface Animation {
    animations: THREE.AnimationClip[]
}

export const InspectorAnimation = observer((props: Animation) => {
    const { animations } = props;
    const { target } = useViewport();
    initialize(target!, animations);

    const [_loopStop, _loopStart, _isActive] = useDeltaTime((d) => { animator.mixer?.update(d); })

    useOnUnmount(() => {
        if (animator.actions) {
            stopAll();
            animator.actions = null;
        }
    }, []);

    const animationSelect = animations ? animations.map((ani) => { return { value: ani.uuid, label: ani.name } }) as { value: string, label: string }[] : undefined;

    return (
        <>
            {
                (!animationSelect || animationSelect.length == 0) &&
                <Alert style={{ margin: 10 }} type="info" showIcon message="No animations :(" />
            }
            {
                animationSelect && animationSelect.length != 0 &&
                <AnimationClips list={animationSelect} />
            }
        </>
    );
})

interface AnimationClips {
    list: { value: string, label: string }[]

}

export const AnimationClips = observer((props: AnimationClips) => {
    const { list } = props;
    const [selected, setSelected] = useState(list[0].value);
    const [name, setName] = useState(list[0].label);
    console.log(selected);
    return (
        <>
            <ItemCollapse label={"Animation Clips"}>
                <ItemSelect object={{ clips: list }} variable="clips" labelInVariable defaultValue={list[0].label}
                    onChangeSelect={(v) => {
                        stopAll();
                        setSelected(v as string);
                        setName(animator.actions![v as string].getClip().name);
                    }} />
            </ItemCollapse>
            {
                selected &&
                <ItemCollapse key={selected} label={`${name} (Animation Clip)`}>
                    <ActionTime action={animator.actions![selected]} />
                    <ActionControls action={animator.actions![selected]} />
                </ItemCollapse>
            }
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

    return (
        <ButtonGroup>
            {!playing && !started && <Button icon={<CaretRightOutlined />} onClick={() => { play(action); setPlaying(true); !started && setStarted(true) }} />}
            {started && <Button icon={playing ? <PauseOutlined /> : <CaretRightOutlined />} onClick={() => { pause(action); setPlaying(false); }} />}
            {<Button disabled={!started} icon={<StopOutlined />} onClick={() => { stop(action); setPlaying(false); setStarted(false) }} />}
        </ButtonGroup>
    )
})

export const ActionTime = observer((props: AnimationAction) => {
    const { action } = props;
    const [time, setTime] = useState(action.time);
    const clip = action.getClip();
    const [_loopStop, _loopStart, _isActive] = useDeltaTime(() => { setTime(action.time) })
    return <>{time.toFixed(2) + " / " + clip.duration.toFixed(2)}</>
})