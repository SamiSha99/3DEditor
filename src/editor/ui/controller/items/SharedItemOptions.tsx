export const MOUSE_ENTER_DELAY = 0.5;
export const PRECISION_AMOUNT = 3;

export const labelFromVariable = (variable: string) => {
    let title = variable.replace(/([a-z])([A-Z])/g, '$1 $2');
    return title.charAt(0).toUpperCase() + title.slice(1);
}