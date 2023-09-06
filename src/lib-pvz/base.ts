/** @format */

import ClipBar from "../lib-progbar/clipbar.js";
import {ClassWithElem} from "../lib-utils/elem.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A singleton that tracks player HP and configures minion walking distance.
 * Minions spawn on the right and move left.
 * When they reach the given x, they begin damaging player HP.
 */
export class Base extends ClassWithElem {
    /**
     * @param startingHP How much HP the player starts with.
     * @param x Minions stop here and begin attacking. Viewport width units (vw).
     * @param hpBarElem An element to create a ClipBar to use as an HP bar.
     * Can be a CSS selector or existing DOM element or null,
     * in which case a new anchor element will be created.
     */
    constructor(
        startingHP: number,
        readonly x: number,
        hpBarElem?: HTMLElement | string
    ) {
        // Lookup HP Bar elem by selector. If not found, create one with default settings.
        super(hpBarElem, "a", "width: 25%; height: 10%; background: red");

        // Init HP bar
        this.#hp = startingHP;
        this.#hpBar = new ClipBar(this._elem, this.hp, 0, this.hp);
    }

    /////////
    // API //
    /////////

    /** Current player HP. If less than or equal to 0, triggers a game over. */
    get hp() {
        return this.#hp;
    }
    set hp(newAmount) {
        this.#hp = newAmount;
        this.#hpBar.value = this.#hp;
        if (this.#hp <= 0) this.die();
    }
    #hp: number;

    /** Trigger a game over. */
    die() {
        console.log("GAME OVER");
    }

    ////////////////
    // COMPONENTS //
    ////////////////

    /** An element that visually shows current HP with it's background */
    get hpBarElem() {
        return this._elem;
    }
    #hpBar: ClipBar;
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Base;
