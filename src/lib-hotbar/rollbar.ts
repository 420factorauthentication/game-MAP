/** @format */

import Hotbar from "./hotbar.js";
import HotbarButton from "./button.js";
import _ from "../../node_modules/underscore/underscore-esm.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A Hotbar that rolls new buttons periodically, from a pool of options. */
class Rollbar extends Hotbar {
    /**
     * @param rollOptions
     * When rolling new buttons, it will select a number of options,
     * less than or equal to this.maxItems, from this array,
     * and generate new buttons replacing the current buttons.
     * @param elem Can be a css selector or existing DOM element or null,
     * in which case a new div element will be created.
     */
    constructor(
        maxItems: number,
        public rollOptions: {
            onPress: Function;
            styleCssText?: string;
            innerHTML?: string;
        }[] = [],
        elem?: HTMLElement | string
    ) {
        super(maxItems, elem);
    }

    /////////
    // API //
    /////////

    /**
     * If true, sets all HotbarButtons generated from rolls
     * to remove all HotbarButtons from parent Hotbar after pressed.
     */
    removeAllOnPress: boolean = false;

    /** When new buttons are rolled, these hotkeys are assigned in order. */
    hotkeys: string[] = [
        "q",
        "w",
        "e",
        "r",
        "a",
        "s",
        "d",
        "f",
        "z",
        "x",
        "c",
        "v",
    ];

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

    /** Randomly select new buttons and replace the existing buttons. */
    private rollAndReplace() {
        // Remove all previous buttons
        this.removeAll();

        // Grab a random sample from this.rollOptions
        const selectedRollOptions: {
            onPress: Function;
            styleCssText?: string;
            innerHTML?: string;
        }[] = _.sample(this.rollOptions, this.maxItems);

        // For each sampled option, create a new button and new DOM Element
        let hotkeyCounter = 0;
        for (const data of selectedRollOptions) {
            const hotkey = this.hotkeys[hotkeyCounter++];

            // If a custom style is specified, create a new DOM Element with it
            let elem: HTMLElement | undefined;
            if (data.styleCssText) {
                elem = <HTMLElement>document.createElement("a");
                elem.style.cssText = data.styleCssText;
            }

            // If not, a new DOM Element with the default style will be created.
            const button = new HotbarButton(this, hotkey, data.onPress, elem);
            button.removeAllOnPress = this.removeAllOnPress;

            // If a custom Inner HTML is specified, apply it
            if (data.innerHTML) button.elem.innerHTML = data.innerHTML;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Rollbar;
