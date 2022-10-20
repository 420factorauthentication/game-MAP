import { Base } from "../../lib-pvz/types";

import * as MinionTypes from "../const/minions.js";

import { MinionSpawner } from "../../lib-pvz/spawner.js";
// import { Hotbar, HotbarSlot } from "../../lib-hotbar/hotbar.js";


// Init Node Handles //
const gameDiv = document.getElementById("game");

// Init UI //
// const hotbar = new Hotbar(4);
// const hotbarSlot = new HotbarSlot(hotbar, "A", () => {console.log("Pressed A")});


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
