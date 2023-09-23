/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** @see https://stackoverflow.com/questions/384286/how-do-you-check-if-a-javascript-object-is-a-dom-object */
export function isNode(o): o is Node {
    return typeof Node === "object"
        ? o instanceof Node
        : o &&
              typeof o === "object" &&
              typeof o.nodeType === "number" &&
              typeof o.nodeName === "string";
}

/** @see https://stackoverflow.com/questions/384286/how-do-you-check-if-a-javascript-object-is-a-dom-object */
export function isElem(o): o is HTMLElement {
    return typeof HTMLElement === "object"
        ? o instanceof HTMLElement //DOM2
        : o &&
              typeof o === "object" &&
              o !== null &&
              o.nodeType === Node.ELEMENT_NODE &&
              typeof o.nodeName === "string";
}

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

/** Set a style property if not already set to something. */
export function setIfUnset(elem: HTMLElement, styleKey: string, value: string) {
    if (elem.style[styleKey] == "") elem.style[styleKey] = value;
}

/** Clone and append the first child of an HTMLTemplateElement. Returns the clone. */
export function cloneTemplate(
    template?: HTMLTemplateElement,
    container: Node = document.body
) {
    if (!template) return;
    for (const child of template.content.cloneNode(true).childNodes)
        if (isElem(child)) {
            container.appendChild(child);
            container.appendChild(document.createTextNode("\n"));
            return child;
        }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** @see https://stackoverflow.com/questions/19736663/appending-elements-to-dom-with-indentation-spacing */
export function indentedAppend(
    parent: ParentNode,
    child: Node,
    indentStep = "    ",
    indentStart = ""
) {
    let indent = indentStart;
    let elem: ParentNode | null = parent;

    while (elem && elem !== document) {
        indent += indentStep;
        elem = elem.parentNode;
    }

    if (
        parent.hasChildNodes() &&
        parent.lastChild?.nodeType === Node.TEXT_NODE &&
        /^\s*[\r\n]\s*$/.test(parent.lastChild.textContent || "")
    ) {
        parent.insertBefore(
            document.createTextNode("\n" + indent),
            parent.lastChild
        );
        parent.insertBefore(child, parent.lastChild);
    } else {
        parent.append(
            document.createTextNode("\n" + indent),
            child,
            document.createTextNode("\n" + indent.slice(0, -2))
        );
    }
}
