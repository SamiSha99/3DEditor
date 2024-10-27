type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>

/** Constraints numbers into a range of values, exclusive to true numbers. Limited to 1000 range. */
export type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export const transformModes = ['translate', 'rotate', 'scale', undefined] as const;
export type TransformModes = typeof transformModes[number];

export const transformSpaces = ['world', 'local'] as const;
export type TransformSpaces = typeof transformSpaces[number];

// From pmndrs/assets, courtesy of Poly Haven
export const environments = [
    undefined,
    'apartment',
    'bridge',
    'city',
    'dawn',
    'esplanade',
    'forest',
    'hall',
    'lab',
    'lobby',
    'night',
    'park',
    'sky',
    'studio',
    'sunrise',
    'sunset',
    'venice',
    'warehouse',
    'workshop'] as const;
export type Environments = typeof environments[number];