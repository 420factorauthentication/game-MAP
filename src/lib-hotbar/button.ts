/** @format */

import type {Hotbar} from "./hotbar";

import {isLoopbar} from "./const.js";

import ElemQuery from "../lib-elem/query.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A button that calls functions when clicked, or when a key is pressed. */
export class HotbarButton {
    /**
     * @param _hotbar The parent Hotbar. Automatically adds to it's array.
     * @param elem Can be a CSS selector or existing DOM element or null,
     * in which case a new button element will be created. \
     * Applies "flex: 1 1 0" to automatically size equally with siblings.
     * @param hotkey When this key is pressed, onPress functions are called.
     * Can be undefined, in which case the button can only be clicked with mouse.
     * @param onPress When hotkey is pressed, or button is clicked, these are called.
     * Can be empty, in which case nothing happens on button press/click.
     * @param conditions All these functions are called before onPress.
     * If one returns false, onPress wont call, and singleUse wont trigger.
     * @param singleButtonUse
     * If true, disables this button after pressing/clicking it.
     * If singleBarUse is true, will be disabled regardless of singleButtonUse.
     * @param singleBarUse
     * If true, disables all buttons in parent Hotbar after button press/click.
     */
    constructor(
        private _hotbar: Hotbar,
        elem?: HTMLElement | string,
        public hotkey?: string,
        public onPress: (() => void)[] = [],
        public conditions: (() => boolean)[] = [],
        public singleButtonUse: boolean = false,
        public singleBarUse: boolean = false
    ) {
        // Lookup elem by selector. If not found, create a new one.
        this.#button = new ElemQuery(elem, "button");

        // Apply "flex: 1 1 0" to automatically size equally with siblings
        this.elem.style.flex = "1 1 0";

        // Add as child to given Hotbar
        this.hotbar.add(this);

        // Setup event listeners
        addEventListener("keydown", this);
        this.elem.addEventListener("click", this);
    }

    /////////
    // API //
    /////////

    /** If false, this button is hidden and stops doing anything on click/press. */
    get isEnabled() {
        return this.#isEnabled;
    }
    set isEnabled(newSetting) {
        this.#isEnabled = newSetting;
        if (newSetting == true) {
            this.elem.style.opacity = "1";
            this.elem.style.pointerEvents = "auto";
        } else {
            this.elem.style.opacity = "0";
            this.elem.style.pointerEvents = "none";
        }
    }
    #isEnabled: boolean = true;

    /** Garbage collection. */
    gc() {
        removeEventListener("keydown", this);
        this.elem?.removeEventListener("click", this);
        this.elem?.remove();
    }

    ////////////////
    // COMPONENTS //
    ////////////////

    /** The parent Hotbar of this button. */
    get hotbar() {
        return this._hotbar;
    }

    /** The button element. Is a child of this.hotbar.elem. */
    get elem() {
        return this.#button.elem;
    }
    #button: ElemQuery;

    ////////////
    // EVENTS //
    ////////////
    handleEvent(e) {
        if (!this.isEnabled) return;

        // If wrong events, do nothing
        switch (e.type) {
            default:
                return;
            case "keydown":
                if (e.key != this.hotkey) return;
            case "click":
        }

        // If paused Rollbar, do nothing
        if (isLoopbar(this._hotbar) && this._hotbar.isPaused) return;

        // If conditions not met, do nothing
        for (const cond of this.conditions) if (!cond()) return;

        // Call onPress functions
        for (const func of this.onPress) func();

        // If single use, disable appropriate buttons
        if (this.singleButtonUse === true) this.isEnabled = false;
        if (this.singleBarUse === true)
            for (const item of this._hotbar.buttons) item.isEnabled = false;
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default HotbarButton;
