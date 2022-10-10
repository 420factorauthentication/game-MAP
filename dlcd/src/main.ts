import * as MINION_TYPE from "./minions.js";

const game = document.getElementById("game");

let axeman0 = MINION_TYPE.Axeman.spawn();
axeman0.elem.className = "minion";
game.appendChild(axeman0.elem);
