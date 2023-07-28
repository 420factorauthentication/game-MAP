/** @format */

import {RollbarOptions} from "./types";

import Hotbar from "./hotbar.js";
import _ from "../../node_modules/underscore/underscore-esm.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A Hotbar that rolls new button settings periodically, from a pool of options. */
class Rollbar extends Hotbar {
    /**
     * @param rollOptions Every roll, it picks a random sample from this array.
     * @param elem Can be a css selector or existing DOM element or null,
     * in which case a new div element will be created.
     */
    constructor(
        maxItems: number,
        public rollOptions: RollbarOptions = [],
        elem?: HTMLElement | string
    ) {
        super(maxItems, elem);
    }

    /////////
    // API //
    /////////

    /** If true, enables all buttons in this Hotbar on every new roll. */
    enableAllOnRoll: boolean = true;

    /**
     * Turn it on. It will roll new button settings periodically.
     * @param intervalTime Time between each new roll, in ms.
     */
    start(intervalTime: number) {
        this.#isOn = true;
        this.loop(intervalTime);
    }

    /** Turn it off. It will stop rolling new button settings periodically. */
    stop() {
        this.#isOn = false;
    }

    /** Check if this is currently on. */
    get isOn() {
        return this.#isOn;
    }
    #isOn: boolean = false;

    //////////////////////
    // HELPER FUNCTIONS //
    //////////////////////

    /**
     * Uses promises to automatically start a new roll after prev roll finishes.
     * @param intervalTime Time between each new roll, in ms.
     */
    private loop(intervalTime: number) {
        new Promise((resolve) => {
            setTimeout(resolve, intervalTime);
        }).then(() => {
            if (!this.isOn) return;
            this.rollAndReplace();
            this.loop(intervalTime);
        });
    }

    /** Randomly select new settings to override existing buttons with. */
    private rollAndReplace() {
        // If the setting is on, enable all buttons in this Hotbar
        if (this.enableAllOnRoll) this.enableAll();

        // Grab a random sample from this.rollOptions
        const rolledOptions: {
            onPress: Function;
            styleCssText?: string;
            innerHTML?: string;
        }[] = _.sample(this.rollOptions, this.items.length);

        // For each sampled option, override an existing button
        for (let i = 0; i < this.items.length; i++) {
            this._items[i].onPress = rolledOptions[i].onPress;
            this._items[i].elem.style.cssText = rolledOptions[i].styleCssText;
            this._items[i].elem.innerHTML = rolledOptions[i].innerHTML;
        }

        // Re-apply style sizes, since they were overwritten
        this.updateAllSizes();
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Rollbar;
