/** @format */

import {RollbarOption} from "./types";
import type {HotbarButton} from "./button";

import Hotbar from "./hotbar.js";
import {sample} from "../../node_modules/underscore/underscore-esm.js";
import uuidv4 from "../../node_modules/uuid/dist/esm-browser/v4.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A Hotbar that rolls new button settings periodically, from a pool of options.
 * Preserves existing button settings, and merges with newly rolled settings.
 * Only removes/overwrites what was applied by previous rollOptions.
 *
 * NOTE: Existing button settings are cached when rolling is turned on with this.start(). \
 * While rolling, accessing this.items[i] and changing \
 * onPress, elem.style.cssText, or elem.innerHTML, \
 * will do nothing, as every roll will reset the items back to the initial cache.
 */
export class Rollbar extends Hotbar {
    /**
     * @param elem Can be a CSS selector or existing DOM element or null,
     * in which case a new div element will be created.
     * @param rollOptions Every roll, it picks a random sample from this array.
     */
    constructor(
        elem?: HTMLElement | string,
        public rollOptions: RollbarOption[] = []
    ) {
        super(elem);
        // Init cache //
        this.#initialOnPress = [];
        this.#initialConditions = [];
        this.#initialCssText = [];
        this.#initialInnerHTML = [];
    }

    /////////
    // API //
    /////////

    /** If true, enables all buttons in this Hotbar on every new roll. */
    enableAllOnRoll: boolean = true;

    /**
     * Turn it on. It will roll new button settings periodically.
     * If called while already on, it will just update intervalTime,
     * and reset current roll timer to 0.
     * @param intervalTime Time between each new roll, in ms.
     */
    start(intervalTime: number) {
        this.#isOn = true;

        // Cache initial button settings
        for (let i = 0; i < this._items.length; i++) {
            this.#initialOnPress[i] = this._items[i].onPress;
            this.#initialConditions[i] = this._items[i].conditions;
            this.#initialCssText[i] = this._items[i].elem.style.cssText;
            this.#initialInnerHTML[i] = this._items[i].elem.innerHTML;
        }

        // Start new loop with new UUID to stop old loops
        let newUUID = uuidv4();
        this.#loopUUID = newUUID;
        this.loop(intervalTime, newUUID);
    }

    /** Turn it off. It will stop rolling new button settings periodically. */
    stop() {
        this.#isOn = false;
        // Reset cache //
        this.#initialOnPress = [];
        this.#initialConditions = [];
        this.#initialCssText = [];
        this.#initialInnerHTML = [];
    }

    /** Check if this is currently on. */
    get isOn() {
        return this.#isOn;
    }
    #isOn: boolean = false;

    /////////////////////////////
    // PARENT CLASS EXTENSIONS //
    /////////////////////////////

    /** Add a button to this Hotbar, and update graphics. */
    add(item: HotbarButton) {
        if (super.add(item) === undefined) return;
        // Update cache if on //
        if (!this.#isOn) return item;
        this.#initialOnPress.push(item.onPress);
        this.#initialConditions.push(item.conditions);
        this.#initialCssText.push(item.elem.style.cssText);
        this.#initialInnerHTML.push(item.elem.innerHTML);
        return item;
    }

    /**
     * Remove a button from this Hotbar, and begin destroying it.
     * Returns true if successfully removed, false if item not found.
     */
    remove(v: number | HotbarButton): boolean;
    remove(index: number): boolean;
    remove(item: HotbarButton): boolean;
    remove(v: number | HotbarButton): boolean {
        if (super.remove(v) === false) return false;
        // Update cache if on //
        if (!this.#isOn) return true;
        let index = typeof v === "number" ? v : this._items.indexOf(v);
        this.#initialOnPress.splice(index, 1);
        this.#initialConditions.splice(index, 1);
        this.#initialCssText.splice(index, 1);
        this.#initialInnerHTML.splice(index, 1);
        return true;
    }

    /** Remove all buttons from this Hotbar. */
    removeAll() {
        super.removeAll();
        // Reset cache if on //
        if (!this.isOn) return;
        this.#initialOnPress = [];
        this.#initialConditions = [];
        this.#initialCssText = [];
        this.#initialInnerHTML = [];
    }

    //////////////////////
    // HELPER FUNCTIONS //
    //////////////////////

    /**
     * Uses promises to automatically start a new roll after prev roll finishes.
     * @param intervalTime Time between each new roll, in ms.
     * @param uuid A globally unique id.
     * Used to prevent old loops from firing when a new loop is started.
     */
    private loop(intervalTime: number, uuid: string) {
        new Promise((resolve) => {
            setTimeout(resolve, intervalTime);
        }).then(() => {
            if (!this.isOn) return;
            if (this.#loopUUID != uuid) return;
            this.rollAndReplace();
            this.loop(intervalTime, uuid);
        });
    }

    /** Randomly select new settings to update existing buttons with. */
    private rollAndReplace() {
        // Grab a random sample from this.rollOptions
        const rolls: RollbarOption[] = sample(
            this.rollOptions,
            this._items.length
        );

        // For each sampled option, update an existing button
        let i = 0;
        for (i; i < rolls.length; i++) {
            this._items[i].onPress = new Array<() => void>()
                .concat(this.#initialOnPress[i], rolls[i].onPress)
                .filter((x) => x);

            this._items[i].conditions = new Array<() => boolean>()
                .concat(this.#initialConditions[i], rolls[i].conditions || [])
                .filter((x) => x);

            this._items[i].elem.style.cssText = [
                this.#initialCssText[i],
                rolls[i].styleCssText,
            ]
                .filter((x) => x)
                .join(" ");

            this._items[i].elem.innerHTML = [
                this.#initialInnerHTML[i],
                rolls[i].innerHTML,
            ]
                .filter((x) => x)
                .join(" ");
        }

        // If less samples than items, reset the remaining items
        for (i; i < this._items.length; i++) {
            this._items[i].onPress = this.#initialOnPress[i];
            this._items[i].conditions = this.#initialConditions[i];
            this._items[i].elem.style.cssText = this.#initialCssText[i];
            this._items[i].elem.innerHTML = this.#initialInnerHTML[i];
        }

        // If the setting is on, enable all buttons in this Hotbar
        // Do this after updating style,
        // to override opacity and pointerEvents from cached button settings
        if (this.enableAllOnRoll) this.enableAll();
    }

    ///////////////////
    // PRIVATE CACHE //
    ///////////////////

    // Cache of initial button settings, merged with new settings of each roll.
    #initialOnPress: (() => void)[][];
    #initialConditions: (() => boolean)[][];
    #initialCssText: string[];
    #initialInnerHTML: string[];

    /**
     * UUID of current loop.
     * Used to prevent old loops from firing when a new loop is started.
     */
    #loopUUID: string;
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Rollbar;
