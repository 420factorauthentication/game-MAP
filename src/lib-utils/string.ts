/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export function insertAt(original: string, index: number, insert: string) {
    return [original.slice(0, index), insert, original.slice(index)].join("");
}

export function replaceAt(
    original: string,
    index: number,
    replacement: string
) {
    return (
        original.substring(0, index) +
        replacement +
        original.substring(index + replacement.length)
    );
}
