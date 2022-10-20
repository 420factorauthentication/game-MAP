import { Base } from "../../lib-pvz/types";

import * as MinionTypes from "../const/minions.js";

import MinionSpawner from "../../lib-pvz/spawner.js";
import Hotbar from "../../lib-hotbar/hotbar.js";
import HotbarSlot from "../../lib-hotbar/slot.js";


// Init Node Handles //
const gameDiv = document.getElementById("game");

// Init UI //
const hotbar = new Hotbar(4);
const hotbarSlot0 = new HotbarSlot(hotbar, "Q", () => {console.log("Pressed Q")});
const hotbarSlot1 = new HotbarSlot(hotbar, "W", () => {console.log("Pressed W")});
const hotbarSlot2 = new HotbarSlot(hotbar, "E", () => {console.log("Pressed E")});
const hotbarSlot3 = new HotbarSlot(hotbar, "R", () => {console.log("Pressed R")});



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
