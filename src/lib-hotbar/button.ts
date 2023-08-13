/** @format */

import {HotbarContainer, HotbarItem} from "./types";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A button that calls a function when clicked, or when a key is pressed. */
class HotbarButton implements HotbarItem {
    /**
     * @param _hotbar The parent Hotbar. Automatically adds to it's array.
     * @param elem Can be a css selector or existing DOM element or null,
     * in which case a new div element will be created.
     * @param hotkey When this key is pressed, onPress functions are called.
     * Can be undefined, in which case the button can only be clicked with mouse.
     * @param onPress When hotkey is pressed, or button is clicked, these are called.
     * Can be empty, in which case nothing happens on button press/click.
     * @param disableAllOnPress
     * If true, disables all buttons in parent Hotbar after button press/click.
     */
    constructor(
        private _hotbar: HotbarContainer,
        elem?: HTMLElement | string,
        public hotkey?: string,
        public onPress: Array<Function> = [],
        public disableAllOnPress: boolean = false
    ) {
        // Lookup element by selector
        if (elem)
            this._elem =
                typeof elem === "string"
                    ? (document.querySelector(elem) as HTMLElement)
                    : elem;

        // No element found. Let's create one instead.
        if (!this._elem) this._elem = HotbarButton.elemInit;

        // Register this button as a child of the parent Hotbar
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
        return this.#isEnabled;
    }
    set isEnabled(v) {
        this.#isEnabled = v;
        if (v) {
            this._elem.style.opacity = "1";
            this._elem.style.pointerEvents = "auto";
        } else {
            this._elem.style.opacity = "0";
            this._elem.style.pointerEvents = "none";
        }
    }
    #isEnabled: boolean = true;

    /** Destroy DOM Element and cleanup all garbage. */
    destroy() {
        removeEventListener("keydown", this);
        this._elem?.removeEventListener("click", this);
        this._elem?.remove();
        delete this._elem;
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

    //////////
    // INIT //
    //////////
    static get elemInit() {
        const elem = <HTMLElement>document.createElement("button");
        elem.style.display = "block";
        elem.style.boxSizing = "border-box";
        elem.style.background = "content-box radial-gradient(slategray, gray)";
        elem.style.border = "2px solid black";
        return elem;
    }

    //////////////////////
    // HELPER FUNCTIONS //
    //////////////////////
    handleEvent(e: KeyboardEvent) {
        if (!this.isEnabled) return;
        switch (e.type) {
            default:
                return;
            case "keydown":
                if (e.key != this.hotkey) return;
            case "click":
        }
        for (const func of this.onPress) func();
        if (this.disableAllOnPress === true) this.hotbar.disableAll();
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default HotbarButton;
