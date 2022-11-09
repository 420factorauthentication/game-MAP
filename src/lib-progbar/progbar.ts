import {ProgBarFlow} from "./types";
import {Flow} from "./types.js";

///////////////////////////////
// Uses style.backgroundClip //
// to adjust background size //
// to simulate bar filling   //
///////////////////////////////

class ProgBar {
    constructor(
        readonly elem: HTMLElement,
        private _value: number = 100,
        private _min: number = 0,
        private _max: number = 100,
        private _flow: ProgBarFlow = Flow.leftToRight,
    ) {
        elem.style.boxSizing = "border-box";
        elem.style.backgroundClip = "content-box";
        this.calcPadding();
    }

    get percent() {return (this._value - this._min) / (this._max - this._min);}

    get value() {return this._value;}
    get min()   {return this._min;}
    get max()   {return this._max;}
    get flow()  {return this._flow;}

    set value (v) {this._value = v; this.calcPadding();}
    set min   (v) {this._min = v;   this.calcPadding();}
    set max   (v) {this._max = v;   this.calcPadding();}
    set flow  (v) {this._flow = v;  this.calcPadding();}

    set width (v: string) {
        this.elem.style.width = v;
        if (this.flow = Flow.leftToRight) this.calcPadding();
    }
    set height (v: string) {
        this.elem.style.height = v;
        if (this.flow = Flow.btmToTop) this.calcPadding();
    }

    private calcPadding() {
        switch (this.flow) {
            default:
            case (Flow.leftToRight):
                const rightPadding = `calc(
                    ${this.elem.style.width} *
                    ${Math.min(Math.max(1 - this.percent, 0), 1)}
                )`;
                this.elem.style.padding = `0 ${rightPadding} 0 0`;
                break;
            case (Flow.btmToTop):
                const topPadding = `calc(
                    ${this.elem.style.height} *
                    ${Math.min(Math.max(1 - this.percent, 0), 1)}
                )`;
                this.elem.style.padding = `${topPadding} 0 0`;
                break;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////

export default ProgBar;
