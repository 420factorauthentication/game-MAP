/** @format */

import {RollbarOption} from "./types";
import {HotbarItem} from "./types";

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
 * NOTE: Existing button settings are cached when rolling is turned on with this.start().
 * Accessing this.items[i] and changing onPress, elem.style.cssText, or elem.innerHTML,
 * will do nothing, as every roll will reset the items back to the initial cache.
 */
export class Rollbar extends Hotbar {
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

        // Init cache of initial button settings
        this.#initialOnPress = [];
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
        this._isOn = true;

        // Cache initial button settings
        for (let i = 0; i < this._items.length; i++) {
            this.#initialOnPress[i] = this._items[i].onPress;
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
        this._isOn = false;

        // Reset cache of initial button settings
        this.#initialOnPress = [];
        this.#initialCssText = [];
        this.#initialInnerHTML = [];
    }

    /** Check if this is currently on. */
    get isOn() {
        return this._isOn;
    }
    protected _isOn: boolean = false;

    /////////////////////////////
    // PARENT CLASS EXTENSIONS //
    /////////////////////////////

    /** Add a button to this Hotbar, and update graphics. */
    add(item: HotbarItem) {
        // If items array has an item whose elem matches the added item,
        // the added item is already added to this Hotbar, so do nothing.
        if (this._items.some((e) => e.elem === item.elem)) return;

        // If user attempts to add more than max, throw an Error
        if (this._items.length >= this.maxItems) throw new Error("Max items");

        // EXTENSION: Also update cache initial button settings,
        // in case button is added while rolling is on.
        this.#initialOnPress[this._items.length] = item.onPress;
        this.#initialCssText.push(item.elem.style.cssText);
        this.#initialInnerHTML.push(item.elem.innerHTML);

        // Init
        this._items.push(item);
        this._elem.appendChild(item.elem);
        if (this.autoSize) this.updateSize(item);

        // Return the added item
        return item;
    }

    /** Remove a button from this Hotbar, and update graphics. */
    remove(v: number | HotbarItem): void;
    remove(index: number): void;
    remove(item: HotbarItem): void;
    remove(v: number | HotbarItem) {
        let index = typeof v === "number" ? v : this._items.indexOf(v);
        let item = typeof v === "number" ? this._items[v] : v;

        // If item not found, do nothing
        if (!item) return;
        if (!this._items.some((e) => e.elem === item.elem)) return;

        // Cleanup garbage
        item.destroy();
        this._items.splice(index, 1);

        // EXTENSION: Also cleanup cache of initial button settings,
        // in case button is removed while rolling is on.
        this.#initialOnPress.splice(index, 1);
        this.#initialCssText.splice(index, 1);
        this.#initialInnerHTML.splice(index, 1);
    }

    /** Remove all buttons from this Hotbar. */
    removeAll() {
        super.removeAll();
        // EXTENSION: Also cleanup cache of initial button settings,
        // in case buttons are removed while rolling is on.
        this.#initialOnPress = [];
        this.#initialCssText = [];
        this.#initialInnerHTML = [];
    }

    //////////////////////
    // HELPER FUNCTIONS //
    //////////////////////

    /**
     * Uses promises to automatically start a new roll after prev roll finishes.
     * @param intervalTime Time between each new roll, in ms.
     * @param uuid A globally unique id, used to prevent old loops from firing
     * when a new loop is started.
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
        // If the setting is on, enable all buttons in this Hotbar
        if (this.enableAllOnRoll) this.enableAll();

        // Grab a random sample from this.rollOptions
        const rolls: RollbarOption[] = sample(
            this.rollOptions,
            this._items.length
        );

        // For each sampled option, update an existing button
        let i = 0;
        for (i; i < rolls.length; i++) {
            this._items[i].onPress = []
                .concat(this.#initialOnPress[i], rolls[i].onPress)
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
            this._items[i].elem.style.cssText = this.#initialCssText[i];
            this._items[i].elem.innerHTML = this.#initialInnerHTML[i];
        }

        // Re-apply style sizes, since they were overwritten
        if (this.autoSize) this.updateAllSizes();
    }

    // Cache of initial button settings, merged with new settings of each roll.
    #initialOnPress: Function[][];
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
