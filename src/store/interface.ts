
export interface ITransformData {
    targetID: number
    mode: 'translate' | 'rotate' | 'scale' | undefined
    space: 'world' | 'local'
}

