/** @format */

import {ms} from "../lib-meth/types";

export interface StatMod {
    key: string;
    amount: number;
    time: ms; // 0 = permanent
}
