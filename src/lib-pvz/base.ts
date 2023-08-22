
import {BaseType} from "./types"

import {Flow} from "../lib-progbar/const.js";
import ClipBar from "../lib-progbar/clipbar.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A singleton that tracks player HP and configures minion walking distance.
 * Minions spawn on the right and move left.
 * When they reach the given x, they begin damaging player HP.
 */
export class Base implements BaseType {
    /**
     * @param startingHP How much HP the player starts with.
     * @param x Minions stop here and begin attacking. Viewport width units (vw).
     * @param hpBarElem An element to create a {@link ClipBar} to use as an HP bar.
     * Can be a css selector or existing DOM element or null,
     * in which case a new anchor element will be created.
     */
    constructor(
        startingHP: number,
        readonly x: number,
        hpBarElem?: HTMLElement | string
    ) {
        this._hp = startingHP;

        // Lookup HP Bar element by selector
        if (hpBarElem)
            this._hpBarElem =
                typeof hpBarElem === "string"
                    ? (document.querySelector(hpBarElem) as HTMLElement)
                    : hpBarElem;

        // No element found. Create one with default settings.
        if (!this._hpBarElem) {
            this._hpBarElem = document.createElement("a");
            document.body
                .appendChild(this._hpBarElem)
                .setAttribute("style", "width: 25%; height: 10%; background: red;");
        }

        // Init HP bar
        this.hpBar = new ClipBar(this._hpBarElem, this.hp, 0, this.hp);
    }

    /////////
    // API //
    /////////

    /** Current player HP. If less than or equal to 0, triggers a game over. */
    get hp() {return this._hp;}
    set hp(v) {
        this._hp = v;
        this.hpBar.value = this._hp;
        if (this._hp <= 0) this.die();
    }
    protected _hp: number;

    /** Trigger a game over. */
    die() {
        console.log("GAME OVER")
    }

    /**
     * Begin the JS garbage collection process.
     * After calling this, manually nullify/undefine all handles to this object instance.
     */
    preDestroy() {
        this._hpBarElem?.remove();
    }

    ////////////////
    // COMPONENTS //
    ////////////////
    get hpBarElem() {return this._hpBarElem;}
    protected _hpBarElem: HTMLElement;

    protected hpBar: ClipBar;
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Base;
