/** @format */

import {RollbarOption} from "./types";

import Hotbar from "./hotbar.js";
import _ from "../../node_modules/underscore/underscore-esm.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A Hotbar that rolls new button settings periodically, from a pool of options. */
class Rollbar extends Hotbar {
    /**
     * @param maxItems Prevents user from adding more buttons than this limit.
     * @param autoSize If true, auto-resizes button styles based on maxItems
     * @param rollOptions Every roll, it picks a random sample from this array.
     * @param elem Can be a css selector or existing DOM element or null,
     * in which case a new div element will be created.
     */
    constructor(
        maxItems: number,
        autoSize: boolean,
        public rollOptions: RollbarOption[] = [],
        elem?: HTMLElement | string
    ) {
        super(maxItems, autoSize, elem);
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
        this._isOn = true;
        this.loop(intervalTime);
    }

    /** Turn it off. It will stop rolling new button settings periodically. */
    stop() {
        this._isOn = false;
    }

    /** Check if this is currently on. */
    get isOn() {
        return this._isOn;
    }
    protected _isOn: boolean = false;

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
        const rolls: RollbarOption[] = _.sample(
            this.rollOptions,
            this._items.length
        );

        // For each sampled option, override an existing button
        // If there are less options than buttons, clear remaining buttons
        let i = 0;
        for (i; i < rolls.length; i++) {
            this._items[i].onPress = rolls[i].onPress;
            this._items[i].elem.style.cssText = rolls[i].styleCssText;
            this._items[i].elem.innerHTML = rolls[i].innerHTML;
        }
        for (i; i < this._items.length; i++) {
            this._items[i].onPress = undefined;
            this._items[i].elem.style.cssText = "";
            this._items[i].elem.innerHTML = "";
        }

        // Re-apply style sizes, since they were overwritten
        if (this.autoSize) this.updateAllSizes();
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Rollbar;
