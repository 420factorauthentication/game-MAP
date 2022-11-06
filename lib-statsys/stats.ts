/** @format */

import {ms} from "../lib-meth/types.js";
import {StatMod} from "./types.js";

import uuidv4 from "../node_modules/uuid/dist/esm-browser/v4.js";

////////////////////////////////////////////////////////////////////////////////

class Stats {
    // Stats.base[key]: Get base stat number
    constructor(public base: object) {
        Object.preventExtensions(this);
    }

    // Stats.current(key): Get current stat number
    current(key: string) {
        let value = this.base[key];
        if (typeof value !== "number") return value;
        if (this.diffs[key]) value += this.diffs[key];
        return value;
    }

    // Unlogged, permanent stat adjustment
    change(key: string, amount: number) {
        if (typeof this.base[key] !== "number")
            throw new Error("Cant change non-number stat");
        if (!this.diffs[key]) this.diffs[key] = 0;
        this.diffs[key] += amount;
    }

    // Log an object: Temporary or permanent stat adjustment
    // Returns Tuple [uuid, PROMISE]
    // After time, PROMISE resolves to
    //   true if mod expired naturally or time=0
    //   false if mod was manually removed before expiration
    //     (still waits full time before resolving to false)
    addMod(key: string, amount: number, time: ms): [string, Promise<boolean>] {
        if (typeof this.base[key] !== "number")
            throw new Error("Cant mod non-number stat");

        const uuid: string = uuidv4();
        const newMod: StatMod = Object.freeze({uuid, key, amount, time});
        this.change(key, amount);
        this.#mods.push(newMod);

        let modEndPromise: Promise<boolean>;
        if (time <= 0) modEndPromise = new Promise<boolean>(() => true);
        else
            modEndPromise = new Promise<boolean>((resolve) => {
                setTimeout(resolve, time);
            }).then(() => this.removeMod(uuid));

        return [uuid, modEndPromise];
    }

    // Delete logged object, Revert stat adjustment
    // Returns true if mod found and removed
    // Returns false if mod not found
    removeMod(uuid: string) {
        if (!this.containsMod(uuid)) return false;
        const mod = this.getMod(uuid);
        this.#mods.splice(this.getModIndex(uuid), 1);
        this.change(mod.key, -mod.amount);
        return true;
    }

    // Tracks unlogged and logged adjustment totals
    private diffs = {};

    // All logged stat adjustment objects
    #mods: StatMod[] = [];
    get mods(): readonly StatMod[] {
        return Object.freeze(Object.assign({}, this.#mods));
    }

    // HELPER FUNCTIONS
    containsMod(uuid: string) {
        return this.#mods.some((mod) => mod.uuid === uuid);
    }

    getModIndex(uuid: string) {
        return this.#mods.findIndex((mod) => mod.uuid === uuid);
    }

    getMod(uuid: string) {
        return this.#mods.find((mod) => mod.uuid === uuid);
    }
}

////////////////////////////////////////////////////////////////////////////////

export default Stats;
