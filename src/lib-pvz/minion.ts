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
export class Minion extends ElemStyler {
    /**
     * @param manager Contains records of all existing minions for cleanup.
     * @param type Is used to define starting #stats.
     * @param target Is used to control Attack AI.
     * @param _x Is in viewport width units (vw).
     * @param _y Is in viewport height units (vh).
     * @param _spriteURL Path to image.
     * Used for minion background-image and for mask-image of fx.
     * @param minionElem DOM Element used to render Minion.
     * Can be a CSS selector or existing DOM element or null,
     * in which case a new anchor element will be created.
     * @param hpBarElem DOM Element used to render the Minion's HP Bar.
     * Can be a CSS selector or existing DOM element or null,
     * in which case a new anchor element will be created.
     */
    constructor(
        readonly manager: MinionSpawner,
        readonly type: MinionType,
        readonly target: Base,
        private _x: number,
        private _y: number,
        private _spriteURL: string,
        minionElem?: HTMLElement | string,
        hpBarElem?: HTMLElement | string,
    ) {
        // Lookup minion elem by selector. If not found, create one with default settings.
        super(minionElem, "a", "width: 64px; height: 64px");

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
        this.setX(_x);
        this.setY(_y);

        // Init elem sprite image
        this.minionElem.style.backgroundRepeat = "no-repeat";
        this.minionElem.style.backgroundSize = "100% 100%";
        this.setBgImg(_spriteURL);

        // Tell the MinionSpawner to add this Minion to it's array
        this.manager.trackMinion(this);

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
    get spriteURL(): string {return this._spriteURL}
    set spriteURL(pathToFile) {this._spriteURL = this.setBgImg(pathToFile)}

    /**
     * Check if this Minion is paused. \
     * While paused, a Minion will stop moving/attacking. \
     * Pausing doesn't reset time to next movement/attack.
     */
    get isPaused() {return this.#isPaused}
    #isPaused: boolean = false;

    /**
     * Pause this Minion. \
     * Does nothing if already paused. \
     * While paused, a Minion will stop moving/attacking. \
     * Pausing doesn't reset time to next movement/attack.
     */
    pause() {this.#timer.pause()}

    /**
     * Unpause this Minion. The Minion will resume moving/attacking.
     * Does nothing if already not paused.
     */
    unpause() {this.#timer.unpause()}

    /**
     * TODO: Handle all game systems related to this minion's death here, like death animation.
     * Also begin JS garbage cleanup.
     */
    die() {
        this.preDestroy();
    }

    /**
     * Begin the JS garbage collection process.
     * Also tells the MinionSpawner to delete it's handle to this object.
     * After calling this, manually nullify/undefine all other handles to this object.
     */
    preDestroy() {
        // Stop loops
        this.#timer.stop();
        // Destroy DOM Elements
        this.#hpBar.preDestroy();
        this.minionElem?.remove();
        // Tell the MinionSpawner to delete it's handle to this Minion object
        this.manager.stopTrackingMinion(this);
    }

    ////////////////
    // API: STATS //
    ////////////////
    get x (): number {return this._x}
    get y (): number {return this._y}

    set x (vwNumber) {this._x = this.setX(vwNumber)}
    set y (vhNumber) {this._y = this.setY(vhNumber)}

    get hp()     {return this.#stats.current("hp")}
    get movSpd() {return this.#stats.current("movSpd")}
    get atkSpd() {return this.#stats.current("atkSpd")}
    get atkDmg() {return this.#stats.current("atkDmg")}

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
    get minionElem() {return this._elem}
    get hpBarElem() {return this.#hpBar.elem}

    #timer: Timer;
    #stats: Stats;
    #hpBar: ClipBar;
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
        switch (this.#state) {
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
