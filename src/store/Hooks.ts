import useRafLoop from "react-use/lib/useRafLoop";

/**
 * Every frame runs and passes a delta of time that passed between each update.
*/
export function useDeltaTime(callback: FrameRequestCallback, initiallyActive?: boolean) {
    let oldTime = 0;
    return useRafLoop((time) => {
        const delta = (time - oldTime) / 1000;
        oldTime = time;
        callback(delta)
    }, initiallyActive);;
}