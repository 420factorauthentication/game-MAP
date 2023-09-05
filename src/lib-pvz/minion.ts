import type {Base} from "./base"
import type {MinionSpawner} from "./spawner";
import {MinionType} from "./types";
import {State, Transition} from "../lib-smac/types";
import {MinionStat} from "./types";

import StateMachine from "../lib-smac/smac.js";
import Stats from "../lib-statsys/stats.js";
import ClipBar from "../lib-progbar/clipbar.js";
import {ClassWithElem} from "../lib-utils/elem.js";

// import Spriteling from "../../node_modules/spriteling/dist/spriteling.js";
import uuidv4 from "../../node_modules/uuid/dist/esm-browser/v4.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
* A spawned enemy entity, represented by an HTMLElement.
 * Spawns on the right and moves left until it reaches a target Base,
 * then automatically attacks it.
 *
 * Each Minion has it's own current #stats that can change in real time. \
 * Stats start out as the base number from MinionType. \
 * modStat() adjusts a stat for a set time. \
 * changeStat() adjusts a stat permanently.
 * 
 * All time values are in ms.
 */
export class Minion extends ClassWithElem {
    /**
     * @param manager Contains records of all existing minions for cleanup.
     * @param type Is used to define starting #stats.
     * @param target Is used to control Attack AI.
     * @param _x Is in viewport width units (vw).
     * @param _y Is in viewport height units (vh).
     * @param _spriteURL Path to image.
     * Used for minion background-image and for mask-image of fx.
     * @param elem Can be a CSS selector or existing DOM element or null,
     * in which case a new anchor element will be created.
     */
    constructor(
        readonly manager: MinionSpawner,
        readonly type: MinionType,
        readonly target: Base,
        private _x: number,
        private _y: number,
        private _spriteURL: string,
        elem?: HTMLElement | string
    ) {
        // Lookup elem by selector. If not found, create one with default settings.
        super(elem, "a", "width: 64px; height: 64px");

        // Generate a new uuid
        this.uuid = uuidv4();

        // Init components
        this.#stats = new Stats(type);
        this.#moveState = this._moveStateUpdate;
        this.#attackState = this._attackStateUpdate;
        this.#ai = new StateMachine(this.#moveState);
        this.#hpBar = new ClipBar(
            this.hpBarElemInit,
            this.#stats.current("hp"),
            0, this.#stats.base["hp"]
        );
        
        // Init position
        this._elem.style.position = "absolute";
        this._setElemX(_x);
        this._setElemY(_y);

        // Init elem sprite image
        this._elem.style.backgroundRepeat = "no-repeat";
        this._elem.style.backgroundSize = "100% 100%";
        this._setBG(_spriteURL);

