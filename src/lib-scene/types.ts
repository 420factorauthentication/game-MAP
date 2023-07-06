/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A Scene that can be loaded or unloaded in a SceneManager.
 * Multiple instances of the same Scene cannot be loaded simultaneously.
 */
export interface _Scene {
    /** Path to an .html file outlining all elements to load. */
    readonly htmlFile: string;
    /** Is the scene currently loaded? */
    get isLoaded(): boolean;
    /**
     * Get a readonly handle to a container element.
     * This element is created on scene load.
     * It contains all elems outlined in htmlFile.
     */
    get containerElem(): Readonly<HTMLElement> | undefined;
    /**
     * Create all elements in the .html file if this Scene isn't already loaded.
     * @param containerElem The elem to contain all newly created Scene elems.
     * Can be a css selector or existing DOM element or null,
     * in which case a new div element will be created.
     */
    load(containerElem: HTMLElement | string): void;
    /** Destroy all elements associated with this Scene. */
    unload(): void;
}
