import {vw, vh} from "../lib-meth/types";
import {BaseEntity} from "./types";
import {Flow} from "../lib-progbar/types.js";

import ProgBar from "../lib-progbar/progbar.js";

////////////////////////////////////////////////////////////////////////////////

class Base implements BaseEntity {
    constructor(
        private _hp: number,
        readonly x: vw,
        readonly y: vh,
        readonly elem?: HTMLElement
    ) {
        this.elem = elem ? elem : this.elemInit;
        this.hpBar = new ProgBar(
            this.hpBarElemInit,
            this.hp, 0, this.hp,
            Flow.btmToTop
        );
    }

    protected hpBar: ProgBar;

    get hp() {return this._hp;}
    set hp(v) {
        this._hp = v;
        this.hpBar.value = this.hp;
        if (this.hp <= 0) this.die();
    }

    die() {
        console.log("GAME OVER")
    }

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

    private get hpBarElemInit() {
        const elem = <HTMLElement>document.createElement("a");
        this.elem.appendChild(elem);
        elem.style.position = "absolute";
        elem.style.height = this.elem.style.height;
        elem.style.width = `calc(${this.elem.style.width} / 2)`;
        elem.style.left = `calc(-${this.elem.style.width} / 1.5)`;
        elem.style.background = "darkgreen";
        return elem;
    }
}

////////////////////////////////////////////////////////////////////////////////

export default Base;
