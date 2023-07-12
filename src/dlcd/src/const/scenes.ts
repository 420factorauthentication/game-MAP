/** @format */

import Scene from "../../../lib-scene/scene.js";
import SceneLink from "../../../lib-scene/slink.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export const GameStyles: Readonly<SceneLink> = new SceneLink(
    "src/style/game.css"
);

export const StartScreen: Readonly<Scene> = new Scene("src/scene/start.html");
