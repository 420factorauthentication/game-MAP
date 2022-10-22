import { Base } from "../../lib-pvz/types";

import * as MinionTypes from "../const/minions.js";
import * as Spells from  "../const/spells.js"

import MinionSpawner from "../../lib-pvz/spawner.js";
import Hotbar from "../../lib-hotbar/hotbar.js";
import HotbarButton from "../../lib-hotbar/button.js";
import Stats from "../../lib-statsys/stats.js";


// Init Node Handles //
const gameDiv = document.getElementById("game");

// Init UI //
const hotbar = new Hotbar(4);



// Test removing buttons
// new HotbarButton (hotbar, "q", () => {console.log("Pressed q")});
// new HotbarButton (hotbar, "w", () => {console.log("Pressed w")});
// new HotbarButton (hotbar, "e", () => {console.log("Pressed e")});
// new HotbarButton (hotbar, "r", () => {console.log("Pressed r")});
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
spawner.spawn (MinionTypes.Axeman, {parent: gameDiv, htmlClass: "minion"});


// Test Spells //
const swordSpell = Spells.getSwordSpell(spawner);
new HotbarButton (hotbar, "q", swordSpell);



// Test Stat System //
// const stats = new Stats(MinionTypes.Axeman);

// function checkStats() {
//     for (const key in stats.base) {
//         console.log(`${key}: ${stats.base[key]} base, ${stats.current(key)} current`);
//     }
//     console.log("-------");
// }

// checkStats();

// stats.addMod("movSpd", 20, 1000);
// checkStats();
// setTimeout(checkStats, 1500);

// stats.change("movSpd", 20);
// checkStats();


// Test Minion Stats
// axeman0.modMovSpd(100, 2000);

// console.log(axeman0.hp);
// axeman0.changeHp(-1);
// console.log(axeman0.hp);
