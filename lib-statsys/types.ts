/** @format */

import {ms} from "../lib-meth/types";

export interface StatMod {
    readonly key: string;
    readonly amount: number;
    readonly time: ms; // 0 = permanent
}
