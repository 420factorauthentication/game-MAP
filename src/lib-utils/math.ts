/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export function rand(min: number, max: number) {
    return min + Math.random() * (max - min);
}

/**
 * Random alphanumeric string. 0-12 chars long. No capitals. Not always unique.
 * @see https://stackoverflow.com/questions/10726909/
 */
export function randStr() {
    return Math.random().toString(36).slice(2);
}
