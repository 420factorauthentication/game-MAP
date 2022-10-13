
////////////////////////
// JavaScript Imports //
////////////////////////

// Constants //
import * as MinionTypes from "../const/minions.js";

// Classes //
import { MinionSpawner } from "../../lib-pvz/minion.js";


////////////////////////
// TypeScript Imports //
////////////////////////

// Interfaces //
import { Base } from "../../lib-pvz/base";


///////////////////////
// Init HTMLElements //
///////////////////////
const gameDiv = document.getElementById("game");

////////////////////////
// Init Minion System //
////////////////////////
const base: Base = {
    hp: 20,
    x: 64,
    y: 240,
    width: 64,
    height: 64,
}
const spawner = new MinionSpawner(base);

///////////////////
// Spawn Minions //
///////////////////
const axeman0 = spawner.spawn (MinionTypes.Axeman, "minion", gameDiv);
