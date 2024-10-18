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