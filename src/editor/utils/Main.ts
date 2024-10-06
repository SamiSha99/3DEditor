/** Asynched sleep. */
export const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));
/** Returns a number with X amount of decimals, stripped from unnecessary 0s */
export const toFixedStripped = (value: number | string, fractionDigits: number) => { return parseFloat((typeof value == 'string' ? parseFloat(value) : value).toFixed(fractionDigits)).toString(); }