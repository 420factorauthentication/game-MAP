/** @format */

import {RollbarOption} from "../../lib-hotbar/types";

import * as Scenes from "./const/scenes.js";
import {MeleeSpells} from "./const/spells.js";
import {SpellKeys} from "./const/options.js";
import {RomanBases} from "./const/bases.js";

import Rollbar from "../../lib-hotbar/rollbar.js";
import HotbarButton from "../../lib-hotbar/button.js";
import MinionSpawner from "../../lib-pvz/spawner.js";
import Base from "../../lib-pvz/base.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

class _GameManager {
    protected _spellbar: Rollbar;
    get spellbar() {
        return this._spellbar;
    }

    protected _base: Base;
    get base() {
        return this._base;
    }

    protected _minionMan: MinionSpawner;
    get minionMan() {
        return this._minionMan;
    }

    /**
     * Create elems and singletons needed for game prototype
     * Returns a Promise that returns Scene HttpStatus when everything is loaded
     */
    async initPrototype(): Promise<number> {
        return Scenes.GameScreen.load(undefined, "scene").then((httpStatus) => {
            // Create spell funcs with minion manager at runtime
            let prototypeSpells: RollbarOption[] = [];
            for (const key in MeleeSpells) {
                prototypeSpells.push({
                    ...MeleeSpells[key],
                    onPress: MeleeSpells[key].func(this.minionMan),
                });
            }

            // Init base
            this._base = new Base(
                RomanBases.Wood.hp,
                RomanBases.Wood.x,
                RomanBases.Wood.y
            );

            // Init minion manager
            this._minionMan = new MinionSpawner(this._base);

            // Init spellbar
            let spellbarElem: HTMLElement =
                Scenes.GameScreen.containerElem.querySelector(".ui-spellbar");
            this._spellbar = new Rollbar(4, prototypeSpells, spellbarElem);

            for (const buttonElem of spellbarElem.children) {
                this._spellbar.add(
                    new HotbarButton(
                        this._spellbar,
                        SpellKeys.Cast0.default,
                        true,
                        undefined,
                        buttonElem as HTMLElement
                    )
                );
            }

            // Return HTTP status code from loading Scene
            return httpStatus;
        });
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default _GameManager;
