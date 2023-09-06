/** @format */

import uuidv4 from "../../node_modules/uuid/dist/esm-browser/v4.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A class that uses setTimeouts to run a given function on a loop.
 * Features the ability to pause/unpause without resetting the timer.
 */
export class Looper {
    /**
     * @param onLoop The function to run every time this loops.
     * @param period Time (ms) between each loop.
     */
    constructor(readonly onLoop: () => void, readonly period: number) {}

    start() {
        this.#isOn = true;
        this.#isPaused = false;
        const newUUID = uuidv4();
        this.#loopUUID = newUUID;
        this.#loop(this.period, newUUID);
    }
    stop() {
        this.#isOn = false;
        this.#isPaused = false;
    }
    pause() {
        if (!this.#isOn) return;
        if (this.#isPaused) return;
        this.#lastPauseAt = Date.now();
        this.#isPaused = true;
    }
    unpause() {
        if (!this.#isPaused) return;
        this.#isPaused = false;
        const firstLoopDelay = -(this.#lastPauseAt - this.#lastLoopAt);
        const newUUID = uuidv4();
        this.#loopUUID = newUUID;
        this.#loop(this.period, newUUID, firstLoopDelay);
    }

    get isOn() {
        return this.#isOn;
    }
    get isPaused() {
        return this.#isPaused;
    }

    #isOn: boolean;
    #isPaused: boolean;

    #loopUUID: string;
    #lastLoopAt: number;
    #lastPauseAt: number;

    #loop(period: number, uuid: string, firstLoopDelay = 0) {
        new Promise((resolve) => {
            setTimeout(resolve, Math.max(period + firstLoopDelay, 0));
        }).then(() => {
            if (!this.#isOn) return;
            if (this.#isPaused) return;
            if (this.#loopUUID != uuid) return;
            this.#lastLoopAt = Date.now();
            this.onLoop();
            this.#loop(period, uuid);
        });
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Looper;
