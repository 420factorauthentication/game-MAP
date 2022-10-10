import * as METH from "../meth/meth.lib.js";

export class Base {
    hp: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

export class Minion {
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
    #x: number;
    get x() {return this.#x;}
    set x (v:number) {
        this.#x = v;
        this.elem.style.left = "" + v + "px";
    }
    #y: number;
    get y() {return this.#y;};
    set y (v:number) {
        this.#y = v;
        this.elem.style.top = "" + v + "px";
    };
    type: MinionType;
    elem: HTMLElement;
}

export class MinionType {
    constructor(
        movSpd: number,
        atkSpd: number,
        atkDmg: number,
        spawnMinX: number,
        spawnMaxX: number,
        spawnMinY: number,
        spawnMaxY: number,
    ){
        this.movSpd = movSpd;
        this.atkSpd = atkSpd;
        this.atkDmg = atkDmg;
        this.spawnMinX = spawnMinX;
        this.spawnMaxX = spawnMaxX;
        this.spawnMinY = spawnMinY;
        this.spawnMaxY = spawnMaxY;
    };
    movSpd: number;
    atkSpd: number;
    atkDmg: number;
    spawnMinX: number;
    spawnMaxX: number;
    spawnMinY: number;
    spawnMaxY: number;
    spawn (elem?:HTMLElement) {
        return new Minion (
            METH.rand (this.spawnMinX, this.spawnMaxX),
            METH.rand (this.spawnMinY, this.spawnMaxX),
            this,
            elem,
        );
    };
}
