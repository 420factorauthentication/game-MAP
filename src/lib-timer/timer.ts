/** @format */

import uuidv4 from "../../node_modules/uuid/dist/esm-browser/v4.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A class that runs a function after a timer. Can pause/unpause the timer. */
export class Timer {
    /**
     * @param func The function to run after given time.
     * @param time Time (ms) before the function runs.
     * @param isLoop If true, timer will loop and run func() after every loop.
     * @param args Args to pass to func() when it runs.
     */
    constructor(
        readonly func: (...args: any[]) => any,
        readonly time: number,
        readonly isLoop: boolean = false,
        readonly args: any[] = []
    ) {}

    start() {
        if (this.#isOn) return;
        this.#isOn = true;
        this.#isPaused = false;
        this.#elapsed = 0;
        this.#newLaunch();
    }
    stop() {
        if (!this.#isOn) return;
        this.#isOn = false;
        this.#isPaused = false;
    }
    pause() {
        if (!this.#isOn) return;
        if (this.#isPaused) return;
        this.#isPaused = true;
        this.#elapsed += Date.now() - this.#lastLaunchAt;
    }
    unpause() {
        if (!this.#isPaused) return;
        this.#isPaused = false;
        this.#newLaunch(-this.#elapsed);
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
    #elapsed: number = 0;

    #launch(uuidAtStart: string, delay = 0) {
        this.#lastLaunchAt = Date.now();
        new Promise((resolve) => {
            setTimeout(resolve, Math.max(this.time + delay, 0));
        }).then(() => {
            if (!this.#isOn) return;
            if (this.#isPaused) return;
            if (this.#launchUUID != uuidAtStart) return;
            this.#elapsed = 0;
            this.func(...this.args);
            if (this.isLoop) this.#launch(uuidAtStart);
        });
    }

    #newLaunch(delay = 0) {
        const newUUID = uuidv4();
        this.#launchUUID = newUUID;
        this.#launch(newUUID, delay);
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Timer;
