import { HotbarContainer, HotbarItem } from "./types";

import HotbarButton from "./button.js";


//////////////////////
// A row of buttons //
//////////////////////
class Hotbar implements HotbarContainer {

    ////////////
    // CONFIG //
    ////////////
    constructor(
        public _maxItems: number,
        elem?: HTMLElement,
    ){this.construct(elem);}


    /////////
    // API //
    /////////
    get maxItems()   {return this._maxItems;}
    set maxItems(v)  {this._maxItems = v; this.updateAllSizes();}

    add (item: HotbarItem) {
        this.#items.push (item);
        this.elem.appendChild (item.elem);
        this.updateSize (item);
        return item;
    }

    remove (item: HotbarItem) {
        let index = this.items.indexOf(item);
        if (index > -1) this.#items.splice(index, 1);
    }

    newButton (hotkey: string, onPress: Function, elem?: HTMLElement) {
        return this.add (new HotbarButton (this, hotkey, onPress, elem));
    }


    ////////////////
    // COMPONENTS //
    ////////////////
    #items: HotbarItem[]   = [];
    get items(): readonly HotbarItem[]   {return this.#items;}

    #elem: HTMLElement   = Hotbar.elemInit;
    get elem()   {return this.#elem;}


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


    //////////////////////
    // HELPER FUNCTIONS //
    //////////////////////
    private updateSize (item: HotbarItem) {
        item.elem.style.width = '' + (100 / this.maxItems) + '%';
        item.elem.style.height = "100%";
    }

    private updateAllSizes() {
        for (const item of this.items)
            this.updateSize(item);
    }
}

export default Hotbar;
