/** @format */

import {RollbarOption} from "../../lib-hotbar/types";

import {GameScreen as GameScene} from "./const/scenes.js";
import * as Spells from "./const/spells.js";
import {SpellKeys} from "./const/options.js";
import {Wood as WoodBase} from "./const/bases.js";
import {Mid as MidDistance, Wide as WideSpread} from "./const/spawners.js";
import {SpellbarMax, SpellbarSpeed} from "./const/player.js";

import Base from "../../lib-pvz/base.js";
import MinionSpawner from "../../lib-pvz/spawner.js";
import Rollbar from "../../lib-hotbar/rollbar.js";
import HotbarButton from "../../lib-hotbar/button.js";
import KeyUI from "../../lib-hotbar/keyui.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

class _GameManager {
    protected _base: Base;
    get base() {
        return this._base;
    }

    protected _minionMan: MinionSpawner;
    get minionMan() {
        return this._minionMan;
    }

    protected _spellbar: Rollbar;
    get spellbar() {
        return this._spellbar;
    }

    protected _keyui: KeyUI;
    get keyui() {
        return this._keyui;
    }

    protected _prototypeIsLoaded: boolean;
    get prototypeIsLoaded() {
        return this._prototypeIsLoaded;
    }

    /**
     * Create elems and singletons needed for game prototype.
     * Returns a Promise that returns Scene HttpStatus when everything is loaded.
     * Exception: Returns void if Scene is already loaded.
     */
    async loadPrototype(): Promise<number> {
        if (this._prototypeIsLoaded) return;
        return GameScene.load(undefined, "scene").then((httpStatus) => {
            if (httpStatus != 200) return httpStatus;

            // Variables
            let prototypeSpells: RollbarOption[] = [];
            let baseElem: HTMLElement =
                GameScene.containerElem.querySelector("#game-base");
            let spellbarElem: HTMLElement =
                GameScene.containerElem.querySelector("#game-spellbar");
            let keyuiElem: HTMLElement =
                GameScene.containerElem.querySelector("#game-keyui");
            let spellHotkeys: string[] = [];
            for (const arrayKey in SpellKeys)
                spellHotkeys.push(SpellKeys[arrayKey].default);

            // Init base
            this._base = new Base(
                WoodBase.hp,
                WoodBase.x,
                WoodBase.y,
                baseElem
            );

            // Init minion manager
            this._minionMan = new MinionSpawner(
                this._base,
                MidDistance.minX,
                MidDistance.maxX,
                WideSpread.minY,
                WideSpread.maxY
            );

            // Create spell funcs with minion manager at runtime
            for (const key in Spells) {
                prototypeSpells.push({
                    ...Spells[key],
                    onPress: Spells[key].func(this.minionMan),
                });
            }

            // Init spellbar
            this._spellbar = new Rollbar(
                SpellbarMax,
                true,
                prototypeSpells,
                spellbarElem
            );

            // Add spellbar buttons
            for (let i = 0; i < SpellbarMax; i++) {
                let newBtn = new HotbarButton(
                    this._spellbar,
                    document.createElement("button"),
                    spellHotkeys[i],
                    [],
                    true
                );
            }

            // Init keyui
            this._keyui = new KeyUI(SpellbarMax, spellHotkeys, keyuiElem);

            // Start spellbar rolling
            this._spellbar.start(SpellbarSpeed);

            // Return HTTP status code from loading Scene
            return httpStatus;
        });
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default _GameManager;
