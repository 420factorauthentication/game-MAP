
import { HotbarContainer } from "./types";


//////////////////////
// A row of buttons //
//////////////////////
class Hotbar implements HotbarContainer {

    ////////////
    // CONFIG //
    ////////////
    constructor(
        public maxItems: number,
        elem?: HTMLElement,
    ){this.construct(elem);}


    /////////
    // API //
    /////////
    items: unknown[] = [];


    ////////////////
    // COMPONENTS //
    ////////////////
    #elem: HTMLElement = Hotbar.elemInit;
    get elem() {return this.#elem;}


    /////////////////
    // CONSTRUCTOR //
    /////////////////
    private construct (elem?: HTMLElement) {
        if (elem) this.#elem = elem;
    }

    private static get elemInit() {
        const elem = <HTMLElement> document.createElement("div");
        elem.style.position = "absolute";
        elem.style.left = "25vw";
        elem.style.top = "80vh";
        elem.style.width = "50vw";
        elem.style.height = "15vh";
        elem.style.background = "gray";
        elem.style.display = "flex";
        elem.style.flexDirection = "row";
        document.body.appendChild(elem);
        return elem;
    }
}

export default Hotbar;
