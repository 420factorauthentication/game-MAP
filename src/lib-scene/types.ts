/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * An object to load, track, and unload elements from an .html file.
 * Multiple instances of the same Scene object cannot be loaded simultaneously.
 */
export interface _Scene {
    /** Path to an .html file outlining all elements to load. */
    readonly htmlFile: string;
    /** Load requests will timeout after this many milliseconds. */
    readonly loadTimeout: number;
    /** Is this Scene currently loaded? */
    get isLoaded(): boolean;
    /**
     * Get a handle to the container element.
     * It's children are the elems outlined in htmlFile.
     * This element is created on scene load,
     * and potentially destroyed on scene unload.
     * Returns undefined if this Scene has never been loaded at all.
     * Returns null if this element was destroyed during an unload.
     */
    get containerElem(): HTMLElement | undefined | null;
    /**
     * Attempts to fetch the contents of this.htmlFile with an XMLHttpRequest.
     * If successful, sets containerElem's innerHTML to the contents.
     * Does nothing if fetching fails or this Scene is already loaded.
     * Returns a Promise that returns the numerical HTTP status code
     * of the XMLHttpRequest when it's readyState is 4 (DONE).
     * @param containerElem The elem to contain all newly created Scene elems.
     * Can be a css selector or existing DOM element or null,
     * in which case a new div element will be created.
     */
    load(containerElem: HTMLElement | string): Promise<number>;
    /**
     * Destroy all children of containerElem.
     * @param delContainer If true, also destroys containerElem.
     */
    unload(delContainer: boolean): void;
}
