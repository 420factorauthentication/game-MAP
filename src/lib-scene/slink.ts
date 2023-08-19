/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * An object to load, track, and unload a stylesheet link elem from a .css file.
 * Multiple instances of the same SceneLink object cannot be loaded simultaneously.
 */
export class SceneLink {
    /** @param cssFile Path to a .css file to use on load. */
    constructor(readonly cssFile: string) {}

    /////////
    // API //
    /////////

    /** Is this Scene currently loaded? */
    get isLoaded() {
        return this._isLoaded;
    }
    protected _isLoaded: boolean = false;

    /**
     * Checks if this.cssFile exists with an XMLHttpRequest.
     * If successful, creates a new link elem and sets it's href to this.cssFile.
     * Does nothing if XMLHttpRequest errors or this SceneLink is already loaded.
     *
     * Returns a Promise that returns the numerical HTTP status code
     * of the XMLHttpRequest when it's readyState is 4 (DONE).
     */
    async load(): Promise<number> {
        if (this._isLoaded) return;

        return new Promise<XMLHttpRequest>((resolve) => {
            let xhr = new XMLHttpRequest();
            xhr.timeout = 2000;
            xhr.onloadend = () => resolve(xhr);
            xhr.open("HEAD", this.cssFile);
            xhr.send();
        }).then<number>((result) => {
            if (this._isLoaded) return;
            this._isLoaded = true;

            // Failure: Return status code
            if (result.status != 200) return result.status;

            // Create a new link elem and apply the stylesheet href
            this._linkElem = document.createElement("link");
            document.head.append(this._linkElem);
            this._linkElem.setAttribute("rel", "stylesheet");
            this._linkElem.setAttribute("href", this.cssFile);

            // Success: Return status code
            return result.status;
        });
    }

    /** Destroy this.linkElem. */
    unload() {
        if (!this._isLoaded) return;
        this._isLoaded = false;
        this._linkElem.remove();
        this._linkElem = null;
    }

    ////////////////
    // COMPONENTS //
    ////////////////

    /**
     * Get a handle to the link element with the stylesheet.
     * Created on SceneLink load, and destroyed on SceneLink unload.
     *
     * Returns undefined if this SceneLink has never been loaded at all.
     * Returns null if this element was destroyed during an unload.
     */
    get linkElem() {
        return this._linkElem;
    }
    protected _linkElem: HTMLElement | undefined | null;
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default SceneLink;
