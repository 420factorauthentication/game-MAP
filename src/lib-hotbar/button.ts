/** @format */

import type {Hotbar} from "./hotbar";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A button that calls a function when clicked, or when a key is pressed. */
export class HotbarButton {
    /**
     * @param _hotbar The parent Hotbar. Automatically adds to it's array.
     * @param elem Can be a css selector or existing DOM element or null,
     * in which case a new div element will be created.
     * @param hotkey When this key is pressed, onPress functions are called.
     * Can be undefined, in which case the button can only be clicked with mouse.
     * @param onPress When hotkey is pressed, or button is clicked, these are called.
     * Can be empty, in which case nothing happens on button press/click.
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
        public onPress: Array<Function> = [],
        public singleButtonUse: boolean = false,
        public singleBarUse: boolean = false
    ) {
        // Lookup element by selector
        if (elem)
            this._elem =
                typeof elem === "string"
                    ? (document.querySelector(elem) as HTMLElement)
                    : elem;

        // No element found. Let's create one instead.
        if (!this._elem) this._elem = document.createElement("button");

        // Apply "flex: 1 1 0" to automatically size equally with siblings
        this._elem.style.flex = "1 1 0"

        // Add as child to given Hotbar
        this.hotbar.add(this);

        // Setup event listeners
        addEventListener("keydown", this);
        this._elem.addEventListener("click", this);
    }

    /////////
    // API //
    /////////

    /** If false, this button is hidden and stops doing anything on click/press. */
    get isEnabled() {
        return this._isEnabled;
    }
    set isEnabled(v) {
        this._isEnabled = v;
        if (v) {
            this._elem.style.opacity = "1";
            this._elem.style.pointerEvents = "auto";
        } else {
            this._elem.style.opacity = "0";
            this._elem.style.pointerEvents = "none";
        }
    }
    protected _isEnabled: boolean = true;

    /**
     * Begin the JS garbage collection process.
     * After calling this, manually nullify/undefine all handles to this object instance.
     */
    preDestroy() {
        removeEventListener("keydown", this);
        this._elem?.removeEventListener("click", this);
        this._elem?.remove();
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
        return this._elem;
    }
    protected _elem: HTMLElement;

    ////////////
    // EVENTS //
    ////////////
    handleEvent(e: KeyboardEvent) {
        if (!this.isEnabled) return;

        // Handle exceptions
        switch (e.type) {
            default:
                return;
            case "keydown":
                if (e.key != this.hotkey) return;
            case "click":
        }

        // Call onPress functions
        for (const func of this.onPress) func();

        // If single use, disable appropriate buttons
        if (this.singleButtonUse === true) this.isEnabled = false;
        if (this.singleBarUse === true) this.hotbar.disableAll();
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default HotbarButton;
