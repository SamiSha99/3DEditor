export type KeyToValueOfType<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T] & string;

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>

/** 
 * Constraints numbers into a range of values, exclusive to true numbers. Limited to 1000 range. 
 * 
 * Range is Min to (Max-1);
 * */
export type Range<Min extends number, Max extends number> = Exclude<Enumerate<Max>, Enumerate<Min>>

export const transformModes = ['translate', 'rotate', 'scale'] as const;
export type TransformModes = typeof transformModes[number];

export const transformSpaces = ['world', 'local'] as const;
export type TransformSpaces = typeof transformSpaces[number];

// For the menu bar buttons
export type MenuButtonProps = { onclick: (opened: boolean) => void; }

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