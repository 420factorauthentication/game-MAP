/** @format */

import {
    Hz,
    viewPerSec,
    ms,
    vw,
    vh,
    htmlAttributeValue,
} from "../lib-meth/types";

export interface BaseEntity {
    hp: number;
    x: vw;
    y: vh;
}

export interface MinionType {
    hp: number;
    movSpd: viewPerSec;
    atkSpd: Hz;
    atkDmg: number;
}

export interface MinionEntity {
    readonly manager: MinionManager;
    readonly type: MinionType;
    readonly target: BaseEntity;
    x: number;
    y: number;
    get hp(): number;
    get movSpd(): viewPerSec;
    get atkSpd(): Hz;
    get atkDmg(): number;
    modHp: (amount: number, time: ms) => void;
    modMovSpd: (amount: viewPerSec, time: ms) => void;
    modAtkSpd: (amount: Hz, time: ms) => void;
    modAtkDmg: (amount: number, time: ms) => void;
    changeHp: (amount: number) => void;
    changeMovSpd: (amount: viewPerSec) => void;
    changeAtkSpd: (amount: Hz) => void;
    changeAtkDmg: (amount: number) => void;
    die: () => void;
}

export interface MinionManager {
    minions: readonly MinionEntity[];
    minionsSortX: readonly MinionEntity[];
    startLevel(level: SpawnGroup[]);
    kill(minion: MinionEntity): void;
    spawn(
        type: MinionType,
        initOptions?: {
            elem?: HTMLElement;
            parent?: Node;
            htmlClass?: htmlAttributeValue;
        }
    );
}

export interface SpawnGroup {
    type: MinionType;
    amount: number;
    timeStart: ms;
    timeStep: ms;
}