        // Tell the MinionSpawner to add this Minion to it's array
        this.manager.trackMinion(this);
    }

    /////////
    // API //
    /////////

    /** A globally unique id, different from all existing Minions. */
    readonly uuid: string;

    /** Path to image. Used for minion background-image and for mask-image of fx. */
    get spriteURL() {return this._spriteURL}
    set spriteURL(v) {this._spriteURL = v; this._setBG(v)}

    /**
     * TODO: Handle all game systems related to this minion's death here.
     * Also begin JS garbage cleanup.
     */
    die() {
        this.preDestroy();
        // TODO: Play death animation
    }

    /**
     * Begin the JS garbage collection process.
     * Also tells the MinionSpawner to delete it's handle to this class object instance.
     * After calling this, manually nullify/undefine all other handles to this class object instance.
     */
    preDestroy() {
        // Stop all AI behaviors
        this.#ai.set(undefined);

        // Destroy DOM Elements
        this.#hpBar.preDestroy();
        this._elem?.remove();

        // Tell the MinionSpawner to delete it's handle to this Minion object instance.
        this.manager.stopTrackingMinion(this);
    }

    /**
     * Set this to pause/unpause the minion. \
     * While paused, a minion will stop moving/attacking. \
     * Pausing doesn't reset onLoop timer of moveState/attackState.
     */
    get isPaused() {return this.#isPaused}
    set isPaused(v) {
        if (v) {
            if (this.#isPaused) return;
            this.#msLastPause = Date.now();
            this.#aiBeforePause = this.#ai.state;
            this.#ai.set({uuid: "minionPause"});
        } else {
            if (!this.#isPaused) return;
            if (!this.#aiBeforePause) return;
            if (!this.#aiBeforePause.loopInterval) return;
            this.#ai.set({
                uuid: "minionUnpauseTransition",
                onExit: this.#aiBeforePause.onLoop,
                destination: this.#aiBeforePause,
                transitionTime: this.#aiBeforePause.loopInterval
                    - (this.#msLastPause - this.#msLastAiLoop)
            } as Transition);
        }
        this.#isPaused = v;
    }
    #isPaused: boolean = false;

    // Stats //
    get x() {return this._x}
    get y() {return this._y}

    set x (v) {this._x = v; this._setElemX(v)}
    set y (v) {this._y = v; this._setElemY(v)}

    get hp()     {return this.#stats.current("hp")}
    get movSpd() {return this.#stats.current("movSpd")}
    get atkSpd() {return this.#stats.current("atkSpd")}
    get atkDmg() {return this.#stats.current("atkDmg")}

    /** Adjust a stat for a set time, in ms. */
    mod(stat: MinionStat, amount: number, time: number) {
        if (time <= 0) return;
        this.#stats.addMod(stat, amount, time)[1].then(() => {
            this._onStatAdjust(stat);
        }); this._onStatAdjust(stat);
    }

    /** Adjust a stat permanently. */
    change(stat: MinionStat, amount: number) {
        this.#stats.change(stat, amount);
        this._onStatAdjust(stat);
    }

    ////////////////
    // COMPONENTS //
    ////////////////
    get elem() {return this._elem}

    #stats: Stats;
    #moveState: State;
    #attackState: State;
    #ai: StateMachine;
    #hpBar: ClipBar;
    // #anim: Spriteling; // TODO: 2D sprite animation with Spriteling //

    //////////
    // INIT //
    //////////

    private get hpBarElemInit() {
        const elem = <HTMLElement>document.createElement("a");
        this._elem.appendChild(elem);
        elem.style.position = "absolute";
        elem.style.width = this._elem.style.width;
        elem.style.height = `calc(${this._elem.style.height} / 4)`;
        elem.style.top = `calc(-${this._elem.style.height} / 3)`;
        elem.style.background = "darkred";
        return elem;
    }

    //////////////////////
    // HELPER FUNCTIONS //
    //////////////////////

    /** Set elem left position, in viewport width (vw) units. */
    private _setElemX(left: number) {this._elem.style.left = "" + left + "vw"}
    /** Set elem top position, in viewport height (vh) units. */
    private _setElemY(top: number) {this._elem.style.top = "" + top + "vh"}
    /** Set elem background-image to url. */
    private _setBG(path: string) {this._elem.style.backgroundImage = `url("${path}")`}

    /** Update gameplay systems after adjusting Stats component. */
    private _onStatAdjust(stat: MinionStat) {
        switch (stat) {

            // update HP Bar and check if Minion is dead
            case "hp":
                this.#hpBar.value = this.#stats.current("hp");
                if (this.hp <= 0) this.die();
                break;

            // #attackState is used in #moveState, so update both if #attackState changes
            case "atkSpd":
            case "atkDmg":
                this.#attackState = this._attackStateUpdate;
            case "movSpd":
                this.#moveState = this._moveStateUpdate;

                // if smac currently set to a state, refresh it with updated state
                switch (this.#ai.state?.uuid) {
                    case "minionMove":
                        this.#ai.set(this.#moveState);
                        break;
                    case "minionAttack":
                        this.#ai.set(this.#attackState);
                        break;
                }
        }
    }

    /** Update State Machine interval and/or loop function after Stats adjustment. */
    private get _moveStateUpdate(): State {
        return {
            uuid: "minionMove",
            loopInterval: 1000 / this.#stats.current("movSpd"),
            onLoop: () => {
                this.#msLastAiLoop = Date.now();
                if (--this.x <= this.target.x) this.#ai.set(this.#attackState);
            },
        };
    }

    /** Update State Machine interval and/or loop function after Stats adjustment. */
    private get _attackStateUpdate(): State {
        return {
            uuid: "minionAttack",
            loopInterval: 1000 / this.#stats.current("atkSpd"),
            onLoop: () => {
                this.#msLastAiLoop = Date.now();
                this.target.hp -= this.#stats.current("atkDmg");
            },
        };
    }

    ///////////////////
    // PRIVATE CACHE //
    ///////////////////
    
    /** this.#ai.state on minion pause. */ #aiBeforePause: State | undefined;
    /** Date.now() when onLoop runs. */ #msLastAiLoop: number;
    /** Date.now() on minion pause. */ #msLastPause: number;
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Minion;
