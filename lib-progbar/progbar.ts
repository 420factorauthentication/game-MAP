import { cssPropertyValue } from "../lib-meth/types";
import { ProgBarOrient, _ProgBarOrient } from "./types";

class ProgessBar {
    constructor(
        private  _orient : _ProgBarOrient,
        private  _fillBG : cssPropertyValue,
        private  _emptyBG: cssPropertyValue,
        readonly elem    : HTMLElement,
    ){}

    get orient  () {return this._orient;}
    get fillBG  () {return this._fillBG;}
    get emptyBG () {return this._emptyBG;}

    set orient  (v) {this._orient  = v; this.onOrientChange();}
    set fillBG  (v) {this._fillBG  = v; this.onChangeFillBG();}
    set emptyBG (v) {this._emptyBG = v; this.onChangeEmptyBG();}

    private onOrientChange() {

    }

    private onChangeFillBG() {

    }

    private onChangeEmptyBG() {

    }

    // private calcBG(): cssPropertyValue {
    //     let fillWidth;
    //     let fillHeight;
    //     switch (this.orient) {
    //         default:
    //         case (ProgBarOrient.horiz):
    //             break;
    //         case (ProgBarOrient.vert):
    //             break;
    //     }
    // }
}
