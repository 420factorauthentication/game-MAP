import { MS } from "../lib-meth/types";


export interface StatMod {
    key: string;
    amount: number;
    time: MS;  // 0 = permanent
}
