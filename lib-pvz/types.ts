import { Hz, viewPerSec, ms, vw, vh } from "../lib-meth/types";


export interface Base {
    hp    : number;
    x     : vw;
    y     : vh;
    width : vw;
    height: vh;
}

export interface MinionType {
    hp    : number;
    movSpd: viewPerSec;
    atkSpd: Hz;
    atkDmg: number;
}

export interface MinionEntity {
    readonly manager: MinionManager;
    readonly type   : MinionType;
    readonly target : Base;
    x: number;
    y: number;
    hp    : number;
    movSpd: viewPerSec;
    atkSpd: Hz;
    atkDmg: number;
    modHp       : (amount: number, time: ms)     => void;
    modMovSpd   : (amount: viewPerSec, time: ms) => void;
    modAtkSpd   : (amount: Hz, time: ms)         => void;
    modAtkDmg   : (amount: number, time: ms)     => void;
    changeHp    : (amount: number)               => void;
    changeMovSpd: (amount: viewPerSec)           => void;
    changeAtkSpd: (amount: Hz)                   => void;
    changeAtkDmg: (amount: number)               => void;
    die: () => void;
}

export interface MinionManager {
    get minions()     : readonly MinionEntity[];
    get minionsSortX(): readonly MinionEntity[];
    kill (minion: MinionEntity): void;
}
