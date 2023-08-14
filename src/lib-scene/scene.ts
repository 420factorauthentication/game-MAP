/** @format */

import {_Scene} from "./types";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * An object to load, track, and unload elements from an .html file.
 * Multiple instances of the same Scene object cannot be loaded simultaneously.
 */
export class Scene implements _Scene {
    /**
     * @param htmlFile Path to an .html file outlining all elements to load.
     * @param loadTimeout Load requests will timeout after this many milliseconds.
     */
    constructor(
        readonly htmlFile: string,
        readonly loadTimeout: number = 2000
    ) {}

    /////////
    // API //
    /////////

    /** Is this Scene currently loaded? */
    get isLoaded() {
        return this._isLoaded;
    }
    protected _isLoaded: boolean = false;

    /**
     * Attempts to fetch the contents of this.htmlFile with an XMLHttpRequest.
     * If successful, sets containerElem's innerHTML to the contents.
     * Does nothing if fetching fails or this Scene is already loaded.
     *
     * Returns a Promise that returns the numerical HTTP status code
     * of the XMLHttpRequest when it's readyState is 4 (DONE).
     * Exception: Returns void if Scene is already loaded.
     *
     * @param containerElem The elem to contain all newly created Scene elems.
     * Can be a css selector or existing DOM element or null,
     * in which case a new div element will be created.
     * @param containerClasses Can optionally provide classes
     * to append to containerElem's classList during loading.
     * @param containerId Can optionally provide an id
     * to set containerElem's id during loading.
     */
    async load(
        containerElem: HTMLElement | string = undefined,
        containerClasses: string | string[] = undefined,
        containerId: string = undefined
    ): Promise<number> {
        if (this._isLoaded) return;

        return new Promise<XMLHttpRequest>((resolve) => {
            let xhr = new XMLHttpRequest();
            xhr.timeout = this.loadTimeout;
            xhr.responseType = "text";
            xhr.onloadend = () => resolve(xhr);
            xhr.open("GET", this.htmlFile);
            xhr.send();
        }).then<number>((result) => {
            if (this._isLoaded) return;
            this._isLoaded = true;

            // Failure: Return status code
            if (result.status != 200) return result.status;

            // Lookup containerElem by selector
            if (containerElem)
                this._containerElem =
                    typeof containerElem === "string"
                        ? (document.querySelector(containerElem) as HTMLElement)
                        : containerElem;

            // containerElem not found. Let's create one instead.
            if (!this._containerElem) {
                this._containerElem = document.createElement("div");
                document.body.append(this._containerElem);
            }

            // Optional class and id parameters
            if (containerClasses) {
                containerClasses = Array.prototype.concat(containerClasses);
                for (const classString of containerClasses)
                    this._containerElem.classList.add(classString);
            }
            if (containerId) this._containerElem.id = containerId;

            // Create new elements from htmlFile
            this._containerElem.innerHTML = result.responseText;

            // Success: Return status code
            return result.status;
        });
    }

    /**
     * Destroy all children of containerElem.
     * @param delContainer If true, also destroys containerElem.
     */
    unload(delContainer: boolean = true) {
        if (!this._isLoaded) return;
        this._isLoaded = false;

        if (this._containerElem) {
            for (const elem of this._containerElem.childNodes) elem.remove();
            if (delContainer) {
                this._containerElem.remove();
                this._containerElem = null;
            }
        }
    }

    ////////////////
    // COMPONENTS //
    ////////////////

    /**
     * Get a handle to the container element.
     * It's children are the elems outlined in htmlFile.
     *
     * This element is created on scene load,
     * and potentially destroyed on scene unload.
     *
     * Returns undefined if this Scene has never been loaded at all.
     * Returns null if this element was destroyed during an unload.
     */
    get containerElem(): HTMLElement | undefined | null {
        return this._containerElem;
    }
    protected _containerElem: HTMLElement;
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Scene;
