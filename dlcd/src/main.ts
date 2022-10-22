import { Base } from "../../lib-pvz/types";

import * as MinionTypes from "../const/minions.js";

import MinionSpawner from "../../lib-pvz/spawner.js";
import Hotbar from "../../lib-hotbar/hotbar.js";
import HotbarButton from "../../lib-hotbar/button.js";


// Init Node Handles //
const gameDiv = document.getElementById("game");

// Init UI //
const hotbar = new Hotbar(4);
new HotbarButton (hotbar, "Q", () => {console.log("Pressed Q")});
new HotbarButton (hotbar, "W", () => {console.log("Pressed W")});
new HotbarButton (hotbar, "E", () => {console.log("Pressed E")});
new HotbarButton (hotbar, "R", () => {console.log("Pressed R")});

// Test removing buttons
// setTimeout(() => {hotbar.remove(0);}, 1000);
// setTimeout(() => {hotbar.remove(0);}, 2000);
// setTimeout(() => {hotbar.remove(0);}, 3000);
// setTimeout(() => {hotbar.remove(0);}, 4000);

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
