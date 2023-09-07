/** @format */

import uuidv4 from "../../node_modules/uuid/dist/esm-browser/v4.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A class that runs a function after a timer. Can pause/unpause the timer. */
export class Timer {
    /**
     * @param func The function to run after given time.
     * @param time Time (ms) before the function runs.
     * @param args Args to pass to func() when it runs.
     */
    constructor(
        readonly func: (...args: any[]) => any,
        readonly time: number,
        readonly args: any[] = []
    ) {}

    start() {
        if (this.#isOn) return false;
        this.#isOn = true;
        this.#isPaused = false;
        return this.#newLaunch();
    }
    stop() {
        if (!this.#isOn) return false;
        this.#isOn = false;
        this.#isPaused = false;
        return true;
    }
    pause() {
        if (!this.#isOn) return false;
        if (this.#isPaused) return false;
        this.#isPaused = true;
        this.#lastPauseAt = Date.now();
        return true;
    }
    unpause() {
        if (!this.#isPaused) return false;
        this.#isPaused = false;
        return this.#newLaunch(-(this.#lastPauseAt - this.#lastLaunchAt));
    }

    get isOn() {
        return this.#isOn;
    }
    get isPaused() {
        return this.#isPaused;
    }

    #isOn: boolean;
    #isPaused: boolean;

    #launchUUID: string;
    #lastLaunchAt: number;
    #lastPauseAt: number;

    protected async _launch(uuidAtStart: string, delay = 0) {
        this.#lastLaunchAt = Date.now();
        return new Promise((resolve) => {
            setTimeout(resolve, Math.max(this.time + delay, 0));
        }).then(() => {
            if (!this.#isOn) return false;
            if (this.#isPaused) return false;
            if (this.#launchUUID != uuidAtStart) return false;
            return this.func(...this.args);
        });
    }

    #newLaunch(delay = 0) {
        const newUUID = uuidv4();
        this.#launchUUID = newUUID;
        return this._launch(newUUID, delay);
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Timer;
