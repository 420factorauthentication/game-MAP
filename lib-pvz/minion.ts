////////////////////////
// JavaScript Imports //
////////////////////////

// Functions //
import { rand } from "../lib-meth/meth.js";

// Classes //
import { StateMachine } from "../lib-statemac/statemac.js";


////////////////////////
// TypeScript Imports //
////////////////////////

// Types //
import { Hz, PXperSEC } from "../lib-meth/meth";

// Interfaces //
import { Base } from "./base";
import { State } from "../lib-statemac/statemac";


//////////////////////////
// Defines Minion stats //
//////////////////////////
export interface MinionType {
    movSpd: PXperSEC;
    atkSpd: Hz;
    atkDmg: number;
}


/////////////////////////////////////////////////////////////
// An enemy represented by an HTMLElement                  //
// Moves left until it reaches a target Base, then attacks //
/////////////////////////////////////////////////////////////
export class Minion {
    readonly type: MinionType;
    readonly target: Base;
    readonly elem: HTMLElement;
    readonly ai: StateMachine;

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

    readonly moveState: State;
    readonly attackState: State;
    
    constructor(
        x: number,
        y: number,
        type: MinionType,
        target: Base,
        cssClass?: string,
        parent?: Node,
        elem?: HTMLElement,
    ){
        if (elem)  this.elem = elem;
        else       this.elem = Minion.initElem();
        if (parent) parent.appendChild(this.elem);
        if (cssClass) this.elem.className += ' ' + cssClass;

        this.x = x;
        this.y = y;
        this.type = type;
        this.target = target;

        this.attackState = {
            name: "minionAttack",
            loopTime: (1000 / this.type.atkSpd),
            onLoop: () => {
                this.target.hp -= this.type.atkDmg;
            }
        };
        this.moveState = {
            name: "minionMove",
            loopTime: (1000 / this.type.movSpd),
            onLoop: () => {
                if (--this.x < this.target.x)
                    this.ai.set(this.attackState);
            },
        };
        this.ai = new StateMachine(this.moveState);
    }

    protected static initElem() {
        const elem = <HTMLElement> document.createElement("a");
        elem.style.position = "absolute";
        elem.style.width = "64px";
        elem.style.height = "64px";
        elem.style.background = "content-box radial-gradient(crimson, skyblue)";
        document.body.appendChild(elem);
        return elem;
    }
}


//////////////////////////////////////////////////////////
// Defines a spawn location and target Base for Minions //
//////////////////////////////////////////////////////////
export class MinionSpawner {
    constructor (
        public target: Base,
        public minX: number = 480,
        public maxX: number = 600,
        public minY: number = 40,
        public maxY: number = 440,
    ){}
    
    spawn (type: MinionType,
            cssClass?: string,
            parent?: Node,
            elem?: HTMLElement,
    ){
        return new Minion (
            rand (this.minX, this.maxX),
            rand (this.minY, this.maxY),
            type,
            this.target,
            cssClass,
            parent,
            elem,
        );
    }
}
