import { Base, MinionType } from "./types";
import { State } from "../lib-smac/types";
import { cssPropertyName, htmlAttributeValue } from "../lib-meth/types";

import StateMachine from "../lib-smac/smac.js";

import Spriteling from "../node_modules/spriteling/dist/spriteling.js";


/////////////////////////////////////////////////////////////
// An enemy represented by an HTMLElement                  //
// Moves left until it reaches a target Base, then attacks //
/////////////////////////////////////////////////////////////
class Minion {

    ////////////
    // CONFIG //
    ////////////
    constructor (
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


    ////////////////
    // COMPONENTS //
    ////////////////
    protected elem: HTMLElement = Minion.elemInit;
    protected ai: StateMachine = new StateMachine();
    // protected anim: Spriteling = this.spritelingInit;

    
    ///////////////
    // CONSTANTS //
    ///////////////
    protected moveState: State = this.moveStateInit;
    protected attackState: State = this.attackStateInit;


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
            loopTime: (1000 / this.type.movSpd),
            onLoop: () => {
                if (--this.x < this.target.x)
                    this.ai.set(this.attackState);
            },
        }; return moveState;
    }

    private get attackStateInit() {
        const attackState: State = {
            name: "minionAttack",
            loopTime: (1000 / this.type.atkSpd),
            onLoop: () => {
                this.target.hp -= this.type.atkDmg;
            }
        }; return attackState;
    }

    //////////////////////
    // HELPER FUNCTIONS //
    //////////////////////
    private setPos (cssProp: cssPropertyName, distance: number) {
        this.elem.style[cssProp] = '' + distance + "px";
    }
}

export default Minion;
