/** @format */

import {LvlOne} from "./const/levels.js";
import * as Spells from "./const/spells.js";
import {SpellKeys} from "./const/options.js";
import {Wood as WoodBase} from "./const/bases.js";

import {
    GameScreen,
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

import {ResourceManager} from "./resource.js";
import Base from "../../lib-pvz/base.js";
import MinionSpawner from "../../lib-pvz/spawner.js";
import Loopbar from "../../lib-hotbar/loopbar.js";
import HotbarButton from "../../lib-hotbar/button.js";
import KeyUI from "../../lib-hotbar/keyui.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** All global game variables to cache when the game is loaded. */
export type GameCache = GameFlags & GameEngines & GameMenus;
export type GameFlags = {
    isLoaded?: boolean;
    isPaused?: boolean;
};
export type GameEngines = {
    base?: Base;
    minionMan?: MinionSpawner;
    resourceMan?: ResourceManager;
    spellbar?: Loopbar;
    keyui?: KeyUI;
};
export type GameMenus = {
    menuTech?: HTMLDivElement;
};

/** A function that needs access to a global game variable. */
export type GameFunc<Return> = (cache: GameCache) => Return;

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

        // Init game systems
        cache.spellbar.start();
        cache.minionMan.startLevel(LvlOne);
        // Hide all menus
        ToggleTechMenu();
    });
});

////////////////////////////////////////////////////////////////////////////////
/**
 * Initializes the global {@link GameCache} \
 * Creates all {@link GameEngines} \
 * Queries DOM for {@link GameMenus}
 */
export const LoadGame: () => Promise<number | void> = GAME((cache) => {
    if (cache.isLoaded) return;
    return GameScreen.load(undefined, "scene", "game").then((httpStatus) => {
        if (httpStatus != 200) return httpStatus;
        cache.isLoaded = true;

        // Load CSS
        GameStyleComponents.load();
        GameStyleSettings.load();

        // Query elements
        if (!cache.menuTech) {
            cache.menuTech = document.querySelector("#game-techmenu");
            if (!cache.menuTech) throw new Error("#game-techmenu not found");
        }

        // Setup button onclicks
        const gameNavTechButton: HTMLButtonElement =
            GameScreen.containerElem.querySelector("#game-nav-tech");
        gameNavTechButton.onclick = ToggleTechMenu;

        // Init game components
        cache.base = new Base(
            WoodBase.hp,
            WoodBase.x,
            GameScreen.containerElem.querySelector("#game-hpbar") as HTMLElement
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

        // Return HTTP Status Code
        return httpStatus;
    });
});

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
