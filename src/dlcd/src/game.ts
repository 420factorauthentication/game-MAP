/** @format */

import {RollbarOption} from "../../lib-hotbar/types";

import {GameScreen as GameScene} from "./const/scenes.js";
import * as Spells from "./const/spells.js";
import {SpellKeys} from "./const/options.js";
import {Wood as WoodBase} from "./const/bases.js";
import {Mid as MidDistance, Wide as WideSpread} from "./const/spawners.js";

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
        return GameScene.load(undefined, "scene").then((httpStatus) => {
            if (httpStatus != 200) return;

            // Create spell funcs with minion manager at runtime
            let prototypeSpells: RollbarOption[] = [];
            for (const key in Spells) {
                prototypeSpells.push({
                    ...Spells[key],
                    onPress: Spells[key].func(this.minionMan),
                });
            }

            // Init base
            let baseElem: HTMLElement =
                GameScene.containerElem.querySelector("#game-base");
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

            // Init spellbar
            let spellbarElem: HTMLElement =
                GameScene.containerElem.querySelector("#game-spellbar");
            this._spellbar = new Rollbar(4, prototypeSpells, spellbarElem);

            for (const node of spellbarElem.childNodes) {
                // Get rid of unwanted whitespace text nodes after inline elems
                if (node.nodeName === "#text") {
                    node.parentNode.removeChild(node);
                    continue;
                } else if (node.nodeName !== "button") continue;

                let i = 0;
                this._spellbar.add(
                    new HotbarButton(
                        this._spellbar,
                        SpellKeys["Cast" + i.toString()].default,
                        true,
                        undefined,
                        node as HTMLElement
                    )
                );
                i++;
            }

            // Return HTTP status code from loading Scene
            return httpStatus;
        });
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default _GameManager;
