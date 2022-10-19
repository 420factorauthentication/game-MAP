import { Base } from "../../lib-pvz/types";

import * as MinionTypes from "../const/minions.js";
import { MinionSpawner } from "../../lib-pvz/minion.js";
import { Hotbar, HotbarSlot } from "../../lib-hotbar/hotbar.js";


// Init HTMLElements //
const gameDiv = document.getElementById("game");

// Init UI //
const hotbar = new Hotbar(4);
new HotbarSlot(hotbar, "A", () => {return true});



// Init Minion System //
const base: Base = {
    hp: 20,
    x: 64,
    y: 240,
    width: 64,
    height: 64,
}
const spawner = new MinionSpawner(base);

// Spawn Minions //
const axeman0 = spawner.spawn (MinionTypes.Axeman, {parent: gameDiv, htmlClass: "minion"});
