export class Base {
    hp: number;
    x: number;
    y: number;
    width: number;
    height: number;
}


export class Minion extends HTMLElement {
    type: MinionType;
    elem: HTMLElement;
    _x: number;
    get x (): number
    set x (v)
    _y: number;
    get y (): number
    set y (v)
    constructor(
        x: number,
        y: number,
        type: MinionType,
        elem?: HTMLElement,
    )
}


export class MinionType {
    movSpd: number;
    atkSpd: number;
    atkDmg: number;
    spawnMinX: number;
    spawnMaxX: number;
    spawnMinY: number;
    spawnMaxY: number;
    constructor(
        movSpd: number,
        atkSpd: number,
        atkDmg: number,
        spawnMinX: number,
        spawnMaxX: number,
        spawnMinY: number,
        spawnMaxY: number,
    )
    spawn (elem?:HTMLElement) : Minion
}
