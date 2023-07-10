/** @format */

import Scene from "../../../lib-scene/scene.js";
import SceneLink from "../../../lib-scene/slink.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export const StartScreen: Readonly<Scene> = new Scene("src/scene/start.html");
export const StartScreenStyle: Readonly<SceneLink> = new SceneLink(
    "src/scene/start.css"
);
