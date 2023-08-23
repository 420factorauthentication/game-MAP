/** @format */

import Scene from "../../../lib-scene/scene.js";
import SceneLink from "../../../lib-scene/slink.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export const StartStyles: Readonly<SceneLink> = new SceneLink(
    "../../_out/dlcd/css/start.css"
);
export const GameStyles: Readonly<SceneLink> = new SceneLink(
    "../../_out/dlcd/css/game.css"
);

export const StartScreen: Readonly<Scene> = new Scene("html/start.html");
export const GameScreen: Readonly<Scene> = new Scene("html/game.html");
