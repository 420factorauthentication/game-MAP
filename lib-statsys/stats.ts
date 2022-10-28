import { ms } from "../lib-meth/types.js";
import { StatMod } from "./types.js";


class Stats {
    // obj.base[key]: Get base stat
    constructor (public base: object) {Object.preventExtensions(this);}

    // obj.current(key): Get current stat
    current (key: string) {
        let value = this.base[key];
        if (value === undefined || value === null)   return value;
        if (this.changes[key] !== undefined)         value += this.changes[key];
        return value;
    }

    // Permanent adjustment to current stat
    // Returns difference between base and current
    change (key: string, amount: number) {
        if (this.changes[key] === undefined)
            this.changes[key] = 0;
        return this.changes[key] += amount;
    }

    // Temporary or permanent adjustment to current stat
    // Returns difference between base and current
    addMod (key: string, amount: number, time: ms) {
        const newMod: StatMod = {key, amount, time};
        this.#mods.push(newMod);
        if (time <= 0)
            return this.change(key, amount);
        setTimeout(() => {
            this.#mods.splice (this.#mods.indexOf(newMod), 1);
            this.change(key, -amount);
        }, time);
        return this.change(key, amount);
    }

    // Removes a stat modifier in progress
    // Reverts it's value adjustment
    // Returns difference between base and current, after mod ends
    removeMod (mod: StatMod) {
        const index = this.#mods.indexOf(mod)
        if (index === -1) return;
        this.#mods.splice (this.#mods.indexOf(mod), 1);
        return this.change(mod.key, -mod.amount);
    }

    // All temporary and permanent stat modifiers
    #mods: StatMod[] = [];
    get mods(): readonly StatMod[] {return this.#mods;}

    // Tracks the difference between base and current
    private changes = {};
}

export default Stats;
