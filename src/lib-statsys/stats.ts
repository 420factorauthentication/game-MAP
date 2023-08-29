/** @format */

import {StatMod} from "./types.js";

import uuidv4 from "../../node_modules/uuid/dist/esm-browser/v4.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A system for tracking asynchronous stat number changes. */
export class Stats {
    /**
     * @param base Can be any object.
     * All of it's accessible properties serve as starting numbers.
     */
    constructor(public base: object) {
        Object.preventExtensions(this);
    }

    /**
     * Get the current number of a Base property: Base Number + StatMods + Changes.
     * If Base property isn't a number, returns the Base property.
     *
     * @param key The key of the Base property.
     */
    current(key: string): number | any {
        if (typeof this.base[key] !== "number") return this.base[key];

        // Start with base number
        let value = this.base[key];

        // Add Changes and StatMods
        if (this.#diffs[key]) value += this.#diffs[key];

        // Return total
        return value;
    }

    /**
     * Adjust a number permanently, without tracking it through a StatMod.
     * Useful when you want to permanently change numbers with less overhead.
     *
     * @param key The key of the Base property being adjusted.
     * The Base property is not mutated; this adjustment is tracked separately.
     * @param amount The number adjustment.
     */
    change(key: string, amount: number) {
        if (typeof this.base[key] !== "number")
            throw new Error("Cant change non-number stat");

        // Init undefined array props
        if (!this.#diffs[key]) this.#diffs[key] = 0;
        if (!this.#changes[key]) this.#changes[key] = 0;

        // Write down number adjustment
        this.#diffs[key] += amount;
        this.#changes[key] += amount;

        // Clean up unused array props
        if (this.#diffs[key] == 0) this.#diffs[key] = undefined;
        if (this.#changes[key] == 0) this.#changes[key] = undefined;
    }

    /** Remove all Changes and revert their number adjustments. */
    removeAllChanges() {
        for (const key in this.#changes) this.#diffs[key] -= this.#changes[key];
        for (const key in this.#changes) this.#changes[key] = undefined;
    }

    /** Get a readonly list of all Changes. */
    get changes(): Readonly<{}> {
        return Object.freeze(Object.assign({}, this.#changes));
    }
    #changes = {};

    /**
     * Add a timed (or sometimes permanent) effect that adjusts a number.
     *
     * Returns Tuple [Uuid, Promise]. \
     * After StatMod Time, Promise resolves to:
     *
     * TRUE if StatMod ended naturally or StatMod Time is 0 (permanent). \
     * FALSE if StatMod was manually removed before the full StatMod Time elapsed.
     *
     * Even if FALSE is returned, it still waits the full StatMod Time to resolve.
     *
     * @param key The key of the Base property being adjusted.
     * The Base property is not mutated; this adjustment is tracked separately.
     * @param amount The number adjustment.
     * @param time How long the StatMod lasts, in ms.
     */
    addMod(
        key: string,
        amount: number,
        time: number
    ): [string, Promise<boolean>] {
        if (typeof this.base[key] !== "number")
            throw new Error("Cant mod non-number stat");

        // Generate a new uuid and StatMod object
        const uuid: string = uuidv4();
        const newMod: StatMod = Object.freeze({uuid, key, amount, time});
        this.#mods.push(newMod);

        // Calculate number adjustment
        if (!this.#diffs[key]) this.#diffs[key] = 0;
        this.#diffs[key] += amount;
        if (this.#diffs[key] == 0) this.#diffs[key] = undefined;

        // If StatMod Time is 0 (permanent), return insta-resolving promise
        let modEndPromise: Promise<boolean>;
        if (time <= 0) modEndPromise = new Promise<boolean>(() => true);
        // Otherwise, return a promise that resolves after StatMod Time
        else
            modEndPromise = new Promise<boolean>((resolve) => {
                setTimeout(resolve, time);
            }).then(() => this.removeMod(uuid));

        // Return Tuple
        return [uuid, modEndPromise];
    }

    /**
     * Remove a StatMod prematurely and revert it's number adjustment.
     *
     * Returns false if StatMod not found. \
     * Returns true if StatMod is found and successfully removed.
     *
     * @param uuid The globally unique id of the StatMod to remove.
     */
    removeMod(uuid: string): boolean {
        const mod = this.getMod(uuid);
        if (!mod) return false;

        // Cleanup StatMod object
        this.#mods.splice(this.getModIndex(uuid), 1);

        // Revert stat number adjustment
        this.change(mod.key, -mod.amount);

        // StatMod was found and successfully removed
        return true;
    }

    /** Remove all StatMods prematurely and revert their number adjustments. */
    removeAllMods() {
        for (const key in this.#mods) this.removeMod(this.mods[key].uuid);
    }

    /** Get a readonly list of all StatMods. */
    get mods(): readonly StatMod[] {
        return Object.freeze(Object.assign({}, this.#mods));
    }
    #mods: StatMod[] = [];

    //////////////////////
    // HELPER FUNCTIONS //
    //////////////////////
    containsMod(uuid: string) {
        return this.#mods.some((mod) => mod.uuid === uuid);
    }

    getModIndex(uuid: string) {
        return this.#mods.findIndex((mod) => mod.uuid === uuid);
    }

    getMod(uuid: string) {
        return this.#mods.find((mod) => mod.uuid === uuid);
    }

    ///////////////////
    // PRIVATE CACHE //
    ///////////////////

    /** A private cache of Changes + StatMods to calculate current numbers faster. */
    #diffs = {};
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Stats;
