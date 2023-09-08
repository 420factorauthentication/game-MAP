/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A class that manages a handle to a single element,
 * with a constructor for providing your own element,
 * or creating a new default element if none is provided.
 *
 * A boiler-plate template. Extend this with new classes.
 */
export abstract class ElemQuery {
    /**
     * @param elem Can be a CSS selector or existing DOM element or null,
     * in which case a new anchor element will be created.
     * @param defaultTagName If elem is not provided, creates new elem of this tag.
     * @param defaultInlineStyle If elem is not provided,
     * the newly created elem will have this inline style.
     * @param defaultParent, if elem is not provided,
     * the newly created elem will be appended to this elem.
     * Can be a CSS selector or existing DOM element.
     * If not provided, it will be appended to document.body.
     */
    constructor(
        elem?: HTMLElement | string,
        defaultTagName: keyof HTMLElementTagNameMap = "div",
        defaultInlineStyle?: string,
        defaultParent: HTMLElement | string = document.body
    ) {
        // Lookup element by selector
        if (elem)
            this._elem =
                typeof elem === "string"
                    ? (document.querySelector(elem) as HTMLElement)
                    : elem;

        // No element found. Create one with default settings and parent.
        if (!this._elem) {
            this._elem = document.createElement(defaultTagName);
            if (defaultInlineStyle)
                this._elem.setAttribute("style", defaultInlineStyle);
            (typeof defaultParent === "string"
                ? (document.querySelector(defaultParent) as HTMLElement)
                : defaultParent
            )?.appendChild(this._elem);
            if (!this._elem.parentElement)
                throw new Error("ClassWithElem parent selector not found");
        }
    }

    /**
     * An element initialized in constructor and managed by this class.
     * When extending this class, add setters/getters to this as desired.
     */
    // get elem() {return this._elem}
    // set elem(v) {this._elem = v}
    protected _elem: HTMLElement;

    /**
     * Begin the JS garbage collection process.
     * After calling this, manually nullify/undefine
     * all other handles to this class object instance.
     *
     * When extending this class, add garbage collection here.
     */
    preDestroy() {
        this._elem?.remove();
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default ElemQuery;
