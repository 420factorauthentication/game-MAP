import { Base, MinionEntity, MinionManager, MinionType } from "./types";
import { State } from "../lib-smac/types";
import { cssPropertyName, htmlAttributeValue, MS } from "../lib-meth/types";

import StateMachine from "../lib-smac/smac.js";
import Stats from "../lib-statsys/stats.js";

import Spriteling from "../node_modules/spriteling/dist/spriteling.js";


/////////////////////////////////////////////////////////////
// An enemy represented by an HTMLElement                  //
// Moves left until it reaches a target Base, then attacks //
/////////////////////////////////////////////////////////////
class Minion implements MinionEntity {

    ////////////
    // CONFIG //
    ////////////
    constructor (
        readonly manager: MinionManager,
        readonly type: MinionType,
        readonly target: Base,
        private _x: number,
        private _y: number,
        initOptions?: {
            elem?: HTMLElement,
            parent?: Node,
            htmlClass?: htmlAttributeValue,
        },
    ){
        this.parseInitOptions (initOptions);
        this.ai.set (this.moveState);
    }


    /////////
    // API //
    /////////
    get x ()  {return this._x;}
    get y ()  {return this._y;}

    set x (v)  {this._x = v;  this.setPos("left", v);}
    set y (v)  {this._y = v;  this.setPos("top", v);}

    get hp     ()  {return this.stats.current("hp");}
    get movSpd ()  {return this.stats.current("movSpd");}
    get atkSpd ()  {return this.stats.current("atkSpd");}
    get atkDmg ()  {return this.stats.current("atkDmg");}

    modHp (amount: number, time: MS) {
        this.stats.addMod ("hp", amount, time);
        if (this.hp <= 0) this.manager.kill(this);
        setTimeout(() => {if (this.hp <= 0) this.manager.kill(this);}, time);
    }
    modMovSpd (amount: number, time: MS) {
        this.stats.addMod ("movSpd", amount, time);
        this.refreshMoveState();
        setTimeout(() => {this.refreshMoveState();}, time+1);
    }
    modAtkSpd (amount: number, time: MS) {
        this.stats.addMod ("atkSpd", amount, time);
        this.refreshAttackState();
        setTimeout(() => {this.refreshAttackState();}, time+1);
    }
    modAtkDmg (amount: number, time: MS) {
        this.stats.addMod ("atkDmg", amount, time);
        this.refreshAttackState();
        setTimeout(() => {this.refreshAttackState();}, time+1);
    }

    changeHp (amount: number) {
        this.stats.change ("hp", amount);
        if (this.hp <= 0) this.manager.kill(this);
    }
    changeMovSpd (amount: number) {
        this.stats.change ("movSpd", amount);
        this.refreshMoveState();
    }
    changeAtkSpd (amount: number) {
        this.stats.change ("atkSpd", amount);
        this.refreshAttackState();
    }
    changeAtkDmg (amount: number) {
        this.stats.change ("atkDmg", amount);
        this.refreshAttackState();
    }


    ////////////////
    // COMPONENTS //
    ////////////////
    protected elem: HTMLElement = Minion.elemInit;
    protected ai: StateMachine = new StateMachine();
    protected stats: Stats = new Stats(this.type);
    // protected anim: Spriteling = this.spritelingInit;

    protected moveState: State = this.moveStateInit;
    protected attackState: State = this.attackStateInit;
    protected static dieState: State = {name: "minionDie"};


    //////////
    // INIT //
    //////////
    private parseInitOptions (initOptions?: {
        elem?: HTMLElement,
        parent?: Node,
        htmlClass?: htmlAttributeValue,
    }){
        if (!initOptions)          return;
        if (initOptions.elem)      this.elem = initOptions.elem;
        if (initOptions.parent)    this.parent = initOptions.parent;
        if (initOptions.htmlClass) this.htmlClass = initOptions.htmlClass;
    }

    private set parent (parentElem: Node) {
        parentElem.appendChild(this.elem);
    }

    private set htmlClass (htmlClass: htmlAttributeValue) {
        this.elem.className += ' ' + htmlClass;
    }

    private static get elemInit() {
        const elem = <HTMLElement> document.createElement("a");
        elem.style.position = "absolute";
        elem.style.width = "64px";
        elem.style.height = "64px";
        elem.style.background = "content-box radial-gradient(crimson, skyblue)";
        document.body.appendChild(elem);
        return elem;
    }

    // private get spritelingInit() {
    //     return new Spriteling();
    // }

    private get moveStateInit() {
        const moveState: State = {
            name: "minionMove",
            loopTime: (1000 / this.stats.current("movSpd")),
            onLoop: () => {
                if (--this.x < this.target.x)
                    this.ai.set(this.attackState);
            },
        }; return moveState;
    }

    private get attackStateInit() {
        const attackState: State = {
            name: "minionAttack",
            loopTime: (1000 / this.stats.current("atkSpd")),
            onLoop: () => {
                this.target.hp -= this.stats.current("atkDmg");
            }
        }; return attackState;
    }

    //////////////////////
    // HELPER FUNCTIONS //
    //////////////////////
    die() {
        this.ai.set(Minion.dieState);
        this.elem.parentNode.removeChild(this.elem);
    }

    private setPos (cssProp: cssPropertyName, distance: number) {
        this.elem.style[cssProp] = '' + distance + "px";
    }

    private refreshMoveState() {
        this.moveState = this.moveStateInit;
        if (this.ai.currState.name == "minionMove")
            this.ai.set(this.moveState);
    }

    private refreshAttackState() {
        this.attackState = this.attackStateInit;
        if (this.ai.currState.name == "minionAttack")
            this.ai.set(this.attackState);
    }
}

export default Minion;
