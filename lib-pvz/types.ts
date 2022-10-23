import { Hz, PXperSEC, MS } from "../lib-meth/types";


export interface Base {
    hp: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface MinionType {
    hp: number;
    movSpd: PXperSEC;
    atkSpd: Hz;
    atkDmg: number;
}

export interface MinionEntity {
    readonly manager: MinionManager;
    readonly type: MinionType;
    readonly target: Base;
    get x (): number;
    get y (): number;
    set x (v);
    set y (v);
    get hp ();
    get movSpd ();
    get atkSpd ();
    get atkDmg ();
    modHp (amount: number, time: MS): void;
    modMovSpd (amount: number, time: MS): void;
    modAtkSpd (amount: number, time: MS): void;
    modAtkDmg (amount: number, time: MS): void;
    changeHp (amount: number): void;
    changeMovSpd (amount: number): void;
    changeAtkSpd (amount: number): void;
    changeAtkDmg (amount: number): void;
    die(): void;
}

export interface MinionManager {
    get minions(): readonly MinionEntity[];
    get minionsSortedByX(): readonly MinionEntity[];
    kill (minion: MinionEntity): void;
}
