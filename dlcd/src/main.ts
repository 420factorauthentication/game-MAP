import { Base } from "../../lib-pvz/types";

import * as MinionTypes from "../const/minions.js";

import MinionSpawner from "../../lib-pvz/spawner.js";
import Hotbar from "../../lib-hotbar/hotbar.js";
import HotbarButton from "../../lib-hotbar/button.js";


// Init Node Handles //
const gameDiv = document.getElementById("game");

// Init UI //
const hotbar = new Hotbar(4);
const button0 = hotbar.newButton ("Q", () => {console.log("Pressed Q")});
const button1 = hotbar.newButton ("W", () => {console.log("Pressed W")});
const button2 = hotbar.newButton ("E", () => {console.log("Pressed E")});
const button3 = hotbar.newButton ("R", () => {console.log("Pressed R")});



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
