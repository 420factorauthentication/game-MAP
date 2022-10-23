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
    x: 10,
    y: 50,
    width: 5,
    height: 5,
}
const spawner = new MinionSpawner(base);

// Spawn Minions //
spawner.spawn (MinionTypes.Axeman, {parent: gameDiv, htmlClass: "minion"});


// Test Spells //
spawner.spawn (MinionTypes.Axeman, {parent: gameDiv, htmlClass: "minion"});
spawner.spawn (MinionTypes.Axeman, {parent: gameDiv, htmlClass: "minion"});
spawner.spawn (MinionTypes.Axeman, {parent: gameDiv, htmlClass: "minion"});
spawner.minions[1].changeMovSpd(2);
spawner.minions[2].changeMovSpd(4);
spawner.minions[3].changeMovSpd(6);
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

// stats.addMod("movSpd", 2, 1000);
// checkStats();
// setTimeout(checkStats, 1500);

// stats.change("movSpd", 2);
// checkStats();


// Test Minion Stats
// axeman0.modMovSpd(10, 2000);

// console.log(axeman0.hp);
// axeman0.changeHp(-1);
// console.log(axeman0.hp);




// TEST //
// let arr = [[3, 4], [1, 2]];
// let arrCopy = [...arr];

// arrCopy.sort((a, b) => {
//     if (a[0] < b[0]) return -1;
//     if (a[0] > b[0]) return 1;
//     return 0;
// });

// console.log(arr);
// console.log(arrCopy);
// console.log("-------");

// arrCopy[0].push(300);
// console.log(arr);
// console.log(arrCopy);
