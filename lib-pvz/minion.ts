import * as METH from "../lib-meth/meth.js";



export interface MinionType {
    movSpd: number;
    atkSpd: number;
    atkDmg: number;
}



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



export class MinionSpawner {
    constructor (
        public minX: number = 480,
        public maxX: number = 600,
        public minY: number = 40,
        public maxY: number = 440,
    ){}
    
    spawn (minionType: MinionType, minionElem?: HTMLElement) {
        return new Minion (
            METH.rand (this.minX, this.maxX),
            METH.rand (this.minY, this.maxY),
            minionType,
            minionElem,
        );
    }
}
