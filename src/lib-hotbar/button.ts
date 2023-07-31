/** @format */

import {HotbarContainer, HotbarItem} from "./types";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A button that calls a function when clicked, or when a key is pressed. */
class HotbarButton implements HotbarItem {
    /**
     * @param _hotbar The parent Hotbar. Automatically adds to it's array.
     * @param hotkey When this key is pressed, onPress() is called.
     * @param disableAllOnPress
     * If true, disables all buttons in parent Hotbar after button press/click.
     * @param onPress When hotkey is pressed, or button is clicked, this is called.
     * Can be undefined, in which case nothing happens on button press/click.
     * @param elem Can be a css selector or existing DOM element or null,
     * in which case a new div element will be created.
     */
    constructor(
        private _hotbar: HotbarContainer,
        public hotkey: string,
        public disableAllOnPress: boolean = false,
        public onPress: Function | undefined,
        elem?: HTMLElement | string
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

        // TODO: IMPLEMENT CLICKING ON BUTTON
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
        const elem = <HTMLElement>document.createElement("a");
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
        if (e.key != this.hotkey) return;
        if (this.onPress) this.onPress();
        if (this.disableAllOnPress === true) this.hotbar.disableAll();
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default HotbarButton;
