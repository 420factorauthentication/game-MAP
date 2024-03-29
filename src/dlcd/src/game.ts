/** @format */

import {LvlOne} from "./const/levels.js";
import * as Spells from "./const/spells.js";
import {SpellKeys} from "./const/options.js";
import {Wood as WoodBase} from "./const/bases.js";

import {
    GameScreen,
    GameComponents,
    GameStyleComponents,
    GameStyleSettings,
} from "./const/scenes.js";

import {
    SpellbarMax,
    SpellbarSpeed,
    SpawnMinX,
    SpawnMaxX,
    SpawnMinY,
    SpawnMaxY,
} from "./const/game.js";

import Base from "../../lib-pvz/base.js";
import MinionSpawner from "../../lib-pvz/spawner.js";
import Loopbar from "../../lib-hotbar/loopbar.js";
import HotbarButton from "../../lib-hotbar/button.js";
import KeyUI from "../../lib-hotbar/keyui.js";

import {cloneTemplate} from "../../lib-utils/elem.js";

import {ResourceManager} from "./lib/resource.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

type GameFlags = {
    isLoaded?: boolean;
    isPaused?: boolean;
};
type GameEngines = {
    base?: Base;
    minionMan?: MinionSpawner;
    resourceMan?: ResourceManager;
    spellbar?: Loopbar;
    keyui?: KeyUI;
};
type GameMenus = {
    menuTech?: HTMLDivElement;
};

/** All global game variables to cache when the game is loaded. */
type GameCache = GameFlags & GameEngines & GameMenus;

/** A function that needs access to a global game variable. */
type GameFunc<Return> = (cache: GameCache) => Return;

/**
 * A decorator factory.
 * Manages one global {@link GameCache} object and passes it to functions.
 */
const GAME: <Return>(func: GameFunc<Return>) => () => Return = (() => {
    const globalGameCache: GameCache = {};
    return (func) => {
        return () => func(globalGameCache);
    };
})();

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** Starts the game if not started. Does nothing if already started. */
export const StartGame: () => void = GAME((cache) => {
    LoadGame().then((httpStatus) => {
        if (!cache.isLoaded)
            throw new Error(`Error loading game. HTTP Status: ${httpStatus}`);
        const scene = document.querySelector("#game");

        // Init game systems
        cache.spellbar.start();

        // Make inner HTML neater
        scene.append(
            "\n",
            document.createComment("#########################################"),
            "\n",
            document.createComment("################ Minions ################"),
            "\n",
            document.createComment("#########################################"),
            "\n"
        );

        // Start spawning Minions
        const minionModel: HTMLTemplateElement =
            document.querySelector("#new-minion");
        const hpBarModel: HTMLTemplateElement =
            document.querySelector("new-minion-hp-bar");
        cache.minionMan.startLevel(LvlOne, minionModel, hpBarModel, scene);

        // Hide all menus
        ToggleTechMenu();
    });
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

/**
 * Initializes the global {@link GameCache} \
 * Creates all {@link GameEngines} \
 * Queries DOM for {@link GameMenus}
 */
export const LoadGame: () => Promise<number | void> = GAME((cache) => {
    if (cache.isLoaded) return;

    // Make inner HTML neater
    document.body.append(document.createComment("Code injected by dlcd-game"));

    // Load Game
    return GameComponents.load(undefined, "game-templates").then(() =>
        GameScreen.load(undefined, "game", "scene").then((httpStatus) => {
            if (httpStatus != 200) return httpStatus;
            cache.isLoaded = true;

            // Load CSS
            GameStyleComponents.load();
            GameStyleSettings.load();

            // Cache frequently used elements, like menus
            if (!cache.menuTech) {
                cache.menuTech = document.querySelector("#game-techmenu");
                if (!cache.menuTech)
                    throw new Error("#game-techmenu not found");
            }

            // Setup button onclicks
            const gameNavTechButton: HTMLButtonElement =
                GameScreen.containerElem.querySelector("#game-nav-tech");
            gameNavTechButton.onclick = ToggleTechMenu;

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

            cache.resourceMan = new ResourceManager({
                robux: GameScreen.containerElem.querySelector("#robux-counter"),
                cringes:
                    GameScreen.containerElem.querySelector("#cringes-counter"),
            });

            cache.spellbar = new Loopbar(
                SpellbarSpeed,
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
            const spellbarButtonModel: HTMLTemplateElement =
                document.querySelector("#new-spellbar-button");
            for (let i = 0; i < SpellbarMax; i++)
                new HotbarButton(
                    cache.spellbar,
                    cloneTemplate(spellbarButtonModel),
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

            // Return HTTP Status Code
            return httpStatus;
        })
    );
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Toggles visibility of #game-menuTech div.
 * Called when #game-nav-tech button is clicked.
 */
export const ToggleTechMenu: () => void = GAME((cache) => {
    if (!cache.menuTech) throw new Error("Tech menu not loaded");
    switch (cache.menuTech.style.opacity) {
        default:
        case "":
        case "1":
            cache.menuTech.style.opacity = "0";
            cache.menuTech.style.pointerEvents = "none";
            PauseIfMenu();
            break;
        case "0":
            cache.menuTech.style.opacity = "1";
            cache.menuTech.style.pointerEvents = "all";
            Pause();
            break;
    }
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Checks if any {@link GameMenus} are at full opacity. \
 * If any are at full opacity, pauses the Spellbar and all Minions. \
 * If none are at full opacity, unpauses the Spellbar and all Minions.
 */
export const PauseIfMenu: () => void = GAME((cache) => {
    for (const key in cache) {
        if (key.slice(0, 4) !== "menu") continue;
        switch ((cache[key] as HTMLElement).style.opacity) {
            case "":
            case "1":
                Pause();
                return;
            default:
        }
    }
    Unpause();
});

/** Pause the Spellbar and all Minions. */
export const Pause: () => void = GAME((cache) => {
    if (cache.isPaused) return;
    cache.isPaused = true;
    cache.spellbar?.pause();
    cache.minionMan?.pauseLevel();
    cache.minionMan?.pauseMinions();
});

/** Unpause the Spellbar and all Minions. */
export const Unpause: () => void = GAME((cache) => {
    if (cache.isPaused === false) return;
    cache.isPaused = false;
    cache.spellbar?.unpause();
    cache.minionMan?.unpauseLevel();
    cache.minionMan?.unpauseMinions();
});
