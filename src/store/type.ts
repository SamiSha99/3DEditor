export const transformModes = ['translate', 'rotate', 'scale', undefined] as const;
export type TransformModes = typeof transformModes[number];

export const transformSpaces = ['world', 'local'] as const;
export type TransformSpaces = typeof transformSpaces[number];

export const environments = ['city', 'apartment', 'dawn', 'forest', 'lobby', 'night', 'park', 'studio', 'sunset', 'warehouse', undefined] as const;
export type Environments = typeof environments[number];
