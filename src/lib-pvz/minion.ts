import type {Base} from "./base"
import type {MinionSpawner} from "./spawner";
import {MinionType, MinionStat} from "./types";

import Timer from "../lib-timer/timer.js";
import Stats from "../lib-statsys/stats.js";
import ClipBar from "../lib-progbar/clipbar.js";
import ElemStyler from "../lib-elem/styler.js";

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
export class Minion {
    /**
     * @param manager Tracks all Minions for garbage collection.
     * @param type Is used to define starting stats.
     * @param target Is used to control Attack AI.
     * @param _x Is in viewport width units (vw).
     * @param _y Is in viewport height units (vh).
     * @param minionElem DOM element used to render Minion.
     * Can be a CSS selector or existing DOM element or undefined,
     * in which case a new anchor element will be created.
     * @param hpBarElem DOM element used to render Minion HP Bar.
     * Can be a CSS selector or existing DOM element or undefined,
     * in which case a new anchor element will be created.
     */
    constructor(
        readonly manager: MinionSpawner,
        readonly type: MinionType,
        readonly target: Base,
        private _x: number,
        private _y: number,
        minionElem?: HTMLElement | string,
        hpBarElem?: HTMLElement | string,
    ) {
        // Lookup minion elem by selector. If not found, create one with default settings.
        this.#minion = new ElemStyler(minionElem, "a");

        // Generate a new uuid unique from all other Minions
        this.uuid = uuidv4();

        // Init components
        this.#stats = new Stats(type);
        this.#hpBar = new ClipBar(hpBarElem, this.#stats.base["hp"], 0, this.#stats.base["hp"]);

        // Init HP Bar style
        this.minionElem.appendChild(this.hpBarElem);
        this.hpBarElem.style.position = "absolute";
        this.hpBarElem.style.inset = "-33% 0 0 0";
        
        // Init position
        this.minionElem.style.position = "absolute";
        this.#minion.setX(_x);
        this.#minion.setY(_y);

        // Init elem sprite image
        this.minionElem.style.backgroundRepeat = "no-repeat";
        this.minionElem.style.backgroundSize = "100% 100%";
        this.minionElem.style.width = type.width.magnitude.toString() + type.width.unit;
        this.minionElem.style.height = type.height.magnitude.toString() + type.height.unit;
        this.spriteURL = type.spriteURL;

        // Init optional config
        if (type.extraClasses)
            this.minionElem.className += " " + type.extraClasses

        // Tell the MinionSpawner to add this Minion to it's manager
        this.manager.add(this);

        // Start Minion moving
        this.#updateLooper();
    }

    /////////
    // API //
    /////////

    /** A globally unique id, different from all existing Minions. */
    readonly uuid: string;

    /** What the Minion is currently doing. */
    get state() {return this.#state}
    #state: "move" | "attack" = "move";

    /** Path to image. Used for minion background-image and for mask-image of fx. */
    get spriteURL(): string {return this.#spriteURL}
    set spriteURL(pathToFile) {this.#spriteURL = this.#minion.setBgImg(pathToFile)}
    #spriteURL: string;

    /** Check if this Minion is paused. */
    get isPaused() {return this.#isPaused}
    #isPaused: boolean = false;

    /** Pause this Minion. It will stop moving/attacking. Saves timer progress. */
    pause() {this.#timer.pause()}

    /** Unpause this Minion. It will resume moving/attacking. */
    unpause() {this.#timer.unpause()}

    /** TODO: Minion Death. Called when HP changes if HP < 0. */
    die() {
        this.gc();
    }

    /** Garbage collection. */
    gc() {
        this.#timer.stop();
        this.#hpBar.gc();
        this.#minion.gc();
        this.manager.delete(this);
    }

    ////////////////
    // API: STATS //
    ////////////////
    get x (): number {return this._x}
    get y (): number {return this._y}

    set x (vwNumber) {this._x = this.#minion.setX(vwNumber)}
    set y (vhNumber) {this._y = this.#minion.setY(vhNumber)}

    /** Get current value of a stat. */
    get(stat: MinionStat) {
        return this.#stats.current(stat);
    }

    /** Adjust a stat for a set time, in ms. */
    mod(stat: MinionStat, amount: number, time: number) {
        if (time <= 0) return;
        this.#stats.addMod(stat, amount, time)[1].then(() => {
            this.#onStatAdjust(stat);
        }); this.#onStatAdjust(stat);
    }

    /** Adjust a stat permanently. */
    change(stat: MinionStat, amount: number) {
        this.#stats.change(stat, amount);
        this.#onStatAdjust(stat);
    }

    ////////////////
    // COMPONENTS //
    ////////////////
    get hpBarElem() {return this.#hpBar.elem}
    get minionElem() {return this.#minion.elem}

    #timer: Timer;
    #stats: Stats;
    #hpBar: ClipBar;
    #minion: ElemStyler;
    // #anim: Spriteling;

    //////////////////////
    // HELPER FUNCTIONS //
    //////////////////////
    #move() {if (--this.x <= this.target.x) this.#updateLooper("attack")}
    #attack() {this.target.hp -= this.#stats.current("atkDmg")}

    #updateLooper(state: "move" | "attack" = this.#state) {
        this.#timer?.stop();
        switch (state) {
            case "move":
                this.#state = "move";
                this.#timer = new Timer(
                    () => this.#move(),
                    1000 / this.#stats.current("movSpd"),
                    true
                );
                this.#timer.start();
                break;
            case "attack":
                this.#state = "attack";
                this.#timer = new Timer(
                    () => this.#attack(),
                    1000 / this.#stats.current("atkSpd"),
                    true
                );
                this.#timer.start();
                break;
            default:
        }
    }

    #onStatAdjust(stat: MinionStat) {
        if (stat == "hp") {
            this.#hpBar.value = this.get("hp");
            if (this.get("hp") <= 0) this.die();
        } else switch (this.#state) {
            case "move":
                if (stat == "movSpd") this.#updateLooper();
                break;
            case "attack":
                if (stat == "atkDmg" || stat == "atkSpd") this.#updateLooper();
                break;
            default:
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Minion;
