import * as THREE from 'three';
import { observer } from "mobx-react-lite";
import { useViewport } from "src/store/Viewport";
import { Button, Divider } from 'antd';
import { useEffect, useState } from 'react';
import { useDeltaTime, useOnUnmount } from '@orb_Hooks';

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

    const [_loopStop, loopStart, _isActive] = useDeltaTime((d) => {
        animator.mixer?.update(d);
    })

    useOnUnmount(() => {
        if (animator.action) {
            animator.action.stop();
            animator.action = null;
        }
    }, []);

    return (
        <>
            <div style={{ color: "yellow" }}>
                TO-DO: Showcase clips, maybe even modify them?
            </div>
            <Divider children="Clips" orientation="left" />
            {
                animations && animations.map((anim) => {
                    return <Button children={anim.name} onClick={() => playAnimation(anim)} />;
                })
            }
            {
                !animations.length && <i>No animations found...</i>
            }
        </>
    );
})