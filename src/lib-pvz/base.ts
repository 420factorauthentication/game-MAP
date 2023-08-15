import {BaseEntity} from "./types";

import {Flow} from "../lib-progbar/const.js";
import ClipBar from "../lib-progbar/clipbar.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * An entity with HP that can be attacked by Minions.
 * Minions spawn on the right and move left.
 * When they reach the same x, they will automatically attack the Base.
 */
export class Base implements BaseEntity {
    /**
     * @param x Is in viewport width units (vw).
     * @param y Is in viewport height units (vh).
     * @param elem Can be a css selector or existing DOM element or null,
     * in which case a new anchor element will be created.
     */
    constructor(
        private _hp: number,
        readonly x: number,
        readonly y: number,
        elem?: HTMLElement | string
    ) {
        // Lookup element by selector
        if (elem)
            this._elem =
                typeof elem === "string"
                    ? (document.querySelector(elem) as HTMLElement)
                    : elem;

        // No element found. Let's create one instead.
        if (!this._elem) this._elem = this.elemInit;
        
        // Init components
        this.hpBar = new ClipBar(
            this.hpBarElemInit,
            this.hp, 0, this.hp,
            Flow.btmToTop
        );
    }

    /////////
    // API //
    /////////
    get hp() {return this._hp;}
    set hp(v) {
        this._hp = v;
        this.hpBar.value = this.hp;
        if (this.hp <= 0) this.die();
    }

    die() {
        console.log("GAME OVER")
    }

    /**
     * Begin the JS garbage collection process.
     * After calling this, manually nullify/undefine all handles to this object instance.
     */
    preDestroy() {
        this._elem?.remove();
    }

    ////////////////
    // COMPONENTS //
    ////////////////
    get elem() {return this._elem;}
    protected _elem: HTMLElement;

    protected hpBar: ClipBar;

    //////////
    // INIT //
    //////////
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
        elem.style.zIndex = "1";
        return elem;
    }

    private get hpBarElemInit() {
        const elem = <HTMLElement>document.createElement("a");
        this._elem.appendChild(elem);
        elem.style.position = "absolute";
        elem.style.height = this._elem.style.height;
        elem.style.width = `calc(${this._elem.style.width} / 2)`;
        elem.style.left = `calc(${this._elem.style.width} / 2)`;
        elem.style.background = "darkgreen";
        elem.style.zIndex = "2";
        return elem;
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Base;
