// Asynched sleep
export const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));
// returns a number with X amount of decimals, stripped from unnecessary 0s
export const toFixedStripped = (value: number, fractionDigits: number) => { return parseFloat(value.toFixed(fractionDigits)) }