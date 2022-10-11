import * as MINION from "../../lib-pvz/minion.js"
import * as MinionTypes from "./minions.js";

const game = document.getElementById("game");

const spawner = new MINION.MinionSpawner();

let axeman0 = spawner.spawn(MinionTypes.Axeman);
axeman0.elem.className = "minion";
game.appendChild(axeman0.elem);
