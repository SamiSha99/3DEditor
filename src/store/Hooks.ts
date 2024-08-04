import useRafLoop from "react-use/lib/useRafLoop";

///<summary> every frame runs and passes a delta of time from each frame.</summary>
export function useDeltaTime(callback: FrameRequestCallback, initiallyActive?: boolean) {
    let oldTime = 0;
    return useRafLoop((time) => {
        const delta = (time - oldTime) / 1000;
        oldTime = time;
        callback(delta)
    }, initiallyActive);;
}