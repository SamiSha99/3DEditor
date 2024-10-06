import { useEffect, useRef } from "react";
import useRafLoop from "react-use/lib/useRafLoop";

/**
 * Runs when the component unmounts
*/
export const useOnUnmount = (callback: React.EffectCallback, dependencies: React.DependencyList) => {
    const isUnmounting = useRef(false);
    useEffect(() => () => { isUnmounting.current = true }, []);
    useEffect(() => () => { isUnmounting.current && callback(); }, dependencies);
};

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