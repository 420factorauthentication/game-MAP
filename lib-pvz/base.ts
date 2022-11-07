/** @format */

import {vw, vh} from "../lib-meth/types";
import {BaseEntity} from "./types";

////////////////////////////////////////////////////////////////////////////////

class Base implements BaseEntity {
    constructor(
        private _hp: number,
        readonly x: vw,
        readonly y: vh,
        readonly elem?: HTMLElement
    ) {
        if (!this.elem) this.elem = this.elemInit;
    }

    get hp() {
        return this._hp;
    }
    set hp(v) {
        this._hp = v;
        this.onHpChange();
    }

    onHpChange() {
        // update HP GUI
        if (this.hp <= 0) this.die();
    }

    die() {}

    private get elemInit() {
        const elem = <HTMLElement>document.createElement("a");
        document.body.appendChild(elem);
        elem.style.position = "absolute";
        elem.style.transform = "translate(-100%, -50%)";
        elem.style.left = "" + this.x + "vw";
        elem.style.top = "" + this.y + "vh";
        elem.style.width = "5vw";
        elem.style.height = "90vh";
        elem.style.background = "content-box radial-gradient(yellow, gold)";
        return elem;
    }
}

////////////////////////////////////////////////////////////////////////////////

export default Base;
