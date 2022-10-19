import { Base, MinionType } from "./types";
import { State } from "../lib-smac/types";
import { htmlAttributeValue } from "../lib-meth/types";

import { StateMachine } from "../lib-smac/smac.js";
import { rand } from "../lib-meth/meth.js";

import Spriteling from "../node_modules/spriteling/dist/spriteling.js";


/////////////////////////////////////////////////////////////
// An enemy represented by an HTMLElement                  //
// Moves left until it reaches a target Base, then attacks //
/////////////////////////////////////////////////////////////
export class Minion {
    readonly type: MinionType;
    readonly target: Base;
    readonly elem: HTMLElement;
    readonly ai: StateMachine;
    readonly spriteling: Spriteling;

    #x: number;
    get x ()  {return this.#x;}
    set x (v) {
        this.#x = v;
        this.elem.style.left = '' + v + "px";
    }

    #y: number;
    get y ()  {return this.#y;}
    set y (v) {
        this.#y = v;
        this.elem.style.top = '' + v + "px";
    }

    readonly moveState: State;
    readonly attackState: State;
    
    constructor (
        x: number,
        y: number,
        type: MinionType,
        target: Base,
        initOptions?: {
            elem?: HTMLElement,
            parent?: Node,
            htmlClass?: htmlAttributeValue,
        }
    ){
        if (initOptions?.elem)
            this.elem = initOptions.elem;
        else
            this.elem = Minion.getInitElem();

        if (initOptions?.parent)
            initOptions?.parent.appendChild(this.elem);

        if (initOptions?.htmlClass)
            this.elem.className += ' ' + initOptions.htmlClass;

        this.x = x;
        this.y = y;
        this.type = type;
        this.target = target;

        this.moveState = this.getInitAiMoveState();
        this.attackState = this.getInitAiAttackState();
        
        this.ai = new StateMachine();
        this.ai.set(this.moveState);
    }

    protected static getInitElem() {
        const elem = <HTMLElement> document.createElement("a");
        elem.style.position = "absolute";
        elem.style.width = "64px";
        elem.style.height = "64px";
        elem.style.background = "content-box radial-gradient(crimson, skyblue)";
        document.body.appendChild(elem);
        return elem;
    }

    protected getInitAiMoveState() {
        const moveState: State = {
            name: "minionMove",
            loopTime: (1000 / this.type.movSpd),
            onLoop: () => {
                if (--this.x < this.target.x)
                    this.ai.set(this.attackState);
            },
        };
        return moveState;
    }

    protected getInitAiAttackState() {
        const attackState: State = {
            name: "minionAttack",
            loopTime: (1000 / this.type.atkSpd),
            onLoop: () => {
                this.target.hp -= this.type.atkDmg;
            }
        };
        return attackState;
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
    
    spawn (
        type: MinionType,
        initOptions?: {
            elem?: HTMLElement,
            parent?: Node,
            htmlClass?: htmlAttributeValue,
        }
    ){
        return new Minion (
            rand (this.minX, this.maxX),
            rand (this.minY, this.maxY),
            type,
            this.target,
            initOptions,
        );
    }
}
