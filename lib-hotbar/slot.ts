import { HotbarContainer } from "./types";

////////////////////////////////////
// A button in a row of buttons   //
// Calls a function when clicked, //
// or when a hotkey is pressed    //
////////////////////////////////////
class HotbarSlot {

    ////////////
    // CONFIG //
    ////////////
    constructor (
        readonly hotbar: HotbarContainer,
        public hotkey: string,
        public onPress: Function,
        elem?: HTMLElement,
    ){this.construct(hotbar, elem);}


    ////////////////
    // COMPONENTS //
    ////////////////
    #elem: HTMLElement = this.elemInit;
    get elem() {return this.#elem;}


    /////////
    // API //
    /////////
    


    /////////////////
    // CONSTRUCTOR //
    /////////////////
    private construct (hotbar: HotbarContainer, elem?: HTMLElement) {
        if (elem) this.elem = elem;
        this.container = hotbar;
    }

    private set container (container: HotbarContainer) {
        container.elem.appendChild(this.elem);
        container.items.push(this);
    }

    private get elemInit() {
        const elem = <HTMLElement> document.createElement("div");
        elem.style.display = "block";
        elem.style.boxSizing = "border-box";
        elem.style.background = "content-box radial-gradient(slategray, gray)";
        elem.style.border = "2px solid black";
        this.fitInContainer(elem);
        return elem;
    }


    //////////////////////
    // HELPER FUNCTIONS //
    //////////////////////
    protected set elem (newElem: HTMLElement) {
        HotbarSlot.registerEvents(newElem);
        this.fitInContainer(newElem);
        this.#elem = newElem;
    }

    private static registerEvents (elem: HTMLElement) {
        // Object.defineProperty(elem, "handleEvent", {
        //     value: (e: KeyboardEvent) => {
                // if (e.key == this.hotkey) this.onPress();
        //     }
        // })
        // addEventListener()
    }

    private fitInContainer (elem: HTMLElement) {
        elem.style.width = '' + (100 / this.hotbar.maxItems) + '%';
        elem.style.height = "100%";
    }
}

export default HotbarSlot;
