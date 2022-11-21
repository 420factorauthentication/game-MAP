/** @format */

import {HotbarContainer, HotbarItem} from "./types";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A button that calls a function when clicked, or when a key is pressed. */
class HotbarButton implements HotbarItem {
    /**
     *
     * @param _hotbar The parent Hotbar of this button.
     * @param hotkey When this key is pressed, onPress() is called.
     * @param onPress When hotkey is pressed, this is called.
     * @param elem Can be a css selector or existing DOM element or null,
     * in which case a new div element will be created.
     */
    constructor(
        private _hotbar: HotbarContainer,
        public hotkey: string,
        public onPress: Function,
        elem?: HTMLElement | string
    ) {
        // Lookup element by selector
        if (elem)
            this._elem =
                typeof elem === "string"
                    ? (document.querySelector(elem) as HTMLElement)
                    : elem;

        // No element found. Let's create one instead.
        if (!this.elem) this._elem = HotbarButton.elemInit;

        // Register this button as a child of the parent Hotbar
        this.hotbar.add(this);

        // Setup event listeners
        addEventListener("keydown", this);
    }

    /////////
    // API //
    /////////

    /**
     * This button should be listening to all events in this array.
     * When any of these events are triggered, calls handleEvent().
     */
    readonly eventTypes: readonly (keyof WindowEventMap)[] = ["keydown"];

    /** This is called when any event in this.eventTypes are triggered. */
    handleEvent(e: KeyboardEvent) {
        if (e.key == this.hotkey) this.onPress();
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
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default HotbarButton;
