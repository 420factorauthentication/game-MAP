/** @format */

import Scene from "../../../lib-scene/scene.js";
import SceneLink from "../../../lib-scene/slink.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export const StartScreen = new Scene("html/start.html");
export const StartStyleComponents = new SceneLink(
    "../../_out/dlcd/css/reuse/start.css"
);

export const GameScreen = new Scene("html/game.html");
export const GameStyleComponents = new SceneLink(
    "../../_out/dlcd/css/reuse/game.css"
);
export const GameStyleSettings = new SceneLink(
    "../../_out/dlcd/css/set/game.css"
);
