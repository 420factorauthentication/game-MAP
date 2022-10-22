import { MS } from "../lib-meth/types.js";
import { StatMod } from "./types.js";


class Stats {
    // StatsObj.base[key]: Get base stat
    constructor (public base: object) {}

    // StatsObj.current(key): Get current stat
    current (key: string) {
        let value = this.base[key];
        if (value === undefined || value === null) return value;
        for (const mod of this.mods) if (mod.key == key) value += mod.amount;
        return value;
    }
    
    // All temporary and permanent stat modifiers
    #mods: StatMod[] = [];
    get mods(): readonly StatMod[] {return this.#mods;}

    // Add stat modifier
    addMod (key: string, amount: number, time: MS) {
        const newMod: StatMod = {key, amount, time};
        this.#mods.push(newMod);
        if (time <= 0) return;
        setTimeout(() => {this.#mods.splice (this.#mods.indexOf(newMod), 1);}, time);
    }
}

export default Stats;
