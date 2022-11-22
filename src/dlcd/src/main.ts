/** @format */

import * as Levels from "../const/levels.js";
import * as Spells from "../const/spells.js";

import MinionSpawner from "../../lib-pvz/spawner.js";
import Base from "../../lib-pvz/base.js";
import Hotbar from "../../lib-hotbar/hotbar.js";
import HotbarButton from "../../lib-hotbar/button.js";
import Rollbar from "../../lib-hotbar/rollbar.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Init Node Handles //
const gameDiv = document.getElementById("game");

// Init Minion System //
const base = new Base(20, 10, 50);
const spawner = new MinionSpawner(base);

// Init Spell Rollbar System //
const rollbar = new Rollbar(4, [
    {
        onPress: Spells.Sword.func(spawner),
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
rollbar.start(1000);

// Spawn Minions //
spawner.startLevel(Levels.one);
