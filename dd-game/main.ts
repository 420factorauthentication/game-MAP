import * as MINIONTYPE from "./minions.js";

const game = document.getElementById("game");

let axeman0 = MINIONTYPE.Axeman.spawn();
axeman0.elem.className = "minion";
game.appendChild(axeman0.elem);
