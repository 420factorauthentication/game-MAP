import * as METH from "../lib-meth/meth.js";



export class Minion {
    type: MinionType;
    elem: HTMLElement;

    #x: number;
    get x()  {return this.#x;}
    set x(v) {
        this.#x = v;
        this.elem.style.left = '' + v + "px";
    }

    #y: number;
    get y()  {return this.#y;}
    set y(v) {
        this.#y = v;
        this.elem.style.top = '' + v + "px";
    }
    
    constructor(
        x: number,
        y: number,
        type: MinionType,
        elem?: HTMLElement,
    ){
        if (elem)
            this.elem = elem;
        else {
            this.elem = <HTMLElement> document.createElement("a");
            this.elem.style.position = "absolute";
            this.elem.style.width = "64px";
            this.elem.style.height = "64px";
            this.elem.style.background = "content-box radial-gradient(crimson, skyblue)";
            document.body.appendChild(this.elem);
        }
        this.x = x;
        this.y = y;
        this.type = type;
    }
}



export class MinionType {
    movSpd: number;
    atkSpd: number;
    atkDmg: number;

    constructor (movSpd: number, atkSpd: number, atkDmg: number) {
        this.movSpd = movSpd;
        this.atkSpd = atkSpd;
        this.atkDmg = atkDmg;
    }

    spawnAt (spawner: MinionSpawner, minionElem?:HTMLElement) {
        return spawner.spawn(this, minionElem);
    }
}



export class MinionSpawner {
    minX: number = 480;
    maxX: number = 600;
    minY: number = 40;
    maxY: number = 440;

    constructor (
        minX: number = 480,
        maxX: number = 600,
        minY: number = 40,
        maxY: number = 440,
    ){
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }

    spawn (minionType: MinionType, minionElem?: HTMLElement) {
        return new Minion (
            METH.rand (this.minX, this.maxX),
            METH.rand (this.minY, this.maxY),
            minionType,
            minionElem,
        );
    }
}
