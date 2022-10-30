/** @format */

import {ms} from "../lib-meth/types.js";
import {StatMod} from "./types.js";

class Stats {
    // Base stat number
    constructor(public base: object) {
        Object.preventExtensions(this);
    }

    // Current stat number
    current(key: string) {
        let value = this.base[key];
        if (typeof value !== "number") return value;
        if (this.diffs[key] !== undefined) value += this.diffs[key];
        return value;
    }

    // Adjust Current permanently
    // Returns Diff (Current - Base)
    change(key: string, amount: number) {
        if (typeof this.base[key] !== "number")
            throw new Error("Cant change non-number stat");
        if (typeof this.diffs[key] !== "number") this.diffs[key] = 0;
        return (this.diffs[key] += amount);
    }

    // Adjust Current temporarily or permanently
    // Returns Diff (Current - Base) after adjustment
    addMod(key: string, amount: number, time: ms) {
        if (typeof this.base[key] !== "number")
            throw new Error("Cant mod non-number stat");
        const newMod: StatMod = {key, amount, time};
        this.#mods.push(newMod);
        if (time <= 0) return this.change(key, amount);
        setTimeout(() => {
            this.#mods.splice(this.#mods.indexOf(newMod), 1);
            this.change(key, -amount);
        }, time);
        return this.change(key, amount);
    }

    // End temporary/permanent adjustment to Current
    // Returns Diff (Current - Base) after adjustment end
    removeMod(index: number);
    removeMod(mod: StatMod);
    removeMod(v: number | StatMod) {
        const index = typeof v === "number" ? v : this.#mods.indexOf(v);
        const mod = typeof v === "number" ? this.mods[index] : v;
        if (index < 0) return;
        if (mod === undefined || mod === null) return;
        this.#mods.splice(index, 1);
        return this.change(mod.key, -mod.amount);
    }

    // Base + Diff = Current
    private diffs = {};

    // All temporary/permanent adjustments to Current
    #mods: StatMod[] = [];
    get mods(): readonly StatMod[] {
        return this.#mods;
    }
}

export default Stats;
