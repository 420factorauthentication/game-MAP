/** @format */

import Scene from "../../../lib-scene/scene.js";
import SceneLink from "../../../lib-scene/slink.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export const GameStyles: Readonly<SceneLink> = new SceneLink(
    "../../_out/dlcd/src/style/game.css"
);

export const StartScreen: Readonly<Scene> = new Scene("src/scene/start.html");
export const GameScreen: Readonly<Scene> = new Scene("src/scene/game.html");

export const UiBlankOverlay: Readonly<Scene> = new Scene(
    "src/scene/ui-blank.html"
);
