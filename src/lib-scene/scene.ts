/** @format */

import {_Scene} from "./types";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A Scene that can be loaded or unloaded in a SceneManager.
 * Multiple instances of the same Scene cannot be loaded simultaneously.
 */
class Scene implements _Scene {
    /**
     * @param htmlFile Path to an .html file outlining all elements to load.
     */
    constructor(readonly htmlFile: string) {}

    /////////
    // API //
    /////////
    get isLoaded() {
        return this._isLoaded;
    }
    protected _isLoaded: boolean;

    /**
     * Create all elements in the .html file if this Scene isn't already loaded.
     * @param containerElem The elem to contain all newly created Scene elems.
     * Can be a css selector or existing DOM element or null,
     * in which case a new div element will be created.
     */
    load(containerElem: HTMLElement | string) {}

    /** Destroy all elements associated with this Scene. */
    unload() {}

    ////////////////
    // COMPONENTS //
    ////////////////
    get containerElem(): Readonly<HTMLElement> {
        return this._containerElem;
    }
    protected _containerElem: HTMLElement;
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Scene;
