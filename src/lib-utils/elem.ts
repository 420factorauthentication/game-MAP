/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Set an HTMLElement to:
 * - position: absolute
 * - width, height, top, left: A given DOMRect
 * - right, bottom: auto
 */
export function absPos(elem: HTMLElement, rect: DOMRect) {
    elem.style.position = "absolute";
    elem.style.width = rect.width.toString() + "px";
    elem.style.height = rect.height.toString() + "px";
    elem.style.inset = `${rect.top}px auto auto ${rect.left}px`;
}