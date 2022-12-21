/** @format */

import {Scene} from "./types";

import * as Levels from "../const/levels.js";
import * as Spells from "../const/spells.js";

import Base from "../../../lib-pvz/base.js";
import MinionSpawner from "../../../lib-pvz/spawner.js";
import Rollbar from "../../../lib-hotbar/rollbar.js";
import HotbarButton from "../../../lib-hotbar/button.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export interface _GameScene extends Scene {
    /** Minions will spawn and attack this. If it dies, game over. */
    base?: Base;
    /** A singleton that handles spawning and killing Minions. */
    spawner?: MinionSpawner;
    /** Every second, randomly picks 4 spells. The player can cast one. */
    spellbar?: Rollbar;
}

////////////////////////////////////////////////////////////////////////////////

export const GameScene: _GameScene = {
    activate() {
        // Don't allow multiple instances of the same Scene to be active at once
        if (GameScene.isActive) return;
        GameScene.isActive = true;

        // Init Game
        GameScene.base = new Base(20, 10, 50);
        GameScene.spawner = new MinionSpawner(this.base);
        GameScene.spawner.startLevel(Levels.one);

        // Init Spell UI
        GameScene.spellbar = new Rollbar(4, [
            {
                onPress: Spells.Sword.func(this.spawner),
                styleCssText: Spells.Sword.styleCssText,
                innerHTML: Spells.Sword.innerHTML,
            },
            {
                onPress: () => {},
                styleCssText: "background: red",
                innerHTML: "Placeholder Spell 1",
            },
            {
                onPress: () => {},
                styleCssText: "background: green",
                innerHTML: "Placeholder Spell 2",
            },
            {
                onPress: () => {},
                styleCssText: "background: blue",
                innerHTML: "Placeholder Spell 3",
            },
            {
                onPress: () => {},
                styleCssText: "background: silver",
                innerHTML: "Placeholder Spell 4",
            },
            {
                onPress: () => {},
                styleCssText: "background: purple",
                innerHTML: "Placeholder Spell 5",
            },
            {
                onPress: () => {},
                styleCssText: "background: yellow",
                innerHTML: "Placeholder Spell 6",
            },
            {
                onPress: () => {},
                styleCssText: "background: aqua",
                innerHTML: "Placeholder Spell 7",
            },
        ]);
        new HotbarButton(GameScene.spellbar, "q", true);
        new HotbarButton(GameScene.spellbar, "w", true);
        new HotbarButton(GameScene.spellbar, "e", true);
        new HotbarButton(GameScene.spellbar, "r", true);
        GameScene.spellbar.start(1000);

        // Query stylesheet link element
        let link: HTMLLinkElement = document.querySelector("#sceneStyle");
        if (!link) {
            link = document.createElement("link");
            document.head.appendChild(link);
            link.id = "sceneStyle";
        }

        // Clear previous Scene's stylesheet. This Scene has no stylesheet.
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = "";
    },

    ////////////////////////////////////////////////////////////////////////////

    deactivate() {
        // Do nothing if already inactive
        if (!GameScene.isActive) return;
        GameScene.isActive = false;

        // Cleanup Game
        GameScene.base.destroy();
        GameScene.spawner.stopCurrentLevel();
        GameScene.spawner.destroyAll();

        // Cleanup Spell UI
        GameScene.spellbar.stop();
        GameScene.spellbar.destroy();

        // Delete handles to trigger garbage collection
        delete GameScene.base;
        delete GameScene.spawner;
        delete GameScene.spellbar;
    },
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default GameScene;
