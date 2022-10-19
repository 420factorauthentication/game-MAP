import { char, cssPropertyValue } from "../lib-meth/types";


////////////////////////////////////
// A button in a row of buttons   //
// Calls a function when clicked, //
// or when a hotkey is pressed    //
////////////////////////////////////
export class HotbarSlot {
    readonly elem: HTMLElement;

    get iconBG ()  {return this.elem.style.background;}
    set iconBG (v) {this.elem.style.background = v;}

    constructor (
        readonly hotbar: Hotbar,
        public hotkey: char,
        public onPress: (...params) => boolean,
        initOptions?: {
            elem?: HTMLElement,
            iconBG?: cssPropertyValue,
        },
    ){
        if (initOptions?.elem)
            this.elem = initOptions.elem;
        else
            this.elem = this.getInitElem();

        if (initOptions?.iconBG)
            this.iconBG = initOptions.iconBG;

        hotbar.elem.appendChild(this.elem);
        hotbar.slots.push(this);
    }

    protected getInitElem() {
        const elem = <HTMLElement> document.createElement("a");
        elem.style.display = "block";
        elem.style.boxSizing = "border-box";
        elem.style.width = '' + (100 / this.hotbar.maxSlots) + '%';
        elem.style.height = "100%";
        elem.style.background = "content-box radial-gradient(slategray, gray)";
        elem.style.border = "2px solid black";
        document.body.appendChild(elem);
        return elem;
    }
}


//////////////////////
// A row of buttons //
//////////////////////
export class Hotbar {
    readonly elem: HTMLElement;
    readonly slots: HotbarSlot[] = [];

    constructor(
        readonly maxSlots: number,
        initOptions?: {
            elem?: HTMLElement,
        }
    ){
        if (initOptions?.elem)
            this.elem = initOptions.elem;
        else
            this.elem = Hotbar.getInitElem();
    }

    protected static getInitElem() {
        const elem = <HTMLElement> document.createElement("div");
        elem.style.position = "absolute";
        elem.style.left = "25vw";
        elem.style.top = "80vh";
        elem.style.width = "50vw";
        elem.style.height = "15vh";
        elem.style.background = "gray";
        document.body.appendChild(elem);
        return elem;
    }
}
