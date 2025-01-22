/** Asynched sleep. */
export const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));
/** Returns a number with X amount of decimals, stripped from unnecessary 0s */
export const toFixedStripped = (value: number | string, fractionDigits: number) => { return parseFloat((typeof value == 'string' ? parseFloat(value) : value).toFixed(fractionDigits)).toString(); }

export const isFileImage = (file: File) => { return file && file['type'].split('/')[0] === 'image' };

/** 
 * Returns a list of keys that are found in both objects 
 * 
 * Both parameters should be a list of keys
*/
export const commonKeys = (obj1Keys: string[], obj2Keys: string[]) => obj1Keys.filter((key) => obj2Keys.includes(key));

export const getAllPropertyNames = (obj: any): string[] => {
    let props: string[] = [];
    do {
        props = props.concat(Object.getOwnPropertyNames(obj));
        obj = Object.getPrototypeOf(obj);
    } while (obj && obj !== Object.prototype);

    return props;
}
