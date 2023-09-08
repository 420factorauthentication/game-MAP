import {RollbarOption} from "./types";

import Rollbar from "./rollbar.js";
import Timer from "../lib-timer/timer.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A Rollbar that can be turned on/off.
 * While on, it will automatically roll periodically.
 */
export class Loopbar extends Rollbar {
    /** @param loopPeriod Time (ms) between each roll. */
    constructor(
        readonly loopPeriod: number,
        elem?: HTMLElement | string,
        public rollOptions: RollbarOption[] = [],
        public enableAllOnRoll: boolean = true
    ) {
        super(elem, rollOptions, enableAllOnRoll);
        this.#timer = new Timer(() => this.roll(), loopPeriod, true);
    }

    #timer: Timer;

    start() {this.#timer.start()}
    stop() {this.#timer.stop()}
    pause() {this.#timer.pause()}
    unpause() {this.#timer.unpause()}

    get isOn() {return this.#timer.isOn}
    get isPaused() {return this.#timer.isPaused}

    preDestroy() {
        this.#timer.stop();
        this._elem?.remove();
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Loopbar;
