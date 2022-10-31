/** @format */

export function rand(min: number, max: number) {
    return min + Math.random() * (max - min);
}

//RANDOM ALPHANUMERIC STRING
//SOURCE: https://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
// This will produce a string anywhere between zero and 12 characters long, usually 11 characters, due to the fact that floating point stringification removes trailing zeros.
// It won't generate capital letters, only lower-case and numbers.
// Because the randomness comes from Math.random(), the output may be predictable and therefore not necessarily unique.
// Even assuming an ideal implementation, the output has at most 52 bits of entropy, which means you can expect a duplicate after around 70M strings generated.
export function randStr() {
    return Math.random().toString(36).slice(2);
}
