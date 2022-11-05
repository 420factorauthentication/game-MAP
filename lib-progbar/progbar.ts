import {Flow, ProgBarFlow} from "./types";
import {cssPropertyValue} from "../lib-meth/types";

////////////////////////////////////////////////////////////////////////////////

class ProgBar {
    constructor(
        readonly elem: HTMLElement,
        private _flow: ProgBarFlow,
        private _fillBG: cssPropertyValue,
        private _emptyBG: cssPropertyValue,
        private _value: number = 0,
        private _min: number = 0,
        private _max: number = 100,
    ) {
        elem.style.backgroundClip = "content-box";
    }

    get percent() {return (this._value - this._min) / (this._max - this._min);}

    get flow()    {return this._flow;}
    get fillBG()  {return this._fillBG;}
    get emptyBG() {return this._emptyBG;}
    get value()   {return this._value;}
    get min()     {return this._min;}
    get max()     {return this._max;}

    set flow    (v) {this._flow = v;    this.onChangeFlow();}
    set fillBG  (v) {this._fillBG = v;  this.onChangeFillBG();}
    set emptyBG (v) {this._emptyBG = v; this.onChangeEmptyBG();}
    set value   (v) {this._value = v;   this.calcPadding();}
    set min     (v) {this._min = v;     this.calcPadding();}
    set max     (v) {this._max = v;     this.calcPadding();}

    set width (v: string) {
        this.elem.style.width = v;
        if (this.flow = Flow.leftToRight) this.calcPadding();
    }
    set height (v: string) {
        this.elem.style.height = v;
        if (this.flow = Flow.btmToTop) this.calcPadding();
    }

    private onChangeFlow() {}

    private onChangeFillBG() {}

    private onChangeEmptyBG() {}

    private calcPadding() {
        switch (this.flow) {
            default:
            case (Flow.leftToRight):
                const widthUnit = this.elem.style.width.match(/\D+/)[0];
                const widthVal = Number(this.elem.style.width.match(/\d+/)[0]);
                const padRightVal = widthVal * (1 - this.percent);
                const padRight = '' + padRightVal + widthUnit;
                this.elem.style.padding = `0 ${padRight} 0 0`;
                break;
            case (Flow.btmToTop):
                const heightUnit = this.elem.style.height.match(/\D+/)[0];
                const heightVal = Number(this.elem.style.height.match(/\d+/)[0]);
                const padTopVal = heightVal * (1 - this.percent);
                const padTop = '' + padTopVal + heightUnit;
                this.elem.style.padding = `${padTop} 0 0`
                break;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////

export default ProgBar;
