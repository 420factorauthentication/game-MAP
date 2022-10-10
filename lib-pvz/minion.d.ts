export class Minion {
    type: MinionType;
    elem: HTMLElement;
    #x: number;
    get x (): number
    set x (v)
    #y: number;
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
    constructor (movSpd: number, atkSpd: number, atkDmg: number)
    spawnAt (spawner: MinionSpawner, minionElem?: HTMLElement) : Minion
}


export class MinionSpawner {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    constructor (minX?: number, maxX?: number,  minY?: number, maxY?: number)
    spawn (minionType: MinionType, minionElem?: HTMLElement) : Minion
}
