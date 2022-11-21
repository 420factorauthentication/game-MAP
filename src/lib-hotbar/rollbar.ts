/** @format */

import Hotbar from "./hotbar";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A Hotbar that rolls new buttons periodically. */
class Rollbar extends Hotbar {
    /**
     * Turn it on. It will roll new buttons periodically.
     * @param intervalTime Time between each new roll, in ms.
     */
    start(intervalTime: number) {
        this.#isOn = true;
        this.loop(intervalTime);
    }

    /** Turn it off. It will stop rolling new buttons periodically. */
    stop() {
        this.#isOn = false;
    }

    /** Check if this is currently on. */
    get isOn() {
        return this.#isOn;
    }
    #isOn: boolean = false;

    /**
     * Uses promises to automatically start a new roll after prev roll finishes.
     * @param intervalTime Time between each new roll, in ms.
     */
    private loop(intervalTime: number) {
        new Promise((resolve) => {
            setTimeout(resolve, intervalTime);
        }).then(() => {
            if (!this.isOn) return;
            this.generateChoices();
            this.loop(intervalTime);
        });
    }

    /** Randomly select new buttons in a roll. */
    private generateChoices() {}
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Rollbar;
