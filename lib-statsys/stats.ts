import { MS } from "../lib-meth/types.js";
import { StatMod } from "./types.js";


class Stats {
    // obj.base[key]: Get base stat
    constructor (public base: object) {}

    // obj.current(key): Get current stat
    current (key: string) {
        let value = this.base[key];
        if (value === undefined || value === null)   return value;
        if (this.changes[key] !== undefined)         value += this.changes[key];
        return value;
    }

    // Change current stat without adding a modifier
    change (key: string, amount: number) {
        if (this.changes[key] === undefined)
            this.changes[key] = 0;
        this.changes[key] += amount;
        return this.changes[key];
    }

    // Add stat modifier
    addMod (key: string, amount: number, time: MS) {
        const newMod: StatMod = {key, amount, time};
        this.#mods.push(newMod);
        this.change(key, amount);
        if (time <= 0) return;
        setTimeout(() => {
            this.#mods.splice (this.#mods.indexOf(newMod), 1);
            this.change(key, -amount);
        }, time);
    }

    // All temporary and permanent stat modifiers
    #mods: StatMod[] = [];
    get mods(): readonly StatMod[] {return this.#mods;}

    // Tracks modified stat numbers
    private changes = {};
}

export default Stats;
