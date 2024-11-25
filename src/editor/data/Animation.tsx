import * as THREE from 'three';
import { observer } from "mobx-react-lite";
import { useViewport } from "src/store/Viewport";

export const InspectorAnimation: React.FC<{ animations: THREE.AnimationClip[] }> = observer(({ animations }) => {
    const { target } = useViewport();

    return (
        <>
        Animation Clips! <br/>
        {
            animations && animations.map((anim, i) => {
                return <>Anim #{i} {anim}</>;
            })
        }
        </>
    );
})