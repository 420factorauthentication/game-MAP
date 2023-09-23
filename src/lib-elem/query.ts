/** @format */

import ElemBase from "./base.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A class that manages a handle to a single element,
 * with a constructor for providing your own element,
 * or creating a new default element if none is provided.
 */
export class ElemQuery extends ElemBase {
    /**
     * @param elem Can be a CSS selector or existing DOM element or undefined,
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
        super(elem);
        if (!this._elem) {
            this._elem = document.createElement(defaultTagName);

            if (defaultInlineStyle)
                this._elem.setAttribute("style", defaultInlineStyle);

            const parent =
                typeof defaultParent === "string"
                    ? (document.querySelector(defaultParent) as HTMLElement)
                    : defaultParent;
            if (!parent) throw new Error("ElemQuery parent selector not found");
            parent.append("\n", this._elem, "\n");
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default ElemQuery;
