/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A class that manages a handle to a single element.
 * Useful for throwing an Error if a queried element doesn't exist.
 */
export class ElemBase {
    /**
     * @param elem Can be a CSS selector or existing DOM element or undefined,
     * in which case it does nothing or prints a provided error message.
     * @param error If elem not found, nothing happens, unless this is provided. \
     * In that case, it throws an Error with this message instead.
     */
    constructor(elem?: HTMLElement | string, error?: string) {
        if (elem)
            this._elem =
                typeof elem === "string"
                    ? (document.querySelector(elem) as HTMLElement)
                    : elem;
        if (!this._elem) if (error) throw new Error(error);
    }

    /** An element initialized in constructor and managed by this class. */
    get elem() {
        return this._elem;
    }
    protected _elem: HTMLElement;

    /** Garbage collection. */
    gc() {
        this._elem?.remove();
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default ElemBase;
