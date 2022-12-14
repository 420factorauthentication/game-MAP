import {BaseEntity, MinionEntity, MinionManager, MinionType} from "./types";
import {State} from "../lib-smac/types";

import StateMachine from "../lib-smac/smac.js";
import Stats from "../lib-statsys/stats.js";
import ProgBar from "../lib-progbar/progbar.js";

import Spriteling from "../../node_modules/spriteling/dist/spriteling.js";
import uuidv4 from "../../node_modules/uuid/dist/esm-browser/v4.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
* A spawned enemy entity, represented by an HTMLElement.
 * Spawns on the right and moves left until it reaches a target Base,
 * then automatically attacks it.
 *
 * Each Minion has it's own current stats that can change in real time. \
 * Stats start out as the base number from MinionType. \
 * modStat() adjusts a stat for a set time. \
 * changeStat() adjusts a stat permanently.
 */
class Minion implements MinionEntity {
    /**
     * @param manager Contains records of all existing minions for cleanup.
     * @param type Is used to define starting stats.
     * @param target Is used to control Attack AI.
     * @param _x Is in viewport width units (vw).
     * @param _y Is in viewport height units (vh).
     * @param elem Can be a css selector or existing DOM element or null,
     * in which case a new anchor element will be created.
     */
    constructor(
        readonly manager: MinionManager,
        readonly type: MinionType,
        readonly target: BaseEntity,
        private _x: number,
        private _y: number,
        elem?: HTMLElement | string
    ) {
        // Lookup element by selector
        if (elem)
            this._elem =
                typeof elem === "string"
                    ? (document.querySelector(elem) as HTMLElement)
                    : elem;

        // No element found. Let's create one instead.
        if (!this.elem) this._elem = Minion.elemInit;

        // Generate a new uuid
        this.uuid = uuidv4();

        // Init components
        this.ai = new StateMachine(this.moveState);
        this.hpBar = new ProgBar(
            this.hpBarElemInit,
            this.stats.current("hp"),
            0, this.stats.base["hp"]
        );
        
        // Init position
        this.setElemX(_x);
        this.setElemY(_y);

        // Add Minion class
        this.elem.className += " minion";

        // Tell the MinionManager to add this Minion to it's array
        this.manager.trackMinion(this);
    }

    /////////
    // API //
    /////////

    /** A globally unique id, different from all existing Minions. */
    readonly uuid: string;

    /** Kill this minion, then destroy DOM Element and cleanup all garbage. */
    die() {
        // TODO: PLAY DEATH ANIMATION HERE

        // Destroy DOM Element and cleanup all garbage
        this.destroy();
    }

    /** Destroy DOM Element and cleanup all garbage. */
    destroy() {
        // Stop all AI behaviors
        this.ai.set(undefined);

        // Destroy DOM Elements and cleanup garbage
        this.hpBar.destroy();
        this.elem?.remove();
        delete this._elem;

        // Tell the MinionManager to delete it's records of this Minion
        this.manager.stopTrackingMinion(this);
    }

    // Stats //
    get x() {return this._x;}
    get y() {return this._y;}

    set x (v) {this._x = v; this.setElemX(v);}
    set y (v) {this._y = v; this.setElemY(v);}

    get hp()     {return this.stats.current("hp");}
    get movSpd() {return this.stats.current("movSpd");}
    get atkSpd() {return this.stats.current("atkSpd");}
    get atkDmg() {return this.stats.current("atkDmg");}

    // Adjust a stat for a set time, in ms. //
    modHp(amount: number, time: number) {
        if (time <= 0) return;
        this.stats.addMod("hp", amount, time)[1].then(() => {
            this.onHpChange();
        }); this.onHpChange();
    }
    modMovSpd(amount: number, time: number) {
        if (time <= 0) return;
        this.stats.addMod("movSpd", amount, time)[1].then(() => {
            this.onMovChange();
        }); this.onMovChange();
    }
    modAtkSpd(amount: number, time: number) {
        if (time <= 0) return;
        this.stats.addMod("atkSpd", amount, time)[1].then(() => {
            this.onAtkChange();
        }); this.onAtkChange();
    }
    modAtkDmg(amount: number, time: number) {
        if (time <= 0) return;
        this.stats.addMod("atkDmg", amount, time)[1].then(() => {
            this.onAtkChange();
        }); this.onAtkChange();
    }

    // Adjust a stat permanently //
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
    get elem() {return this._elem;}
    protected _elem: HTMLElement;

    protected anim:  Spriteling;
    protected hpBar: ProgBar;
    protected ai:    StateMachine;
    protected stats: Stats = new Stats(this.type);

    protected moveState:   State = this.moveStateInit;
    protected attackState: State = this.attackStateInit;

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
    private onHpChange() {
        this.hpBar.value = this.stats.current("hp");
        if (this.hp <= 0) this.die();
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

    /** Set elem left position, in viewport width (vw) units. */
    private setElemX(left: number) {
        this.elem.style.left = "" + left + "vw";
    }

    /** Set elem top position, in viewport height (vh) units. */
    private setElemY(top: number) {
        this.elem.style.top = "" + top + "vh";
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Minion;
