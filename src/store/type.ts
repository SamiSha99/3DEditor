export const transformModes = ['translate', 'rotate', 'scale', undefined] as const;
export type TransformModes = typeof transformModes[number];

export const transformSpaces = ['world', 'local'] as const;
export type TransformSpaces = typeof transformSpaces[number];
