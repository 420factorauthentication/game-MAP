/** @format */

import {
    GameScreen,
    GameStyleComponents,
    GameStyleSettings,
} from "./const/scenes.js";
import {LvlOne} from "./const/levels.js";
import * as Spells from "./const/spells.js";
import {SpellKeys} from "./const/options.js";
import {Wood as WoodBase} from "./const/bases.js";
import {
    SpellbarMax,
    SpellbarSpeed,
    SpawnMinX,
    SpawnMaxX,
    SpawnMinY,
    SpawnMaxY,
} from "./const/game.js";

import {ResourceManager} from "./resource.js";
import Base from "../../lib-pvz/base.js";
import MinionSpawner from "../../lib-pvz/spawner.js";
import Rollbar from "../../lib-hotbar/rollbar.js";
import HotbarButton from "../../lib-hotbar/button.js";
import KeyUI from "../../lib-hotbar/keyui.js";

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
        resourceMan?: ResourceManager;
        spellbar?: Rollbar;
        keyui?: KeyUI;
    } = {};

    return () => {
        if (cache.isLoaded) return;
        GameScreen.load(undefined, "scene", "game").then((httpStatus) => {
            if (httpStatus != 200) return;
            cache.isLoaded = true;

            // Load CSS
            GameStyleComponents.load();
            GameStyleSettings.load();

            // Init game components
            cache.base = new Base(
                WoodBase.hp,
                WoodBase.x,
                GameScreen.containerElem.querySelector(
                    "#game-hpbar"
                ) as HTMLElement
            );

            cache.minionMan = new MinionSpawner(
                cache.base,
                SpawnMinX,
                SpawnMaxX,
                SpawnMinY,
                SpawnMaxY
            );

            cache.resourceMan = new ResourceManager(
                GameScreen.containerElem.querySelector("#robux-counter"),
                GameScreen.containerElem.querySelector("#cringes-counter")
            );

            cache.spellbar = new Rollbar(
                GameScreen.containerElem.querySelector(
                    "#game-spellbar"
                ) as HTMLElement,
                Object.values(Spells).map((v) => {
                    const {getOnPress, getCondition, ...otherProps} = v;
                    return {
                        ...otherProps,
                        onPress: [getOnPress(cache.minionMan)],
                        conditions: getCondition
                            ? [getCondition(cache.resourceMan)]
                            : [],
                    };
                })
            );
            for (let i = 0; i < SpellbarMax; i++)
                new HotbarButton(
                    cache.spellbar,
                    document.createElement("button"),
                    Object.values(SpellKeys)[i].default,
                    [],
                    [],
                    true,
                    true
                );

            cache.keyui = new KeyUI(
                GameScreen.containerElem.querySelector(
                    "#game-keyui"
                ) as HTMLElement,
                SpellbarMax,
                Object.values(SpellKeys).map((v) => v.default)
            );

            const gameNavTechButton: HTMLButtonElement =
                GameScreen.containerElem.querySelector("#game-nav-tech");
            gameNavTechButton.onclick = toggleTechMenu;
            toggleTechMenu();

            // Start the game
            cache.spellbar.start(SpellbarSpeed);
            cache.minionMan.startLevel(LvlOne);
        });
    };
})();

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Toggles visibility of #game-techmenu div.
 * A decorated function that caches #game-techmenu div.
 * Called when #game-nav-tech button is clicked.
 */
export const toggleTechMenu = (() => {
    const cache: {
        techmenu?: HTMLDivElement;
    } = {};

    return () => {
        if (!cache.techmenu) {
            cache.techmenu = document.querySelector("#game-techmenu");
            if (!cache.techmenu) throw new Error("#game-techmenu not found");
        }
        switch (cache.techmenu.style.opacity) {
            default:
            case "":
            case "1":
                cache.techmenu.style.opacity = "0";
                cache.techmenu.style.pointerEvents = "none";
                break;
            case "0":
                cache.techmenu.style.opacity = "1";
                cache.techmenu.style.pointerEvents = "all";
                break;
        }
    };
})();
