/** @format */

import {ClassWithElem} from "../lib-utils/elem.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A UI that displays the hotkeys for each button in a Hotbar. \
 * Automatically creates one span for each button. \
 * Applies "display: flex" to this.elem
 * and "flex: 1 1 0" to each created child span to automatically align them. \
 * NOTE: Doesn't automatically set size of this.elem to match a Hotbar. Manually do that.
 */
export class KeyUI extends ClassWithElem {
    /**
     * @param elem Can be a CSS selector or existing DOM element or null,
     * in which case a new div element will be created. \
     * Applies "display: flex" to automatically size children equally. \
     * Methods create children spans with "flex: 1 1 0" automatically.
     * @param _buttonCount The amount of buttons to create UI for. \
     * Automatically creates children spans equal to this number with "flex: 1 1 0"
     * @param _hotkeys The text to show above each button.
     */
    constructor(
        elem?: HTMLElement | string,
        private _buttonCount: number = 0,
        private _hotkeys: string[] = []
    ) {
        // Lookup elem by selector. If not found, create one with default settings.
        super(elem, "div", "width: 25%; height: 10%");

        // Apply "display: flex" to automatically size children equally
        this._elem.style.display = "flex";

        // Init UI
        this._elem.style.pointerEvents = "none";
        this.#updateCount();
        this.#updateText();
    }

    /////////
    // API //
    /////////

    /**
     * The amount of buttons to create UI for. \
     * When set, automatically creates/removes children spans. \
     * Automatically adds "flex: 1 1 0" to created children spans to align them.
     */
    get buttonCount() {
        return this._buttonCount;
    }
    set buttonCount(v) {
        this._buttonCount = v;
        this.#updateCount();
    }

    /**
     * The text to show above each button. \
     * When set, automatically updates innerHTML of children spans.
     */
    get hotkeys() {
        return this._hotkeys;
    }
    set hotkeys(v) {
        this._hotkeys = v;
        this.#updateText();
    }

    ////////////////
    // COMPONENTS //
    ////////////////

    /** A container used to hold spans to show UI. */
    get elem() {
        return this._elem;
    }

    //////////////////////
    // HELPER FUNCTIONS //
    //////////////////////

    #newChild() {
        const child = this._elem.appendChild(document.createElement("span"));
        child.style.flex = "1 1 0";
        child.style.textAlign = "end";
        child.style.padding = "2%";
        child.style.pointerEvents = "none";
        child.style.userSelect = "none";
        return child;
    }

    #updateCount() {
        for (let i = this._elem.childElementCount; i < this._buttonCount; i++)
            this.#newChild();
        for (let i = this.elem.childElementCount; i > this._buttonCount; i--)
            this.elem.lastChild?.remove();
    }

    #updateText() {
        let i = 0;
        for (const elem of this._elem.children) {
            let child = elem as HTMLElement;
            child.innerHTML = this._hotkeys[i]
                ? this._hotkeys[i].toUpperCase()
                : "";
            i++;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default KeyUI;
