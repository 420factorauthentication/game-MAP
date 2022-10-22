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
    ){
        if (elem) this.#elem = elem;
    }


    /////////
    // API //
    /////////
    get maxItems()   {return this._maxItems;}
    set maxItems(v)  {
        if (v < this.items.length)
            throw new Error("Cant set max items below current length");
        this._maxItems = v;
        this.updateAllSizes();
    }

    add (item: HotbarItem) {
        if (this.items.length >= this.maxItems) throw new Error("Max items")
        this.#items.push (item);
        this.elem.appendChild (item.elem);
        this.updateSize (item);
        return item;
    }

    remove (index: number)
    remove (item: HotbarItem)
    remove (v: number | HotbarItem) {
        let index = (typeof v === "number") ? v : this.items.indexOf(v);
        if (index < 0) return;
        this.elem.removeChild(this.items[index].elem);
        this.#items.splice(index, 1);
    }


    ////////////////
    // COMPONENTS //
    ////////////////
    #items: HotbarItem[]  = [];
    get items(): readonly HotbarItem[]  {return this.#items;}

    #elem: HTMLElement  = Hotbar.elemInit;
    get elem()  {return this.#elem;}


    //////////
    // INIT //
    //////////
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
