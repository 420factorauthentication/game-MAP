/** @format */

import {RollbarOption} from "../../../lib-hotbar/types";

import {
    GameScreen as GameScene,
    TechMenu as TechMenuScene,
} from "../const/scenes.js";
import {LvlOne} from "../const/levels.js";
import * as Spells from "../const/spells.js";
import {SpellKeys} from "../const/options.js";
import {Wood as WoodBase} from "../const/bases.js";
import {
    SpellbarMax,
    SpellbarSpeed,
    SpawnMinX,
    SpawnMaxX,
    SpawnMinY,
    SpawnMaxY,
} from "../const/game.js";

import Base from "../../../lib-pvz/base.js";
import MinionSpawner from "../../../lib-pvz/spawner.js";
import Rollbar from "../../../lib-hotbar/rollbar.js";
import HotbarButton from "../../../lib-hotbar/button.js";
import KeyUI from "../../../lib-hotbar/keyui.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A decorated function that caches game components.
 * Starts the game if not started. Does nothing if already started.
 */
export const PlayGame = (() => {
    const cache: {
        isLoaded?: boolean;
        base?: Base;
        minionMan?: MinionSpawner;
        spellbar?: Rollbar;
        keyui?: KeyUI;
    } = {};

    return () => {
        if (cache.isLoaded) return;
        GameScene.load(undefined, "scene").then((httpStatus) => {
            if (httpStatus != 200) return;
            cache.isLoaded = true;

            cache.base = new Base(
                WoodBase.hp,
                WoodBase.x,
                WoodBase.y,
                GameScene.containerElem.querySelector(
                    "#game-base"
                ) as HTMLElement
            );

            cache.minionMan = new MinionSpawner(
                cache.base,
                SpawnMinX,
                SpawnMaxX,
                SpawnMinY,
                SpawnMaxY
            );

            cache.spellbar = new Rollbar(
                SpellbarMax,
                true,
                Object.values(Spells).map((v) => {
                    const {func, ...allButFunc} = v;
                    return {
                        ...allButFunc,
                        onPress: [func(cache.minionMan)],
                    };
                }),
                GameScene.containerElem.querySelector(
                    "#game-spellbar"
                ) as HTMLElement
            );
            for (let i = 0; i < SpellbarMax; i++)
                new HotbarButton(
                    cache.spellbar,
                    document.createElement("button"),
                    Object.values(SpellKeys)[i].default,
                    [],
                    true
                );

            cache.keyui = new KeyUI(
                SpellbarMax,
                Object.values(SpellKeys).map((v) => v.default),
                GameScene.containerElem.querySelector(
                    "#game-keyui"
                ) as HTMLElement
            );

            cache.spellbar.start(SpellbarSpeed);
            cache.minionMan.startLevel(LvlOne);
        });
    };
})();
