import { MS } from "../lib-meth/types";


export interface StatMod {
    readonly key: string;
    readonly amount: number;
    readonly time: MS;  // 0 = permanent
}

export interface StatContainer {
    get mods(): readonly StatMod[];
}
