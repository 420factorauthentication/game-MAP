/** @format */

import Scene from "../../../lib-scene/scene.js";
import SceneLink from "../../../lib-scene/slink.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export const StartScreen: Readonly<Scene> = new Scene("html/start.html");
export const StartStyleComponents: Readonly<SceneLink> = new SceneLink(
    "../../_out/dlcd/css/reuse/start.css"
);

export const GameScreen: Readonly<Scene> = new Scene("html/game.html");
export const GameStyleComponents: Readonly<SceneLink> = new SceneLink(
    "../../_out/dlcd/css/reuse/game.css"
);
export const GameStyleSettings: Readonly<SceneLink> = new SceneLink(
    "../../_out/dlcd/css/set/game.css"
);
