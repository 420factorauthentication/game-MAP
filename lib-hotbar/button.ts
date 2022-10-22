import { HotbarContainer, HotbarItem } from "./types";


////////////////////////////////////
// A button in a row of buttons   //
// Calls a function when clicked, //
// or when a hotkey is pressed    //
////////////////////////////////////
class HotbarButton implements HotbarItem {

    ////////////
    // CONFIG //
    ////////////
    constructor (
        private _hotbar: HotbarContainer,
        public hotkey: string,
        public onPress: Function,
        elem?: HTMLElement,
    ){
        if (elem) this.#elem = elem;
        this.hotbar.add(this);
        this.registerEvents();
    }


    ////////////////
    // COMPONENTS //
    ////////////////
    get hotbar() {return this._hotbar;}

    #elem: HTMLElement = HotbarButton.elemInit;
    get elem() {return this.#elem;}


    //////////
    // INIT //
    //////////
    private static get elemInit() {
        const elem = <HTMLElement> document.createElement("div");
        elem.style.display = "block";
        elem.style.boxSizing = "border-box";
        elem.style.background = "content-box radial-gradient(slategray, gray)";
        elem.style.border = "2px solid black";
        return elem;
    }


    //////////////////////
    // HELPER FUNCTIONS //
    //////////////////////
    private registerEvents() {
        // Object.defineProperty(elem, "handleEvent", {
        //     value: (e: KeyboardEvent) => {
                // if (e.key == this.hotkey) this.onPress();
        //     }
        // })
        // addEventListener()
    }
}

export default HotbarButton;
