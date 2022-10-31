/** @format */

import {ms} from "../lib-meth/types.js";
import {StatMod} from "./types.js";

import {v4 as uuidv4} from "uuid";

class Stats {
    // Base stat number
    constructor(public base: object) {
        Object.preventExtensions(this);
    }

    // Current stat number
    current(key: string) {
        let value = this.base[key];
        if (typeof value !== "number") return value;
        if (this.diffs[key]) value += this.diffs[key];
        return value;
    }

    // Adjust stat permanently
    change(key: string, amount: number) {
        if (typeof this.base[key] !== "number")
            throw new Error("Cant change non-number stat");
        if (!this.diffs[key]) this.diffs[key] = 0;
        this.diffs[key] += amount;
    }

    // Adjust stat temporarily or permanently
    // Returns Tuple [uuid, modEndPromise]
    //  After mod.time, modEndPromise resolves to
    //   true if mod expired naturally or mod.time = 0 (permanent)
    //   false if mod was manually removed before expiration
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
            }).then(() => {
                return this.removeMod(uuid);
            });

        return [uuid, modEndPromise];
    }

    // End temporary/permanent stat adjustment
    // Returns true if mod was found and removed, false if not found
    removeMod(uuid: string) {
        if (!this.containsMod(uuid)) return false;
        const mod = this.getMod(uuid);
        this.#mods.splice(this.getModIndex(uuid), 1);
        this.change(mod.key, -mod.amount);
        return true;
    }

    // Tracks adjustment totals
    private diffs = {};

    // All temporary/permanent stat adjustments
    #mods: StatMod[] = [];
    get mods(): readonly StatMod[] {
        return Object.freeze(Object.assign({}, this.#mods));
    }

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

export default Stats;
