import { Hz, PXperSEC } from "../lib-meth/types";


export interface Base {
    hp: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface MinionType {
    movSpd: PXperSEC;
    atkSpd: Hz;
    atkDmg: number;
}
