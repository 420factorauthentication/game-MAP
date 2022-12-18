/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export function rand(min: number, max: number) {
    return min + Math.random() * (max - min);
}

//random alphanumeric string. 0-12 chars long. no capitals. not always unique.
//source: https://stackoverflow.com/questions/10726909/
export function randStr() {
    return Math.random().toString(36).slice(2);
}
