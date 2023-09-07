/** @format */

import {RollbarOption} from "./types";
import type {HotbarButton} from "./button";

import Hotbar from "./hotbar.js";

import {sample} from "../../node_modules/underscore/underscore-esm.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A Hotbar that caches the initial settings of added HotbarButtons:
 * - onPress
 * - conditions
 * - cssText
 * - innerHTML
 *
 * It can randomly roll additional button settings to add onto each HotbarButton. \
 * Each roll removes settings added from previous rolls, but not initial cached settings.
 */
export class Rollbar extends Hotbar {
    /**
     * @param rollOptions Every roll, it picks a random sample from this array.
     * @param enableAllOnRoll If true, enables all HotbarButtons on every roll.
     */
    constructor(
        elem?: HTMLElement | string,
        public rollOptions: RollbarOption[] = [],
        public enableAllOnRoll: boolean = true
    ) {
        super(elem);
    }

    /////////
    // API //
    /////////

    /** Randomly select new settings to update existing buttons with. */
    roll() {
        // Grab a random sample from this.rollOptions
        const rolls: RollbarOption[] = sample(
            this.rollOptions || [],
            this._items?.length || 0
        );

        // For each sampled option, update an existing button
        let i = 0;
        for (i; i < rolls.length; i++) {
            this._items[i].onPress = new Array<() => void>()
                .concat(this.#initialOnPress[i], rolls[i].onPress)
                .filter((x) => x);

            this._items[i].conditions = new Array<() => boolean>()
                .concat(this.#initialConds[i], rolls[i].conditions || [])
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
        for (i; i < (this._items?.length || 0); i++) {
            this._items[i].onPress = this.#initialOnPress[i];
            this._items[i].conditions = this.#initialConds[i];
            this._items[i].elem.style.cssText = this.#initialCssText[i];
            this._items[i].elem.innerHTML = this.#initialInnerHTML[i];
        }

        // If the setting is on, enable all buttons in this Hotbar
        // Overrides cached style.opacity and style.pointerEvents
        if (this.enableAllOnRoll) this.enableAll();
    }

    /** Remove all rolled button settings, leaving just initial cached settings. */
    reset() {
        for (let i = 0; i < this._items.length; i++) {
            this._items[i].onPress = this.#initialOnPress[i];
            this._items[i].conditions = this.#initialConds[i];
            this._items[i].elem.style.cssText = this.#initialCssText[i];
            this._items[i].elem.innerHTML = this.#initialInnerHTML[i];
        }
    }

    /////////////////////////////
    // PARENT CLASS EXTENSIONS //
    /////////////////////////////

    add(item: HotbarButton) {
        if (super.add(item) === undefined) return;
        this.#initialOnPress.push(item.onPress);
        this.#initialConds.push(item.conditions);
        this.#initialCssText.push(item.elem.style.cssText);
        this.#initialInnerHTML.push(item.elem.innerHTML);
        return item;
    }

    remove(v: number | HotbarButton): boolean;
    remove(index: number): boolean;
    remove(item: HotbarButton): boolean;
    remove(v: number | HotbarButton): boolean {
        if (super.remove(v) === false) return false;
        let index = typeof v === "number" ? v : this._items.indexOf(v);
        this.#initialOnPress.splice(index, 1);
        this.#initialConds.splice(index, 1);
        this.#initialCssText.splice(index, 1);
        this.#initialInnerHTML.splice(index, 1);
        return true;
    }

    removeAll() {
        super.removeAll();
        this.#initialOnPress = [];
        this.#initialConds = [];
        this.#initialCssText = [];
        this.#initialInnerHTML = [];
    }

    ///////////////////
    // PRIVATE CACHE //
    ///////////////////

    // Cache of initial button settings, merged with new settings of each roll.
    #initialOnPress: (() => void)[][] = [];
    #initialConds: (() => boolean)[][] = [];
    #initialCssText: string[] = [];
    #initialInnerHTML: string[] = [];
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Rollbar;
