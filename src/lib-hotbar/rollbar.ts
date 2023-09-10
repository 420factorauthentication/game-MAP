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

    /**
     * Randomly add new button settings from this.rollOptions.
     * Each roll replaces settings added from previous rolls,
     * but not initial cached settings.
     */
    roll() {
        // Grab a random sample from this.rollOptions
        const rolls: RollbarOption[] = sample(
            this.rollOptions || [],
            this.buttons.length
        );

        // For each sampled option, update an existing button
        let i = 0;
        for (i; i < rolls.length; i++) {
            this.buttons[i].onPress = new Array<() => void>()
                .concat(this.#initialOnPress[i], rolls[i].onPress)
                .filter((x) => x);

            this.buttons[i].conditions = new Array<() => boolean>()
                .concat(this.#initialConds[i], rolls[i].conditions || [])
                .filter((x) => x);

            this.buttons[i].elem.style.cssText = [
                this.#initialCssText[i],
                rolls[i].styleCssText,
            ]
                .filter((x) => x)
                .join(" ");

            this.buttons[i].elem.innerHTML = [
                this.#initialInnerHTML[i],
                rolls[i].innerHTML,
            ]
                .filter((x) => x)
                .join(" ");
        }

        // If less samples than items, reset the remaining items
        this.reset(i);

        // If the setting is on, enable all buttons in this Hotbar
        // Overrides cached style.opacity and style.pointerEvents
        if (this.enableAllOnRoll)
            for (const button of this.buttons) button.isEnabled = true;
    }

    /** Remove all rolled button settings, leaving just initial cached settings. */
    reset(startIndex = 0) {
        for (let i = startIndex; i < this.buttons.length; i++) {
            this.buttons[i].onPress = this.#initialOnPress[i];
            this.buttons[i].conditions = this.#initialConds[i];
            this.buttons[i].elem.style.cssText = this.#initialCssText[i];
            this.buttons[i].elem.innerHTML = this.#initialInnerHTML[i];
        }
    }

    /////////////////////////////
    // PARENT CLASS EXTENSIONS //
    /////////////////////////////

    add(button: HotbarButton) {
        if (!super.add(button)) return false;
        this.#initialOnPress.push(button.onPress);
        this.#initialConds.push(button.conditions);
        this.#initialCssText.push(button.elem.style.cssText);
        this.#initialInnerHTML.push(button.elem.innerHTML);
        return true;
    }

    delete(button: HotbarButton) {
        let index = this.buttons.indexOf(button);
        if (!super.delete(button)) return false;
        this.#initialOnPress.splice(index, 1);
        this.#initialConds.splice(index, 1);
        this.#initialCssText.splice(index, 1);
        this.#initialInnerHTML.splice(index, 1);
        return true;
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
