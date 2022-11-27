/** @format */

import * as Levels from "../const/levels.js";
import * as Spells from "../const/spells.js";

import MinionSpawner from "../../../lib-pvz/spawner.js";
import Base from "../../../lib-pvz/base.js";
import Rollbar from "../../../lib-hotbar/rollbar.js";
import HotbarButton from "../../../lib-hotbar/button.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const GameScene: {
    /** Minions will spawn and attack this. If it dies, game over. */
    base?: Base;

    /** A singleton that handles spawning and killing Minions. */
    spawner?: MinionSpawner;

    /** Every second, randomly picks 4 spells. The player can cast one. */
    spellbar?: Rollbar;

    /** Is this Scene currently displaying it's DOM Elements? */
    isActive?: boolean;

    /** Create this Scene's DOM Elements. */
    activate(): void;

    /** Destroy this Scene's DOM Elements and cleanup all garbage. */
    deactivate(): void;
} = {
    /** Creates this Scene's DOM Elements. */
    activate() {
        if (GameScene.isActive) return;
        GameScene.isActive = true;

        GameScene.base = new Base(20, 10, 50);
        GameScene.spawner = new MinionSpawner(this.base);
        GameScene.spawner.startLevel(Levels.one);

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
    },

    /** Destroy this Scene's DOM Elements and cleanup all garbage. */
    deactivate() {
        if (!GameScene.isActive) return;
        GameScene.isActive = false;

        GameScene.base.destroy();
        GameScene.spawner.stopCurrentLevel();
        GameScene.spawner.destroyAll();

        GameScene.spellbar.stop();
        GameScene.spellbar.destroy();

        delete GameScene.base;
        delete GameScene.spawner;
        delete GameScene.spellbar;
    },
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default GameScene;
