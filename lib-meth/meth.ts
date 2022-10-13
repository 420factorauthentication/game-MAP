export function rand (min: number, max: number) {
    return min + Math.random() * (max - min);
}

export type Hz = number;        // Hertz (1/second)
export type MS = number;        // Milliseconds
export type PXperSEC = number;  // Pixels per Second

export type percent = number;  // 0 to 0.9999999...

export type timeoutID = number;   // An event ID returned by setTimeout()
export type intervalID = number;  // An event ID returned by setInterval()

export type htmlAttributeName = string;
export type htmlAttributeValue = string;
export type cssPropertyName = string;
export type cssPropertyValue = string;
