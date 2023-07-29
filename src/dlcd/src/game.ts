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
    #spellbar: Rollbar;
    get spellbar() {
        return this.#spellbar;
    }

    #base: Base;
    get base() {
        return this.#base;
    }

    #minionMan: MinionSpawner;
    get minionMan() {
        return this.#minionMan;
    }

    initPrototype() {
        Scenes.GameScreen.load(undefined, "scene").then((httpCode: number) => {
            // Create spell funcs with minion manager at runtime
            let prototypeSpells: RollbarOption[] = [];
            for (const key in MeleeSpells) {
                prototypeSpells.push({
                    ...MeleeSpells[key],
                    onPress: MeleeSpells[key].func(this.minionMan),
                });
            }

            // Init base
            this.#base = new Base(
                RomanBases.Wood.hp,
                RomanBases.Wood.x,
                RomanBases.Wood.y
            );

            // Init minion manager
            this.#minionMan = new MinionSpawner(this.#base);

            // Init spellbar
            let spellbarElem: HTMLElement =
                Scenes.GameScreen.containerElem.querySelector("#ui-spellbar");
            this.#spellbar = new Rollbar(4, prototypeSpells, spellbarElem);

            for (const buttonElem of spellbarElem.children) {
                this.#spellbar.add(
                    new HotbarButton(
                        this.#spellbar,
                        SpellKeys.Cast0.default,
                        true,
                        undefined,
                        buttonElem as HTMLElement
                    )
                );
            }
        });
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default _GameManager;
