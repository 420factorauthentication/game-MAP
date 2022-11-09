/** @format */

////////////////////////////////////////////////////////////////////////////////

/**
 * A number adjustment that expires after a set time.
 * @prop {number} time - Milliseconds
 */
export interface StatMod {
    /** A globally unique id, different from all existing StatMods. */
    readonly uuid: string;
    /** The object key of the property to change. */
    readonly key: string;
    /** The amount to change the value by. */
    readonly amount: number;
    /** How long the StatMod lasts. A time of 0 creates a permanent mod. */
    readonly time: number;
}
