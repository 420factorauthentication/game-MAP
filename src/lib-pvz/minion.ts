import {BaseEntity, MinionEntity, MinionManager, MinionType} from "./types";
import {State} from "../lib-smac/types";
import {htmlAttributeValue, ms, vw, vh} from "../lib-meth/types";

import StateMachine from "../lib-smac/smac.js";
import Stats from "../lib-statsys/stats.js";
import ProgBar from "../lib-progbar/progbar.js";

import Spriteling from "../../node_modules/spriteling/dist/spriteling.js";

/////////////////////////////////////////////////////////////
// An enemy represented by an HTMLElement                  //
// Moves left until it reaches a target Base, then attacks //
/////////////////////////////////////////////////////////////

class Minion implements MinionEntity {
    ////////////
    // CONFIG //
    ////////////
    constructor(
        readonly manager: MinionManager,
        readonly type: MinionType,
        readonly target: BaseEntity,
        private _x: number,
        private _y: number,
        initOptions?: {
            elem?: HTMLElement;
            parent?: Node;
            htmlClass?: htmlAttributeValue;
        }
    ) {
        this.elem = initOptions?.elem ? initOptions.elem : Minion.elemInit;
        this.parent = initOptions?.parent ? initOptions.parent : document.body;
        if (initOptions?.htmlClass) this.htmlClass = initOptions.htmlClass;

        this.ai = new StateMachine(this.moveState);
        this.hpBar = new ProgBar(
            this.hpBarElemInit,
            this.stats.current("hp"),
            0, this.stats.base["hp"]
        );
        
        this.setElemX(_x);
        this.setElemY(_y);
    }

    /////////
    // API //
    /////////
    get x() {return this._x;}
    get y() {return this._y;}

    set x (v) {this._x = v; this.setElemX(v);}
    set y (v) {this._y = v; this.setElemY(v);}

    get hp()     {return this.stats.current("hp");}
    get movSpd() {return this.stats.current("movSpd");}
    get atkSpd() {return this.stats.current("atkSpd");}
    get atkDmg() {return this.stats.current("atkDmg");}

    modHp(amount: number, time: ms) {
        this.stats.addMod("hp", amount, time)[1].then(() => {
            this.onHpChange();
        }); this.onHpChange();
    }
    modMovSpd(amount: number, time: ms) {
        this.stats.addMod("movSpd", amount, time)[1].then(() => {
            this.onMovChange();
        }); this.onMovChange();
    }
    modAtkSpd(amount: number, time: ms) {
        this.stats.addMod("atkSpd", amount, time)[1].then(() => {
            this.onAtkChange();
        }); this.onAtkChange();
    }
    modAtkDmg(amount: number, time: ms) {
        this.stats.addMod("atkDmg", amount, time)[1].then(() => {
            this.onAtkChange();
        }); this.onAtkChange();
    }

    changeHp(amount: number) {
        this.stats.change("hp", amount);
        this.onHpChange();
    }
    changeMovSpd(amount: number) {
        this.stats.change("movSpd", amount);
        this.onMovChange();
    }
    changeAtkSpd(amount: number) {
        this.stats.change("atkSpd", amount);
        this.onAtkChange();
    }
    changeAtkDmg(amount: number) {
        this.stats.change("atkDmg", amount);
        this.onAtkChange();
    }

    ////////////////
    // COMPONENTS //
    ////////////////
    protected elem:  HTMLElement;
    protected anim:  Spriteling;
    protected hpBar: ProgBar;
    protected ai:    StateMachine;
    protected stats: Stats = new Stats(this.type);

    protected moveState:       State = this.moveStateInit;
    protected attackState:     State = this.attackStateInit;
    protected static dieState: State = {uuid: "minionDie"};

    //////////
    // INIT //
    //////////
    private static get elemInit() {
        const elem = <HTMLElement>document.createElement("a");
        document.body.appendChild(elem);
        elem.style.position = "absolute";
        elem.style.width = "64px";
        elem.style.height = "64px";
        elem.style.background = "content-box radial-gradient(crimson, skyblue)";
        return elem;
    }

    private get hpBarElemInit() {
        const elem = <HTMLElement>document.createElement("a");
        this.elem.appendChild(elem);
        elem.style.position = "absolute";
        elem.style.width = this.elem.style.width;
        elem.style.height = `calc(${this.elem.style.height} / 4)`;
        elem.style.top = `calc(-${this.elem.style.height} / 3)`;
        elem.style.background = "darkred";
        return elem;
    }

    // private get spritelingInit() {
    //     return new Spriteling();
    // }

    private get moveStateInit() {
        const moveState: State = {
            uuid: "minionMove",
            loopInterval: 1000 / this.stats.current("movSpd"),
            onLoop: () => {
                if (--this.x <= this.target.x) this.ai.set(this.attackState);
            },
        };
        return moveState;
    }

    private get attackStateInit() {
        const attackState: State = {
            uuid: "minionAttack",
            loopInterval: 1000 / this.stats.current("atkSpd"),
            onLoop: () => {
                this.target.hp -= this.stats.current("atkDmg");
            },
        };
        return attackState;
    }

    //////////////////////
    // HELPER FUNCTIONS //
    //////////////////////

    // Use spawner.kill() instead of minion.die() when possible
    // since minion.die() doesnt remove handle from spawner.minions
    die() {
        this.ai.set(Minion.dieState);
        this.elem?.parentNode?.removeChild(this.elem);
    }

    private onHpChange() {
        this.hpBar.value = this.stats.current("hp");
        if (this.hp <= 0) this.manager.kill(this);
    }

    private onMovChange() {
        this.moveState = this.moveStateInit;
        if (this.ai.state?.uuid == "minionMove")
            this.ai.set(this.moveState);
    }

    private onAtkChange() {
        this.attackState = this.attackStateInit;
        if (this.ai.state?.uuid == "minionAttack")
            this.ai.set(this.attackState);
    }

    private setElemX(left: vw) {
        this.elem.style.left = "" + left + "vw";
    }

    private setElemY(top: vh) {
        this.elem.style.top = "" + top + "vh";
    }

    private set parent(parentElem: Node) {
        parentElem.appendChild(this.elem);
    }

    private set htmlClass(htmlClass: htmlAttributeValue) {
        this.elem.className += " " + htmlClass;
    }
}

////////////////////////////////////////////////////////////////////////////////

export default Minion;
