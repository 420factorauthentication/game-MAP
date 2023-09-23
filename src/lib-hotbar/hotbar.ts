/** @format */

import {HotbarButton} from "./button";

import ElemQuery from "../lib-elem/query.js";
import Manager from "../lib-manager/manager.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A row of buttons that call functions when clicked, or when a key is pressed. */
export class Hotbar {
    /**
     * @param elem Can be a CSS selector or existing DOM element or undefined,
     * in which case a new div element will be created. \
     * Applies "display: flex" to automatically size children equally. \
     * Children HotbarButtons are automatically given "flex: 1 1 0" in their class.
     */
    constructor(elem?: HTMLElement | string) {
        // Lookup elem by selector. If not found, create one with default settings.
        this.#hotbar = new ElemQuery(
            elem,
            "div",
            "width: 25%; height: 10%; background: gray"
        );

        // Make inner HTML neater
        this.elem.append("\n");

        // Apply "display: flex" to automatically size children equally
        this.elem.style.display = "flex";
    }

    /////////
    // API //
    /////////

    /**
     * Add an existing HotbarButton to this manager, if not already in this manager.
     * Returns true if not already in this manager.
     * Returns false if already in this manager.
     */
    add(button: HotbarButton) {
        this.elem?.append(button.elem, "\n");
        return this._buttons.add(button);
    }

    /** Delete a HotbarButton in this manager. */
    delete(button: HotbarButton) {
        return this._buttons.remove(button);
    }

    /** Garbage collection. */
    gc() {
        this.#hotbar.gc();
        this._buttons.gc();
    }

    ////////////////
    // COMPONENTS //
    ////////////////

    /**
     * Get an array of all HotbarButtons currently in this Hotbar.
     * Returns a frozen non-live copy.
     */
    get buttons(): readonly HotbarButton[] {
        return this._buttons.items;
    }
    protected _buttons = new Manager<HotbarButton>();

    /** The Hotbar element. Button elements will be children to this. */
    get elem() {
        return this.#hotbar.elem;
    }
    #hotbar: ElemQuery;
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Hotbar;
