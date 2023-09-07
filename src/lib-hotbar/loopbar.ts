/** @format */

import {RollbarOption} from "./types";

import Rollbar from "./rollbar.js";
import Looper from "../lib-timer/looper.js";

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
        this.#looper = new Looper(() => this.roll(), loopPeriod);
    }

    #looper: Looper;

    start() {
        this.#looper.start();
    }
    stop() {
        this.#looper.stop();
    }
    pause() {
        this.#looper.pause();
    }
    unpause() {
        this.#looper.unpause();
    }

    get isOn() {
        return this.#looper.isOn;
    }
    get isPaused() {
        return this.#looper.isPaused;
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Loopbar;
